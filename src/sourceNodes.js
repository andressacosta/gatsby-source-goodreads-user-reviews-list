import fetch from 'node-fetch'
import { parseString } from 'xml2js'

async function sourceNodes(
  { actions, createNodeId, createContentDigest },
  configOptions
) {
  const { createNode } = actions
  const { apiKey, userId, booksPerPage } = configOptions

  delete configOptions.plugins

  let apiUrl = `https://www.goodreads.com/review/list/${userId}.xml?key=${apiKey}&v=2&per_page=${booksPerPage}`
  let page = 1
  let grResponse = []

  const fetchData = async url => {
    const data = await fetch(url)
      .then(response => response.text())
      .then(data => {
        let response
        parseString(
          data,
          (err, result) => (response = result.GoodreadsResponse.reviews[0])
        )
        return response
      })

    data.review.map(book => grResponse.push(book))

    if (data.$.total > data.$.end) {
      page++
      await fetchData(`${apiUrl}&page=${page}`)
    }

    return grResponse
  }

  const processBook = async book => {
    try {
      const nodeId = createNodeId(`goodreads-book-${book.id}`)
      const nodeContent = JSON.stringify(book)
      const node = Object.assign({}, book, {
        id: nodeId,
        parent: null,
        children: [],
        internal: {
          type: `GoodreadsBook`,
          content: nodeContent,
          contentDigest: createContentDigest(book),
        },
      })
      createNode(node)
    } catch (error) {
      console.warn('ERROR:', error)
    }
  }

  const books = await fetchData(apiUrl)

  books.forEach(async book => {
    await processBook(book)
  })
}

export default sourceNodes

# gatsby-source-goodreads-user-reviews-list
Gatsby source plugin to fetch all books under a user review from Goodreads API + [Gatsby Image](https://www.gatsbyjs.org/packages/gatsby-image/) support.

-> Goodreads API key https://www.goodreads.com/api/keys

# Usage
Query data like this:

 ```
 query myQuery {
    allGoodreadsBook {
      edges {
        node {
          book {
            title_without_series
            authors {
              author {
                name
              }
            }
            num_pages
            publication_year
            description
          }
          shelves {
            shelf {
              _ {
                name
              }
            }
          }
          rating
          read_at
          date_updated
          localImage {
            childImageSharp {
              fixed(width: 98) {
                ...GatsbyImageSharpFixed_withWebp_noBase64
              }
            }
          }
        }
      }
      totalCount
    }
}
 ```
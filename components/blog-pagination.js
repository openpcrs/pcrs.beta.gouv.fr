import PropTypes from 'prop-types'
import Link from 'next/link'
import {useRouter} from 'next/router'

const BlogPagination = ({page, pages, prev, next}) => {
  const router = useRouter()

  const pageNumbers = Array.from({length: pages}, (_, i) => i + 1)
  const href = `${router.route}?page=`

  return (
    <nav role='navigation' className='fr-pagination' aria-label='Pagination'>
      <ul className='fr-pagination__list'>
        {/* Prev pages buttons */}
        {prev ? (
          <>
            <li>
              <Link href={prev ? `${href}1` : ''} legacyBehavior>
                <a
                  className='fr-pagination__link fr-pagination__link--first'
                  aria-disabled='true'
                  role='link'
                >
                  Première page
                </a>
              </Link>
            </li>
            <li>
              <Link href={prev ? `${href}${prev}` : ''} legacyBehavior>
                <a className='fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label' aria-disabled='true' role='link'>
                  Page précédente
                </a>
              </Link>
            </li>
          </>
        ) : (
          <>
            <a
              className='fr-pagination__link fr-pagination__link--first'
              aria-disabled='true'
              role='link'
            >
              Première page
            </a>

            <a
              className='fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label'
              aria-disabled='true'
              role='link'
            >
              Page précédente
            </a>
          </>
        )}

        {/* Display all pages */}
        {pageNumbers.map(pageNumber => (
          <li key={pageNumber}>
            <Link href={`${href}${pageNumber}`} legacyBehavior>
              {pageNumber === page ? (
                <a className='fr-pagination__link' aria-current='page' title={`Page ${pageNumber}`}>
                  {pageNumber}
                </a>
              ) : (
                <a className='fr-pagination__link' title={`Page ${pageNumber}`}>
                  {pageNumber}
                </a>
              )}

            </Link>
          </li>
        ))}

        {/* Next pages buttons */}
        {next ? (
          <>
            <li>
              <Link href={`${href}${next}`} legacyBehavior>
                <a className='fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label' href='#'>
                  Page suivante
                </a>
              </Link>
            </li>
            <li>
              <Link href={`${href}${pages}`} legacyBehavior>
                <a className='fr-pagination__link fr-pagination__link--last' href='#'>
                  Dernière page
                </a>
              </Link>
            </li>

          </>
        ) : (
          <>
            <li>
              <a className='fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label'>
                Page suivante
              </a>
            </li>
            <li>
              <a className='fr-pagination__link fr-pagination__link--last'>
                Dernière page
              </a>
            </li></>
        )}
      </ul>
    </nav>
  )
}

BlogPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  prev: PropTypes.number,
  next: PropTypes.number
}

BlogPagination.defaultProps = {
  prev: null,
  next: null
}

export default BlogPagination

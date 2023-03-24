import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleMenuOpen = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header role='banner' className='header fr-header'>
      <div className='fr-header__body'>
        <div className='fr-container'>
          <div className='fr-header__body-row'>
            <div className='header-redirect fr-header__brand fr-enlarge-link'>
              <div className='fr-header__brand-top'>
                <Link href='/'>
                  <div className='fr-header__logo'>
                    <p className='fr-logo'>
                      RÉPUBLIQUE<br />FRANÇAISE
                    </p>
                  </div>
                </Link>
                <div className='fr-header__navbar'>
                  <button type='button' className='fr-btn--menu fr-btn' onClick={handleMenuOpen}>
                    Menu
                  </button>
                </div>
              </div>
              <Link href='/'>
                <div className='fr-header__service'>
                  <Image
                    src='/images/logos/logo-pcrsgouvfr.png'
                    height='25'
                    width='205'
                    alt='pcrs.beta.gouv.fr'
                  />
                </div>
              </Link>
            </div>

            <div className='fr-header__tools'>
              <div className='fr-header__tools-links'>
                <ul className='fr-btns-group'>
                  <li>
                    <Link legacyBehavior href='/suivi-pcrs'>
                      <a className='fr-btn fr-icon-road-map-line'>
                        Suivi géographique
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link legacyBehavior href='/blog'>
                      <a className='fr-btn fr-icon-article-line'>
                        Blog du PCRS
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a
                      href='https://docs.pcrs.beta.gouv.fr/'
                      className='fr-btn fr-icon-book-2-line'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Espace documentaire
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className='custom-mobile-menu'>
          <button
            type='button'
            className='fr-btn--close fr-btn'
            title='Fermer'
            onClick={handleMenuOpen}
          >
            Fermer
          </button>
          <div className='fr-header__menu-links'>
            <ul className='fr-btns-group'>
              <li>
                <Link legacyBehavior href='/suivi-pcrs'>
                  <a className='fr-btn fr-icon-road-map-line'>
                    Suivi géographique
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href='/blog'>
                  <a className='fr-btn fr-icon-article-line'>
                    Blog du PCRS
                  </a>
                </Link>
              </li>
              <li>
                <a
                  href='https://docs.pcrs.beta.gouv.fr/'
                  className='fr-btn fr-icon-book-2-line'
                  target='_blank'
                  rel='noreferrer'
                >
                  Espace documentaire
                </a>
              </li>
            </ul>
          </div>

        </div>
      )}

      <style jsx>{`
        .header {
          z-index: 2
        }

        .header-redirect {
          cursor: pointer;
        }

      a {
        width: 100%;
      }

      .custom-mobile-menu {
        z-index: 3;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        padding: 1.5em;
      }
    `}</style>
    </header>
  )
}

export default Header

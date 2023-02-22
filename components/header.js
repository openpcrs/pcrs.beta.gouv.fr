import Image from 'next/image'
import Link from 'next/link'

const Header = () => (
  <header role='banner' className='fr-header'>
    <div className='fr-header__body'>
      <div className='fr-container'>
        <div className='fr-header__body-row'>
          <Link legacyBehavior href='/'>
            <div className='header-redirect fr-header__brand fr-enlarge-link'>
              <div className='fr-header__brand-top'>
                <div className='fr-header__logo'>
                  <p className='fr-logo'>
                    RÉPUBLIQUE<br />FRANÇAISE
                  </p>
                </div>
                <div className='fr-header__navbar'>
                  <button type='button' className='fr-btn--menu fr-btn' data-fr-opened='false' aria-controls='modal-499' aria-haspopup='menu' id='button-500' title='Menu'>
                    Menu
                  </button>
                </div>
              </div>
              <div className='fr-header__service'>
                <Image
                  src='/images/logos/logo-pcrsgouvfr.png'
                  height='25'
                  width='205'
                  alt='pcrs.beta.gouv.fr'
                />
              </div>
            </div>
          </Link>
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
    <div className='fr-header__menu fr-modal' id='modal-499' aria-labelledby='button-500'>
      <div className='fr-container'>
        <button type='button' className='fr-btn--close fr-btn' aria-controls='modal-499' title='Fermer'>
          Fermer
        </button>
        <div className='fr-header__menu-links' />
      </div>
    </div>

    <style jsx>{`
      .header-redirect {
        cursor: pointer;
      }

      a {
        width: 100%;
      }
    `}</style>
  </header>
)

export default Header

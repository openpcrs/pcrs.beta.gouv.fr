import Image from 'next/image'
import Link from 'next/link'

const Header = () => (
  <header role='banner' className='fr-header'>
    <div className='fr-header__body'>
      <div className='fr-container'>
        <div className='fr-header__body-row'>
          <Link href='/' legacyBehavior>
            <a>
              <div className='fr-header__brand fr-enlarge-link'>
                <div className='fr-header__brand-top'>
                  <div className='fr-header__logo'>
                    <p className='fr-logo'>
                      RÉPUBLIQUE<br />FRANÇAISE
                    </p>
                  </div>
                </div>
                <div className='fr-header__service'>
                  <Image
                    src='/images/logos/logo-pcrsgouvfr.svg'
                    height='50'
                    width='220'
                    alt='pcrs.beta.gouv.fr'
                  />
                </div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>

    <style jsx>{`
      a {
        width: 100%;
      }
    `}</style>
  </header>
)

export default Header

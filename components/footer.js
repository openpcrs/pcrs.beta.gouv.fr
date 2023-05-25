import {useState} from 'react'
import Link from 'next/link'

import AdminAuthentificationModal from '@/components/suivi-form/authentification/admin-authentification-modal.js'

const Footer = () => {
  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)

  const handleModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)
  return (
    <>
      <footer className='fr-footer' role='contentinfo' id='footer'>
        <div className='fr-container'>
          <div className='fr-footer__body'>
            <div className='fr-footer__brand fr-enlarge-link'>
              <Link href='/' title='Retour à l’accueil du site - PCRS'>
                <p className='fr-logo'>
                  République<br />Française
                </p>
              </Link>
            </div>
            <div className='fr-footer__content'>
              <ul className='fr-footer__content-list'>
                <li className='fr-footer__content-item'>
                  <a
                    className='fr-footer__content-link'
                    target='_blank'
                    href='https://legifrance.gouv.fr'
                    rel='noreferrer'
                  >
                    legifrance.gouv.fr
                  </a>
                </li>
                <li className='fr-footer__content-item'>
                  <a
                    className='fr-footer__content-link'
                    target='_blank'
                    href='https://gouvernement.fr'
                    rel='noreferrer'
                  >
                    gouvernement.fr
                  </a>
                </li>
                <li className='fr-footer__content-item'>
                  <a
                    className='fr-footer__content-link'
                    target='_blank'
                    href='https://service-public.fr'
                    rel='noreferrer'
                  >
                    service-public.fr
                  </a>
                </li>
                <li className='fr-footer__content-item'>
                  <a
                    className='fr-footer__content-link'
                    target='_blank'
                    href='https://data.gouv.fr'
                    rel='noreferrer'
                  >
                    data.gouv.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='fr-footer__bottom'>
            <ul className='fr-footer__bottom-list'>
              <li className='fr-footer__bottom-item'>
                <button
                  className='fr-footer__bottom-link'
                  type='button'
                  label='Accéder à au panneau d’authentification'
                  onClick={() => setIsAuthentificationModalOpen(true)}
                >
                  Accès administrateur
                </button>
              </li>
              <li className='fr-footer__bottom-item'>
                <Link
                  href='/declaration-accessibilite'
                  title='Déclaration d’accessibilité'
                  className='fr-footer__bottom-link'
                >
                  Déclaration d’accessibilité : non-conforme
                </Link>
              </li>
              <li className='fr-footer__bottom-item'>
                <Link
                  href='/mentions-legales'
                  title='Mentions légales'
                  className='fr-footer__bottom-link'
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
            <div className='fr-footer__bottom-copy'>
              <p>
                Sauf mention contraire, tous les contenus de ce site sont sous <a href='https://github.com/etalab/licence-ouverte/blob/master/LO.md' target='_blank' rel='noreferrer'>licence etalab-2.0</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {isAuthentificationModalOpen && <AdminAuthentificationModal handleModalClose={handleModal} />}
    </>
  )
}

export default Footer

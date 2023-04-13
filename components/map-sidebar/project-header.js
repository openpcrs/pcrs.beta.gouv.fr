import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {deleteSuivi} from '@/lib/suivi-pcrs.js'

import colors from '@/styles/colors.js'

import HiddenInfos from '@/components/hidden-infos.js'
import Button from '@/components/button.js'
import Modal from '@/components/modal.js'
import AuthentificationModal from '@/components/suivi-form/authentification-modal.js'

const Header = ({projectId, projectName, territoires}) => {
  const router = useRouter()
  const [isTerritoiresShow, setIsTerritoiresShow] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteValidationMessage, setDeleteValidationMessage] = useState(null)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null)
  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const hasToMuchTerritoires = territoires.length >= 4

  const handleAuthentificationModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)
  const handleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen)

  useEffect(() => {
    setToken(localStorage.getItem('Token'))
    setIsLoading(false)
  }, [])

  const onDelete = async () => {
    setDeleteValidationMessage(null)
    setDeleteErrorMessage(null)

    try {
      if (token) {
        await deleteSuivi(projectId, token)

        setDeleteValidationMessage('le projet a bien été supprimé')
        setTimeout(() => {
          router.reload(window.location.pathname)
        }, 2000)
      } else {
        setIsAuthentificationModalOpen(true)
      }
    } catch {
      setDeleteErrorMessage('Impossible de supprimer ce projet')
    }
  }

  return (
    <div className='header'>
      <div className='fr-grid-row fr-my-2w'>
        <h1 className='fr-h4 fr-m-0 fr-col-9'>{projectName}</h1>
        <div>
          {token && (
            <>
              <button
                type='button'
                className='fr-btn--tertiary-no-outline fr-px-1w'
                aria-label='Editer le projet'
                onClick={() => router.push(`/formulaire-suivi?id=${projectId}`)}
              >
                <span className='fr-icon-edit-line ' aria-hidden='true' />
              </button>

              <button
                type='button'
                className='fr-btn--tertiary-no-outline'
                aria-label='Supprimer le projet'
                onClick={handleDeleteModalOpen}
              >
                <span className='fr-icon-delete-line' aria-hidden='true' />
              </button>
            </>
          )}

          {isDeleteModalOpen && (
            <Modal title='Confirmer la suppression du projet' onClose={handleDeleteModalOpen}>
              <p className='modal-content fr-mb-0'>Êtes-vous bien sûr de vouloir supprimer le suivi de <b>{projectName}</b> ? </p><br />
              <p className='irreversible'><b>Cette action est irréversible</b></p>
              <div className='fr-grid-row fr-grid-row--center'>
                <Button
                  label='Confirmer la suppression'
                  isDisabled={Boolean(deleteValidationMessage)}
                  onClick={() => onDelete()}
                >
                  Supprimer le projet
                </Button>
              </div>
              {deleteValidationMessage && (
                <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-0'>
                  {deleteValidationMessage}
                </p>
              )}

              {deleteErrorMessage && (
                <p className='fr-grid-row fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
                  {deleteErrorMessage}
                </p>
              )}
            </Modal>
          )}
        </div>
      </div>

      {isAuthentificationModalOpen && !isLoading && <AuthentificationModal handleToken={setToken} handleModal={handleAuthentificationModal} />}

      <div className='fr-text--lg fr-my-0'>Liste des territoires</div>
      {hasToMuchTerritoires ? (
      // More than 5 territoires
        <div>
          {isTerritoiresShow ? (
          // Display complete territoires list
            <HiddenInfos theme='secondary' onClose={() => setIsTerritoiresShow(false)}>
              {territoires.map((territoire, idx) => (
                <span key={territoire.nom} className='fr-text--sm'>
                  {territoire.nom} {idx === territoires.length - 1 ? '' : ' - '}
                </span>
              ))}
            </HiddenInfos>
          ) : (
          // Display shorten list
            <>
              {territoires.slice(0, 4).map((territoire, idx) => (
                <span key={territoire.nom}>{territoire.nom} {idx === 3 ? '' : ' - '}</span>
              ))}
              <button
                type='button'
                className='fr-btn--tertiary-no-outline'
                onClick={() => setIsTerritoiresShow(true)}
              >
                ...afficher la liste des territoires
              </button>
            </>
          )}
        </div>
      ) : (
      // Less than 5 territoires
        territoires.map((territoire, idx) => (
          <span key={territoire.nom}>
            {territoire.nom} {idx === territoires.length - 1 ? '' : ' - '}
          </span>
        ))
      )}

      <style jsx>{`
        .header {
          padding: 1em;
        }

        .header, h1 {
          background: ${colors.info425};
          color: white;
        }

        .fr-text--lg {
          font-weight: bold;
        }

        .fr-btn--tertiary-no-outline {
          color: white;
          font-style: italic;
          text-decoration: underline;
        }

        .fr-btn--tertiary-no-outline:hover {
          color: ${colors.grey50};
        }

        .modal-content {
          color: ${colors.darkgrey};
        }

        .irreversible {
          text-decoration: underline;
          text-align: center;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

Header.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  territoires: PropTypes.array
}

Header.defaultProps = {
  territoires: []
}

export default Header

import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import ResetModal from '@/components/map-sidebar/reset-modal.js'
import DeleteModal from '@/components/suivi-form/delete-modal.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

const SHARE_URL = process.env.NEXT_PUBLIC_PROJECT_SHARE_URL || 'https://pcrs.beta.gouv.fr'

const EditorActions = ({nom, projectId, editorCode}) => {
  const router = useRouter()
  const {userRole, token} = useContext(AuthentificationContext)

  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditCodeShow, setIsEditCodeShow] = useState(false)

  const shareCodeUrl = `${SHARE_URL}/formulaire-suivi?id=${projectId}&editcode=${editorCode}`
  const editCodeUrl = `${SHARE_URL}/formulaire-suivi?id=${projectId}&editcode=${editorCode}`
  const editorFormUrl = `/formulaire-suivi?id=${projectId}&editcode=${editorCode}`

  const handleResetModal = () => setIsResetModalOpen(!isResetModalOpen)
  const handleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen)
  const handleEditCodeShow = () => setIsEditCodeShow(!isEditCodeShow)

  return (
    <div className='actions-container fr-grid-row fr-mb-6w fr-p-2w'>
      {userRole === 'admin' && (
        <div className='fr-col-12 fr-col-md-6 fr-mb-5w fr-mb-md-0'>
          <div className='fr-mb-2w'>
            <Button
              label='Réinitialiser le lien de partage'
              icon='refresh-line'
              size='sm'
              onClick={handleResetModal}
            >
              Réinitialiser le lien de partage
            </Button>
          </div>

          <div className='fr-col-12'>
            <div>
              <b className='fr-text fr-m-0 fr-mb-2w fr-px-2v display-toggle' onClick={handleEditCodeShow}>
                Afficher le lien d’édition <span className={`fr-icon-arrow-${isEditCodeShow ? 'down' : 'right'}-s-line`} aria-hidden='true' />
              </b>

              {isEditCodeShow && (
                <div className='fr-mt-2w'>
                  <div style={{cursor: 'pointer'}} onClick={() => navigator.clipboard.writeText(shareCodeUrl)}>
                    <span className='fr-icon-clipboard-line' aria-hidden='true' /> Copier
                  </div>
                  <i className='fr-mt-1w'><a className='fr-text--xs link' href={shareCodeUrl}>{shareCodeUrl}</a></i>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`${userRole === 'admin' ? 'fr-col-12 fr-col-md-6' : 'fr-col-12'} fr-grid-row fr-grid-row--top edit-actions`}>
        <div className='fr-grid-row fr-grid-row--right fr-col-12 fr-mt-3w'>
          <Button
            label='Éditer le projet'
            icon='edit-line'
            size='sm'
            onClick={() => router.push(editorFormUrl)}
          >
            Éditer le projet
          </Button>
        </div>

        <div className='fr-grid-row fr-grid-row--right fr-col-12 fr-mt-3w'>
          <button
            type='button'
            aria-label='Supprimer le projet'
            icon='delete-line'
            className='delete-button'
            onClick={handleDeleteModalOpen}
          >
            <span className='fr-icon-delete-fill fr-icon--sm fr-mr-1w' aria-hidden='true' />Supprimer le projet
          </button>
        </div>
      </div>

      {isResetModalOpen && (
        <ResetModal
          projectId={projectId}
          token={token}
          currentEditUrl={editCodeUrl}
          onClose={handleResetModal}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          nom={nom}
          id={projectId}
          authorizationCode={token}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      )}

      <style jsx>{`
        .actions-container {
          background: ${userRole === 'admin' ? colors.blueFrance975 : 'none'};
          border-radius: 5px;
          height: fit-content;
        }

        .edit-actions {
          height: fit-content;
        }

        .delete-button {
          color: ${colors.redMarianne425};
          font-weight: bold;
          border: 1px solid ${colors.redMarianne425};
          padding: .5em;
        }

        .link {
          word-wrap: break-word;
        }

        .display-toggle {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

EditorActions.propTypes = {
  nom: PropTypes.string.isRequired,
  editorCode: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
}

export default EditorActions

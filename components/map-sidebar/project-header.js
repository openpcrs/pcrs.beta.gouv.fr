import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import colors from '@/styles/colors.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import ResetModal from '@/components/map-sidebar/reset-modal.js'
import DeleteModal from '@/components/suivi-form/delete-modal.js'
import Tooltip from '@/components/tooltip.js'
import HiddenInfos from '@/components/hidden-infos.js'

const SHARE_URL = process.env.NEXT_PUBLIC_PROJECT_SHARE_URL || 'https://pcrs.beta.gouv.fr'

const Header = ({projectId, codeEditor, projectName, territoires, projets, onProjetChange}) => {
  const router = useRouter()
  const {userRole, token} = useContext(AuthentificationContext)

  const [isTerritoiresShow, setIsTerritoiresShow] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const handleResetModal = () => setIsResetModalOpen(!isResetModalOpen)

  const hasToMuchTerritoires = territoires.length >= 4
  const isAdmin = userRole === 'admin'
  const editorFormUrl = `/formulaire-suivi?id=${projectId}&editcode=${codeEditor}`

  const handleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen)

  const url = `${SHARE_URL}/formulaire-suivi?id=${projectId}&editcode=${codeEditor}`

  return (
    <div className='header'>
      <div className='fr-grid-row fr-my-2w'>
        <h1 className='fr-h4 fr-m-0 fr-col-8'>{projectName}</h1>
        {isAdmin && (
          <div className='fr-grid-row fr-grid-row--right fr-col-4'>
            <Tooltip
              tooltipContent={() => <p>Réinitialiser le lien de partage</p>}
              position='center'
            >
              <button
                type='button'
                className='fr-btn--tertiary-no-outline'
                aria-label='Réinitialiser le lien de partage'
                onClick={handleResetModal}
              >
                <span className='fr-icon-refresh-line' aria-hidden='true' />
              </button>
            </Tooltip>

            {isResetModalOpen && (
              <ResetModal
                projectId={projectId}
                token={token}
                currentEditUrl={`${SHARE_URL}${editorFormUrl}`}
                onClose={handleResetModal}
              />
            )}

            <Tooltip
              tooltipContent={() => <p>Éditer le projet</p>}
              position='left'
            >
              <button
                type='button'
                className='fr-btn--tertiary-no-outline fr-mx-1w'
                aria-label='Éditer le projet'
                onClick={() => router.push(editorFormUrl)}
              >
                <span className='fr-icon-edit-line' aria-hidden='true' />
              </button>
            </Tooltip>

            <Tooltip
              tooltipContent={() => <p>Supprimer le projet</p>}
              position='left'
            >
              <button
                type='button'
                className='fr-btn--tertiary-no-outline'
                aria-label='Supprimer le projet'
                onClick={handleDeleteModalOpen}
              >
                <span className='fr-icon-delete-line' aria-hidden='true' />
              </button>
            </Tooltip>

            {isDeleteModalOpen && (
              <DeleteModal
                isSidebar
                nom={projectName}
                id={projectId}
                token={token}
                handleDeleteModalOpen={handleDeleteModalOpen}
              />
            )}
          </div>
        )}
      </div>

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
      {projets && projets.length > 1 && (
        <div className='fr-select-group fr-p-3v fr-mt-3w' style={{borderTop: '1px solid white'}}>
          <label className='fr-label' style={{color: 'white'}}>Sélectionnez un autre projet</label>
          <select
            className='fr-select'
            defaultValue={projets.find(p => p._id === projectId)?._id}
            onChange={onProjetChange}
          >
            {projets.map(projet => (
              <option key={projet.nom} value={projet._id}>{projet.nom}</option>
            ))}
          </select>
        </div>
      )}
      {userRole === 'admin' && (
        <div className='fr-pt-2w'>
          <hr />
          <div>
            <b>Lien d’édition :</b>
            <span
              className='fr-icon-clipboard-line fr-pl-1w'
              aria-hidden='true'
              style={{cursor: 'pointer'}}
              onClick={() => navigator.clipboard.writeText(url)}
            />
          </div>
          <i><a className='fr-text--sm' href={url}>{url}</a></i>
        </div>
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

Header.defaultProps = {
  codeEditor: null,
  territoires: [],
  projets: null,
  onProjetChange: null
}

Header.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  codeEditor: PropTypes.string,
  territoires: PropTypes.array,
  projets: PropTypes.array,
  onProjetChange: PropTypes.func
}

export default Header

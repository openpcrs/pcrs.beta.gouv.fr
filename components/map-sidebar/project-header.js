import {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import colors from '@/styles/colors.js'

import AuthentificationContext from '@/contexts/authentification-token.js'

import HiddenInfos from '@/components/hidden-infos.js'
import DeleteModal from '@/components/suivi-form/delete-modal.js'

const Header = ({projectId, projectName, territoires, projets, onProjetChange}) => {
  const router = useRouter()
  const {isAdmin, token} = useContext(AuthentificationContext)

  const [isTerritoiresShow, setIsTerritoiresShow] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const hasToMuchTerritoires = territoires.length >= 4

  const handleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen)

  return (
    <div className='header'>
      <div className='fr-grid-row fr-my-2w'>
        <h1 className='fr-h4 fr-m-0 fr-col-9'>{projectName}</h1>
        <div>
          {isAdmin && (
            <>
              <button
                type='button'
                className='fr-btn--tertiary-no-outline fr-px-1w'
                aria-label='Editer le projet'
                onClick={() => router.push(`/formulaire-suivi?id=${projectId}`)}
              >
                <span className='fr-icon-edit-line' aria-hidden='true' />
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
            <DeleteModal
              isSidebar
              nom={projectName}
              id={projectId}
              token={token}
              handleDeleteModalOpen={handleDeleteModalOpen}
            />
          )}
        </div>
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
  territoires: [],
  projets: null,
  onProjetChange: null
}

Header.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  territoires: PropTypes.array,
  projets: PropTypes.array,
  onProjetChange: PropTypes.func
}

export default Header

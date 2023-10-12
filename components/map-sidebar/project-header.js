import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import colors from '@/styles/colors.js'

import HiddenInfos from '@/components/hidden-infos.js'
import Button from '@/components/button.js'

const SHARE_URL = process.env.NEXT_PUBLIC_PROJECT_SHARE_URL || 'https://pcrs.beta.gouv.fr'

const Header = ({projectId, projectName, territoires, projets, onProjetChange}) => {
  const router = useRouter()
  const [isTerritoiresShow, setIsTerritoiresShow] = useState(false)

  const hasToMuchTerritoires = territoires.length >= 4

  return (
    <div className='header'>
      <div>
        <h1 className='fr-h4 fr-my-2w'>{projectName}</h1>
        <div className='fr-mb-3w'>
          <Button
            isWhite
            icon='arrow-right-line'
            buttonStyle='secondary'
            onClick={() => router.push(`${SHARE_URL}/projet?id=${projectId}`)}
          >
            Consulter le projet
          </Button>
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

import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import HiddenInfos from '@/components/hidden-infos.js'

const Header = ({projectName, territoires}) => {
  const [isTerritoiresShow, setIsTerritoiresShow] = useState(false)

  const hasToMuchTerritoires = territoires.length >= 4

  return (
    <div className='header'>
      <h1 className='fr-h4'>{projectName}</h1>
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
      `}</style>
    </div>
  )
}

Header.propTypes = {
  projectName: PropTypes.string.isRequired,
  territoires: PropTypes.array
}

Header.defaultProps = {
  territoires: []
}

export default Header


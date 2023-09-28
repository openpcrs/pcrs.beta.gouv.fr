import {useContext} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import DeviceContext from '@/contexts/device.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar/index.js'

export const Mobile = ({handleSelectProjet, handleTitleClick, handleNewProject, projet, isOpen, setIsOpen, geometry, projets, onProjetChange}) => {
  const {viewHeight} = useContext(DeviceContext)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        contain: 'content'
      }}
    >
      {!isOpen && (
        <div
          className='fr-p-1w fr-text--sm fr-m-0 fr-grid-row fr-grid-row--middle fr-grid-row--center'
          style={{background: colors.info975, textAlign: 'center'}}
        >
          <div>
            Les données de cette carte sont disponibles publiquement sur le site&nbsp;<a rel='noreferrer' href='https://www.data.gouv.fr/fr/organizations/pcrs-beta-gouv-fr/' target='_blank' title='ouvre un onglet vers data gouv'>Data gouv</a>
          </div>
        </div>
      )}

      {geometry && (
        <div
          style={{
            height: isOpen ? 0 : viewHeight - 264,
            width: '100%'
          }}
        >
          <Map
            isMobile
            handleSelectProjet={handleSelectProjet}
            geometry={geometry}
            projetId={projet?._id}
            handleNewProject={handleNewProject}
          />
        </div>
      )}
      <div
        style={{
          height: isOpen ? viewHeight - 147 : '56px',
          overflowY: isOpen ? 'auto' : 'hidden',
          overflowX: 'hidden',
          padding: '2px',
          border: '1px solid lightgrey',
          borderBottom: '0',
          zIndex: isOpen ? 3 : 0
        }}
      >
        <div
          className='fr-p-3v'
          style={{
            float: isOpen ? 'right' : 'left',
            width: '100%',
            display: 'flex',
            justifyContent: projet && isOpen ? 'end' : 'space-between'
          }}
        >
          {isOpen && projet ? (
            <span
              className='fr-icon--lg fr-icon-close-circle-line'
              style={{
                color: 'white',
                cursor: 'pointer'
              }}
              onClick={handleTitleClick}
            />
          ) : (
            (!isOpen && projet) ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <span>{projet?.nom}</span>
                <span
                  className='fr-icon--lg fr-icon-arrow-up-s-line'
                  aria-hidden='true'
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={handleTitleClick}
                />
              </div>
            ) : (
              <small>Sélectionnez un PCRS sur la carte</small>
            )
          )}
        </div>
        {isOpen && projet && (
          <MapSidebar
            projet={projet}
            projets={projets}
            onProjetChange={onProjetChange}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

Mobile.defaultProps = {
  handleTitleClick: null,
  projet: null,
  isOpen: false,
  projets: null,
  onProjetChange: null
}

Mobile.propTypes = {
  handleSelectProjet: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  handleTitleClick: PropTypes.func,
  projet: PropTypes.object,
  isOpen: PropTypes.bool,
  geometry: PropTypes.object,
  projets: PropTypes.array,
  onProjetChange: PropTypes.func,
  handleNewProject: PropTypes.func
}

export const Desktop = ({handleSelectProjet, projet, isOpen, setIsOpen, geometry, onProjetChange, projets, handleNewProject}) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      contain: 'content'
    }}
  >
    {projet && (
      <>
        <div
          style={{
            minWidth: isOpen ? '460px' : '5px',
            maxWidth: '460px',
            boxShadow: '0px 0px 5px grey',
            height: 'calc(100vh - 117px)',
            overflow: 'auto',
            overflowX: 'hidden'
          }}
        >
          {isOpen && (
            <MapSidebar
              projet={projet}
              projets={projets}
              onProjetChange={onProjetChange}
              onClose={() => setIsOpen(false)} />
          )}
        </div>
        <button
          type='button'
          className={`fr-icon-arrow-${isOpen ? 'left' : 'right'}-s-line`}
          style={{
            position: 'absolute',
            top: '45px',
            left: isOpen ? '460px' : '5px',
            backgroundColor: 'white',
            height: '50px',
            width: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '0 5px 5px 0',
            boxShadow: '2px 2px 5px grey',
            zIndex: 3
          }}
          onClick={() => setIsOpen(!isOpen)}
        />
      </>
    )}

    {geometry && (
      <div style={{width: '100%'}}>
        <div
          className='fr-p-1w fr-text--sm fr-m-0 fr-grid-row fr-grid-row--middle fr-grid-row--center'
          style={{background: colors.info975, textAlign: 'center'}}
        >
          <div>
            Les données de cette carte sont disponibles publiquement sur le site&nbsp;<a rel='noreferrer' href='https://www.data.gouv.fr/fr/organizations/pcrs-beta-gouv-fr/' target='_blank' title='ouvre un onglet vers data gouv'>Data gouv</a>
          </div>
        </div>

        <div style={{width: '100%', height: 'calc(100vh - 157px)'}}>
          <Map
            style={{pointerEvents: 'all'}}
            handleSelectProjet={handleSelectProjet}
            geometry={geometry}
            projetId={projet?._id}
            handleNewProject={handleNewProject}
          />
        </div>
      </div>
    )}
  </div>
)

Desktop.defaultProps = {
  projet: null,
  isOpen: false,
  projets: null,
  onProjetChange: null
}

Desktop.propTypes = {
  handleSelectProjet: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func,
  projet: PropTypes.object,
  isOpen: PropTypes.bool,
  geometry: PropTypes.object,
  projets: PropTypes.array,
  onProjetChange: PropTypes.func,
  handleNewProject: PropTypes.func
}


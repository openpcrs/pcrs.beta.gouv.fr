import {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import DeviceContext from '@/contexts/device.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar/index.js'

const OpenDataMessage = () => (
  <div
    className='fr-p-1w fr-text--sm fr-m-0 fr-grid-row fr-grid-row--middle fr-grid-row--center'
  >
    <div>
      Les données de cette carte sont disponibles publiquement sur le site&nbsp;<a rel='noreferrer' href='https://www.data.gouv.fr/fr/organizations/pcrs-beta-gouv-fr/' target='_blank' title='ouvre un onglet vers data gouv'>Data gouv</a>
    </div>

    <style jsx>{`
      .open-data-message {
        background: ${colors.info975};
        text-align: center:
      }
      `}</style>
  </div>
)

const MobileSidebarWrapper = ({projetNom, isOpen, viewHeight, toggleSidebar, children}) => (
  <div className='mobile-sidebar-wrapper'>
    <div className='fr-p-3v sidebar-header'>
      {isOpen && projetNom ? (
        <span
          className='fr-icon--lg fr-icon-close-circle-line sidebar-icon'
          onClick={toggleSidebar}
        />
      ) : (
        (!isOpen && projetNom) ? (
          <div className='sidebar-wrapped-header'>
            <span>{projetNom}</span>
            <span
              className='fr-icon--lg fr-icon-arrow-up-s-line sidebar-icon'
              aria-hidden='true'
              onClick={toggleSidebar}
            />
          </div>
        ) : (
          <small>Sélectionnez un PCRS sur la carte</small>
        )
      )}
    </div>

    {children}

    <style jsx>{`
      .mobile-sidebar-wrapper {
        height: ${isOpen ? viewHeight - 147 : '56px'};
        overflow-y: ${isOpen ? 'auto' : 'hidden'};
        overflow-x: hidden;
        border-bottom: 0;
        z-index: ${isOpen ? 3 : 0};
      }

      .sidebar-header {
        float: ${isOpen ? 'right' : 'left'};
        display: flex;
        width: 100%;
        justify-content: ${projetNom && isOpen ? 'end' : 'space-between'};
        color: ${!projetNom && !isOpen ? 'initial' : '#fff'};
      }

      .sidebar-wrapped-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .sidebar-icon {
        color: #fff;
        cursor: pointer;
      }
      `}</style>
  </div>
)

MobileSidebarWrapper.defaultProps = {
  projetNom: null
}

MobileSidebarWrapper.propTypes = {
  projetNom: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  viewHeight: PropTypes.number.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  children: PropTypes.node
}

export const Mobile = ({handleTitleClick, projet, isOpen, sidebar, map}) => {
  const {viewHeight} = useContext(DeviceContext)

  return (
    <div className='mobile-layout-container'>
      {!isOpen && (
        <OpenDataMessage />
      )}

      <div className='mobile-map-container'>
        {map}
      </div>

      <MobileSidebarWrapper
        projetNom={projet?.nom}
        isOpen={isOpen}
        viewHeight={viewHeight}
        toggleSidebar={handleTitleClick}
      >
        {sidebar}
      </MobileSidebarWrapper>

      <style jsx>{`
        .mobile-layout-container {
          display: flex;
          flex-direction: column;
          contain: content;
        }

        .mobile-map-container {
          height: ${isOpen ? 0 : viewHeight - 264}px;
          width: 100%;
        }
        `}</style>
    </div>
  )
}

Mobile.defaultProps = {
  handleTitleClick: null,
  projet: null
}

Mobile.propTypes = {
  map: PropTypes.node.isRequired,
  sidebar: PropTypes.node,
  handleTitleClick: PropTypes.func,
  projet: PropTypes.object,
  isOpen: PropTypes.bool.isRequired
}

export const Desktop = ({projet, isOpen, setIsOpen, sidebar, map}) => (
  <div className='desktop-layout-container'>
    {projet && (
      <>
        <div className='desktop-sidebar-container'>
          {isOpen ? sidebar : null}
        </div>

        <button
          type='button'
          className={`fr-icon-arrow-${isOpen ? 'left' : 'right'}-s-line sidebar-toggle-button`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </>
    )}

    <div className='map-container'>
      <OpenDataMessage />
      {map}
    </div>

    <style jsx>{`
      .desktop-layout-container {
        display: flex;
        height: 100%;
        contain: content;
      }

      .desktop-sidebar-container {
        min-width: ${isOpen ? '460px' : '5px'};
        max-width: 460px;
        box-shadow: 0px 0px 5px grey;
        height: calc(100vh - 117px);
        overflow: auto;
        overflow-x: hidden;
      }

      .sidebar-toggle-button {
        position: absolute;
        top: 45px;
        left: ${isOpen ? '460px' : '5px'};
        background-color: white;
        height: 50px;
        width: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0 5px 5px 0;
        box-shadow: 2px 2px 5px grey;
        z-index: 3;
      }

      .map-container {
        flex: auto;
        height: calc(100vh - 158px);
      }
      `}</style>
  </div>
)

Desktop.defaultProps = {
  projet: null
}

Desktop.propTypes = {
  map: PropTypes.node.isRequired,
  sidebar: PropTypes.node,
  setIsOpen: PropTypes.func,
  projet: PropTypes.object,
  isOpen: PropTypes.bool.isRequired
}

const SuiviPCRSMapLayout = props => {
  const {projet, projets, onProjetChange, setIsOpen, selectProjets, geometry} = props
  const {isMobileDevice} = useContext(DeviceContext)

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])

  const sidebar = projet ? (
    <MapSidebar
      projet={projet}
      projets={projets}
      onProjetChange={onProjetChange}
      onClose={() => setIsOpen(false)}
    />
  ) : null

  const map = (
    <Map
      isMobile={isMobileDevice}
      projetId={projet?._id}
      geometry={geometry}
      handleSelectProjets={selectProjets}
    />
  )

  return (
    <Layout
      {...props}
      sidebar={sidebar}
      map={map}
    />
  )
}

SuiviPCRSMapLayout.defaultProps = {
  projet: null
}

SuiviPCRSMapLayout.propTypes = {
  geometry: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  projet: PropTypes.object,
  projets: PropTypes.array,
  setIsOpen: PropTypes.func,
  onProjetChange: PropTypes.func.isRequired,
  selectProjets: PropTypes.func.isRequired
}

export default SuiviPCRSMapLayout

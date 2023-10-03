import {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import DeviceContext from '@/contexts/device.js'

import Map from '@/components/map/index.js'
import MapSidebar from '@/components/map-sidebar/index.js'

const OpenDataInformationMessage = () => (
  <div
    className='fr-p-1w fr-text--sm fr-m-0 fr-grid-row fr-grid-row--middle fr-grid-row--center'
    style={{background: colors.info975, textAlign: 'center'}}
  >
    <div>
      Les données de cette carte sont disponibles publiquement sur le site&nbsp;<a rel='noreferrer' href='https://www.data.gouv.fr/fr/organizations/pcrs-beta-gouv-fr/' target='_blank' title='ouvre un onglet vers data gouv'>Data gouv</a>
    </div>
  </div>
)

const MobileSidebarWrapper = ({projetNom, isOpen, viewHeight, toggleSidebar, children}) => (
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
        justifyContent: projetNom && isOpen ? 'end' : 'space-between'
      }}
    >
      {isOpen && projetNom ? (
        <span
          className='fr-icon--lg fr-icon-close-circle-line'
          style={{
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={toggleSidebar}
        />
      ) : (
        (!isOpen && projetNom) ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <span>{projetNom}</span>
            <span
              className='fr-icon--lg fr-icon-arrow-up-s-line'
              aria-hidden='true'
              style={{
                cursor: 'pointer'
              }}
              onClick={toggleSidebar}
            />
          </div>
        ) : (
          <small>Sélectionnez un PCRS sur la carte</small>
        )
      )}
    </div>

    {children}
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        contain: 'content'
      }}
    >
      {!isOpen && (
        <OpenDataInformationMessage />
      )}

      <div
        style={{
          height: isOpen ? 0 : viewHeight - 264,
          width: '100%'
        }}
      >
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
          {isOpen ? sidebar : null}
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

    <div style={{width: '100%'}}>
      <OpenDataInformationMessage />

      <div style={{width: '100%', height: 'calc(100vh - 157px)'}}>
        {map}
      </div>
    </div>
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

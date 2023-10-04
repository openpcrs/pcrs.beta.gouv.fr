import {useContext} from 'react'
import PropTypes from 'prop-types'

import DeviceContext from '@/contexts/device.js'
import OpenDataMessage from '@/components/ui/open-data-message.js'
import MobileSidebarWrapper from '@/components/containers/mobile-sidebar-wrapper.js'

const Mobile = ({handleTitleClick, projet, isOpen, sidebar, map}) => {
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

export default Mobile

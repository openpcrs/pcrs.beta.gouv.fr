import PropTypes from 'prop-types'
import OpenDataMessage from '@/components/ui/open-data-message.js'

const Desktop = ({projet, isOpen, setIsOpen, sidebar, map}) => (
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

export default Desktop

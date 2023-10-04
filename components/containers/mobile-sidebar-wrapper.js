import PropTypes from 'prop-types'

const MobileSidebarWrapper = ({projetNom, isOpen, viewHeight, toggleSidebar, children}) => (
  <div className='mobile-sidebar-wrapper'>
    <div className='fr-p-3v sidebar-header'>
      {isOpen && projetNom ? (
        <span
          className='fr-icon--lg fr-icon-arrow-down-s-line sidebar-icon'
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

export default MobileSidebarWrapper

import PropTypes from 'prop-types'

const Tab = ({activeTab, tabs, icon, children, handleActiveTab}) => (
  <div className='fr-tabs'>
    <ul className='fr-tabs__list' role='tablist'>
      {tabs.map((tab, index) => {
        const defaultTab = !activeTab && index === 0

        return (
          <li key={tab.label} role='presentation'>
            <button
              disabled={tab?.isDisabled}
              type='button'
              className={`fr-tabs__tab ${icon ? `fr-icon-${icon}` : ''} fr-tabs__tab--icon-left`}
              role='tab'
              aria-selected={defaultTab || (activeTab === tab.label ? 'true' : 'false')}
              onClick={() => handleActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          </li>
        )
      })}
    </ul>

    <div className='content-wrapper fr-tabs__panel fr-tabs__panel--selected' role='tabpanel'>
      {children}
    </div>

    <style jsx>{`
      .content-wrapper {
        border: 1px solid #dddddd;
      }
    `}</style>
  </div>
)

Tab.propTypes = {
  activeTab: PropTypes.string,
  icon: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool
  })).isRequired,
  handleActiveTab: PropTypes.func.isRequired,
  children: PropTypes.node
}

Tab.defaultProps = {
  activeTab: null,
  icon: null,
  children: null
}

export default Tab

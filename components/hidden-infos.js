import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const HiddenInfos = ({theme, onClose, children}) => (
  <div className='hidden-infos-container fr-mt-1w'>
    <div className='fr-grid-row fr-grid-row--right fr-pr-1w'>
      <button
        type='button'
        className='close-button'
        title='Masquer l’information'
        onClick={onClose}
      >
        <span className='fr-icon-close-line' aria-hidden='true' />
      </button>
    </div>
    <div className='content'>
      {children}
    </div>

    <style jsx>{`
      .content {
        border: solid 2px ${theme === 'primary' ? colors.info425 : 'white'};
        padding: 10px;
        border-radius: 3px;
      }

      .hidden-infos-container {
        width: 100%;
      }

      .close-button {
        border: solid 2px ${theme === 'primary' ? colors.info425 : 'white'};
        border-bottom-width: 0;
        border-radius: 3px 3px 0 0;
      }

      .fr-btn--tertiary-no-outline {
        color: ${theme === 'primary' ? colors.darkgrey : 'white'};
        font-style: italic;
        text-decoration: underline;
      }

      .close-button:hover {
        color: ${colors.darkgrey};
      }
    `}</style>
  </div>
)

HiddenInfos.propTypes = {
  theme: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
}

HiddenInfos.defaultProps = {
  theme: 'primary',
  children: null
}

export default HiddenInfos

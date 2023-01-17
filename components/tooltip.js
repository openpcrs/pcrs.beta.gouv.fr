import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Tooltip = ({tooltipContent, children}) => (
  <div className='tooltip-container'>
    {children}

    <div className='tooltip-text'>{tooltipContent()}</div>

    <style jsx>{`
      .tooltip-container {
        position: relative;
        display: inline-block;
        cursor: pointer;
      }

      .tooltip-container .tooltip-text {
        visibility: hidden;
        background-color: ${colors.info425};
        color: white;
        text-align: center;
        border-radius: 6px;
        padding: 5px 10px;
        position: absolute;
        z-index: 1;
        top: 105%;
        width: max-content;
      }

      .tooltip-container:hover .tooltip-text {
        visibility: visible;
      }
    `}</style>
  </div>
)

Tooltip.propTypes = {
  tooltipContent: PropTypes.func.isRequired,
  children: PropTypes.node
}

Tooltip.defaultProps = {
  children: null
}

export default Tooltip

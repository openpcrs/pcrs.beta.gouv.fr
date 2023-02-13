import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Tooltip = ({tooltipContent, position, children}) => {
  const [isScreenPress, setIsScreenPress] = useState(false)

  return (
    <div
      className='tooltip-container'
      onTouchStart={() => setIsScreenPress(true)}
      onTouchEnd={() => setIsScreenPress(false)}
    >
      {children}

      <div className={`tooltip-text ${position}`}>{tooltipContent()}</div>

      <style jsx>{`
      .tooltip-container {
        position: relative;
        display: inline-block;
        cursor: pointer;
      }

      .tooltip-container .tooltip-text {
        visibility: ${isScreenPress ? 'visible' : 'hidden'};
        background-color: ${colors.info425};
        color: white;
        text-align: center;
        border-radius: 6px;
        padding: 5px 10px;
        position: absolute;
        z-index: 1;
        top: 110%;
        width: max-content;
      }

      .left {
        right: 0;
      }

      .right {
        left: 0;
      }

      .tooltip-container:hover .tooltip-text {
        visibility: visible;
      }
    `}</style>
    </div>
  )
}

Tooltip.propTypes = {
  tooltipContent: PropTypes.func.isRequired,
  position: PropTypes.oneOf([
    'left',
    'right'
  ]),
  children: PropTypes.node
}

Tooltip.defaultProps = {
  children: null,
  position: 'right'
}

export default Tooltip

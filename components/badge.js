import {useRef, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import randomColor from 'randomcolor'

const Badge = ({label, background, hue, textColor, size, isColorRandom, children, ...props}) => {
  const [badgeColor, setBadgeColor] = useState(background || null)
  const colorRef = useRef()

  useEffect(() => {
    if (colorRef && isColorRandom) {
      const createdColor = () => randomColor({
        hue,
        format: 'rgba',
        alpha: 0.3
      })

      setBadgeColor(createdColor)
    }
  }, [hue, isColorRandom])

  return (
    <div className='labeled-badge' {...props}>
      {label && <div>{label}</div>}
      <p ref={colorRef} className={`fr-badge badge-color ${size === 'small' ? 'fr-badge--sm' : ''}`}>
        {children}
      </p>

      <style jsx>{`
        .labeled-badge div {
          font-weight: bold;
        }

        .badge-color {
          background: ${badgeColor};
          color: ${textColor};
        }
    `}</style>
    </div>
  )
}

Badge.propTypes = {
  background: PropTypes.string,
  hue: PropTypes.oneOf([
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'monochrome'
  ]),
  textColor: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.oneOf([
    'small',
    'regular'
  ]),
  isColorRandom: PropTypes.bool,
  children: PropTypes.node
}

Badge.defaultProps = {
  isColorRandom: false,
  label: null,
  size: 'regular',
  children: null
}
export default Badge

import PropTypes from 'prop-types'

const Badge = ({background, textColor, size, children, ...props}) => (
  <div className='badge fr-mr-1w fr-mb-1w' {...props}>
    <p className={`fr-badge badge-color ${size === 'small' ? 'fr-badge--sm' : ''}`}>
      {children}
    </p>

    <style jsx>{`
        .badge-color {
          background: ${background};
          color: ${textColor};
        }
    `}</style>
  </div>
)

Badge.propTypes = {
  background: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.oneOf([
    'small',
    'regular'
  ]),
  children: PropTypes.node
}

Badge.defaultProps = {
  size: 'regular',
  children: null
}

export default Badge


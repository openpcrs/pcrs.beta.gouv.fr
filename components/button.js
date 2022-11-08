import PropTypes from 'prop-types'
import Link from 'next/link'

const Button = ({label, size, buttonStyle, href, isExternal, children, ...props}) => {
  if (href) {
    return (
      <Link href={href} passHref={isExternal}>
        <button
          type='button'
          aria-label={label}
          className={`fr-btn fr-btn--${buttonStyle} fr-btn--${size}`}
          {...props}
        >
          {children}
        </button>
      </Link>
    )
  }

  return (
    <button
      type='submit'
      aria-label={label}
      className={`fr-btn fr-btn--${buttonStyle} fr-btn--${size}`}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  buttonStyle: PropTypes.oneOf([
    null,
    'secondary',
    'tertiary',
    'tertiary-no-outline'
  ]),
  size: PropTypes.oneOf([
    'sm',
    'md',
    'lg'
  ]),
  href: PropTypes.string,
  isExternal: PropTypes.bool,
  children: PropTypes.node
}

Button.defaultProps = {
  buttonStyle: null,
  size: 'md',
  href: null,
  isExternal: false,
  children: null
}
export default Button

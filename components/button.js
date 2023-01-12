import PropTypes from 'prop-types'
import Link from 'next/link'
import colors from '@/styles/colors.js'

const Button = ({label, size, buttonStyle, href, isExternal, isWhite, children, ...props}) => {
  if (href) {
    return (
      <>
        {isExternal ? (
          <a
            href={href}
            aria-label={label}
            className={`
            fr-btn fr-btn--${buttonStyle}
            fr-btn--${size}
            ${isWhite ? 'white-button' : ''}
          `}
            {...props}
            target='_blank'
            rel='noreferrer'
          >
            {children}
          </a>
        ) : (
          <Link legacyBehavior href={href}>
            <a
              className={`
            fr-btn fr-btn--${buttonStyle}
            fr-btn--${size}
            ${isWhite ? 'white-button' : ''}
          `}
            >
              {children}
            </a>
          </Link>
        )}

        <style jsx>{`
          .white-button {
            background: none;
            border: 1px solid white;
            color: white;
            text-decoration: none;
          }

          .white-button:hover {
            color: ${colors.darkgrey};
            background: white;
            border: 1px solid white;
            text-decoration: none;
          }
        `}</style>
      </>
    )
  }

  return (
    <button
      type='submit'
      aria-label={label}
      className={`
        fr-btn fr-btn--${buttonStyle}
        fr-btn--${size}
        ${isWhite ? 'white-button' : ''}
      `}
      {...props}
    >
      {children}

      <style jsx>{`
        .white-button {
          background: none;
          border: 1px solid white;
          color: white;
          text-decoration: none;
        }

        .white-button:hover {
          color: ${colors.darkgrey};
          background: white;
          border: 1px solid white;
          text-decoration: none;
        }
      `}</style>
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
  isWhite: PropTypes.bool,
  children: PropTypes.node
}

Button.defaultProps = {
  buttonStyle: null,
  size: 'md',
  href: null,
  isWhite: false,
  isExternal: false,
  children: null
}

export default Button

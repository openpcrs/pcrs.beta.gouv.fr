import PropTypes from 'prop-types'
import Link from 'next/link'

import colors from '@/styles/colors.js'

const Button = ({label, size, type, buttonStyle, isDisabled, icon, iconSide, href, isExternal, isWhite, children, ...props}) => {
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
            ${icon ? `fr-btn--icon-${iconSide} fr-icon-${icon}` : ''}
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
            ${icon ? `fr-btn--icon-${iconSide} fr-icon-${icon}` : ''}
          `}
            >
              {children}
            </a>
          </Link>
        )}

        <style jsx>{`
          a {
            z-index: 0;
          }

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
      type={type === 'submit' ? 'submit' : 'button'}
      aria-label={label}
      disabled={isDisabled}
      className={`
        fr-btn fr-btn--${buttonStyle}
        fr-btn--${size}
        ${isWhite ? 'white-button' : ''}
        ${icon ? `fr-btn--icon-${iconSide} fr-icon-${icon}` : ''}
      `}
      {...props}
    >
      {children}

      <style jsx>{`
        button {
          z-index: 0;
        }

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
  type: PropTypes.oneOf([
    'button',
    'submit'
  ]),
  isDisabled: PropTypes.bool,
  icon: PropTypes.string,
  iconSide: PropTypes.oneOf([
    null,
    'left',
    'right'
  ]),
  href: PropTypes.string,
  isExternal: PropTypes.bool,
  isWhite: PropTypes.bool,
  children: PropTypes.node
}

Button.defaultProps = {
  buttonStyle: null,
  size: 'md',
  type: 'button',
  isDisabled: false,
  iconSide: 'left',
  icon: null,
  href: null,
  isWhite: false,
  isExternal: false,
  children: null
}

export default Button

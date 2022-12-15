import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import colors from '@/styles/colors'

const Button = ({label, size, buttonStyle, href, isExternal, children, ...props}) => {
  const router = useRouter()

  const redirect = e => {
    if (isExternal) {
      window.location.href = href
    } else {
      e.preventDefault()
      router.push(href)
    }
  }

  if (href) {
    return (
      <button
        onClick={e => redirect(e)}
        type='button'
        aria-label={label}
        className={`fr-btn fr-btn--${buttonStyle} fr-btn--${size}`}
        {...props}
      >
        {children}

        <style jsx>{`
          .fr-btn--secondary-outline {
            background: none;
            border: 1px solid white;
            color: white;
            text-decoration: none;
          }

          .fr-btn--secondary-outline:hover {
            color: ${colors.darkgrey};
            background: white;
            border: 1px solid white;
            text-decoration: none;
          }
        `}</style>
      </button>
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

      <style jsx>{`
        .fr-btn--secondary-outline {
          background: none;
          border: 1px solid white;
          color: white;
          text-decoration: none;
        }

        .fr-btn--secondary-outline:hover {
          color: ${colors.darkgrey};
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
    'secondary-outline',
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

import PropTypes from 'prop-types'

const Toast = ({type, title, duration, isClosable, children, removeToast}) => (
  <div className='toast-wrapper fr-grid-row fr-grid-row--center fr-p-1w'>
    <div className='shadow-wrapper'>
      <div className={`toast fr-pl-6w fr-alert fr-alert--${type}`} role='alert'>
        {isClosable && (
          <button
            type='button'
            className='close-button'
            onClick={removeToast}
          >
            <span className='fr-icon-close-line' aria-hidden='true' />
          </button>
        )}

        {title && <h3 className='fr-alert__title'>{title}</h3>}
        <p>{children}</p>
      </div>
    </div>

    <style jsx>{`
        .toast-wrapper {
          width: 100%;
          z-index: 5;
          bottom: 40px;
          white-space: nowrap;
          animation: fadein 0.5s, fadeout 0.5s ${(duration / 1000) - 0.2}s;
        }

        .shadow-wrapper {
          min-width: 60%;
          box-shadow: 2px 2px 17px -5px rgba(0, 0, 0, 0.55);
        }

        .toast {
          position: relative;
          background: white;
          width: 100%;
        }

        .close-button {
          position: absolute;
          right: 18px;
          top: 10px;
        }

        @keyframes fadein {
            from {bottom: 0; opacity: 0;}
            to {bottom: 40px; opacity: 1;}
        }

        @keyframes fadeout {
            from {bottom: 40px; opacity: 1;}
            to {bottom: 0; opacity: 0;}
        }
      `}</style>
  </div>
)

Toast.propTypes = {
  type: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'error'
  ]),
  title: PropTypes.string,
  isClosable: PropTypes.bool,
  children: PropTypes.node,
  duration: PropTypes.number.isRequired,
  removeToast: PropTypes.func.isRequired
}

Toast.defaultProps = {
  type: 'info',
  title: null,
  isClosable: false,
  children: null
}

export default Toast

import {useEffect, useContext} from 'react'
import PropTypes from 'prop-types'

import ToasterContext from '@/contexts/toaster.js'

const Toast = ({type, title}) => {
  const {toastContent, setToastContent} = useContext(ToasterContext)

  useEffect(() => {
    if (toastContent) {
      const interval = setInterval(() => {
        setToastContent(null)
      }, 3000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [toastContent, setToastContent])

  return (
    <div className={`toast-wrapper fr-grid-row fr-grid-row--center ${toastContent ? 'visible' : ''}`}>
      <div className='shadow-wrapper'>
        <div className={`toast fr-pl-6w fr-alert fr-alert--${type}`} role='alert'>
          <button
            type='button'
            className='close-button'
            onClick={() => setToastContent(null)}
          >
            <span className='fr-icon-close-line' aria-hidden='true' />
          </button>
          {title && <h3 className='fr-alert__title'>{title}</h3>}
          <p>{toastContent}</p>
        </div>
      </div>

      <style jsx>{`
        .toast-wrapper {
          width: 100%;
          visibility: hidden;
          position: fixed;
          z-index: 5;
          bottom: 40px;
          white-space: nowrap;
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

        .visible {
          visibility: visible;
          animation: fadein 0.5s, fadeout 0.5s 2.8s;
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
}

Toast.propTypes = {
  type: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'error'
  ]),
  title: PropTypes.string
}

Toast.defaultProps = {
  type: 'info',
  title: null
}

export default Toast

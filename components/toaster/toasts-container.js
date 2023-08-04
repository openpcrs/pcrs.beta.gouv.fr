import PropTypes from 'prop-types'

import Toast from '@/components/toaster/toast.js'

const ToastsContainer = ({toasts, removeToast}) => (
  <div className='toasts-wrapper'>
    {toasts.map(t => {
      const {title, type, content, isClosable} = t.toastData

      return (
        <Toast
          key={t.id}
          title={title}
          type={type}
          isClosable={isClosable}
          removeToast={() => removeToast(t.id)}
        >
          {content}
        </Toast>
      )
    })}

    <style jsx>{`
      .toasts-wrapper {
        width: 100%;
        z-index: 6;
        position: fixed;
        bottom: 40px;
      }
    `}</style>
  </div>
)

ToastsContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  removeToast: PropTypes.func.isRequired
}

export default ToastsContainer

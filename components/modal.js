import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Modal = ({children, title, onClose}) => (
  <div className='modal-wrapper fr-grid-row fr-grid-row--center fr-grid-row--middle' onClick={onClose}>
    <div className='fr-container fr-container--fluid fr-container-md'>
      <div className='fr-grid-row fr-grid-row--center'>
        <div className='fr-col-12 fr-col-md-8 fr-col-lg-6'>
          <div className='fr-modal__body' onClick={e => e.stopPropagation()}>
            <div className='fr-modal__header fr-container fr-grid-row--right'>
              <button
                type='button'
                className='fr-link--close fr-link fr-grid-row fr-grid-row--middle fr-p-1w'
                aria-label='Fermer la fenêtre modale'
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
            <div className='fr-modal__content'>
              {title && (
                <h1 className='fr-modal__title'>
                  <span className='fr-fi-arrow-right-line fr-fi--lg' />{title}
                </h1>
              )}
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      .modal-wrapper {
        z-index: 2;
        color: ${colors.darkgrey};
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
      }
    `}</style>
  </div>
)

Modal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired
}

Modal.defaultProps = {
  children: null,
  title: null
}

export default Modal

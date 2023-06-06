import {useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {resetEditCode} from '@/lib/suivi-pcrs.js'

import colors from '@/styles/colors.js'

import Modal from '@/components/modal.js'
import Button from '@/components/button.js'

const ResetModal = ({projectId, token, currentEditUrl, onClose}) => {
  const router = useRouter()

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [validationOnCopy, setValidationOnCopy] = useState(null)
  const [errorOnCopy, setErrorOnCopy] = useState(null)

  const onReset = async () => {
    setValidationMessage(null)
    setErrorMessage(null)

    try {
      await resetEditCode(projectId, token)
      setValidationMessage('Le lien d’édition a été réinitialisé')

      setTimeout(() => {
        router.reload(window.location.pathname)
      }, 3000)
    } catch {
      setErrorMessage('Une erreur a été rencontrée. Le nouveau lien n’a pas pu être créé')
    }
  }

  const copyToClipboard = async url => {
    try {
      await navigator.clipboard.writeText(url)
      setValidationOnCopy('lien copié !')
    } catch {
      setErrorOnCopy('Impossible de copier le lien dans le presse-papiers')
    }
  }

  return (
    <div>
      <Modal title='Réinitialisation du lien d’édition' onClose={onClose}>
        <div className='fr-grid-row fr-grid-row--center'>
          <p className='fr-text--sm link-infos'><b>Le lien suivant permet l’édition du projet et peut être partagé avec d’autres utilisateurs de confiance. En tant qu’administrateur, vous avez la possibilité de réinitialiser l’url suivante :</b></p>

          <div className='fr-grid-row fr-col-12'>
            <i
              className='link fr-grid-row fr-grid-row--center fr-col-12 fr-mt-4w fr-mb-2w fr-p-1w fr-text--sm'
              onClick={() => copyToClipboard(currentEditUrl)}
            >
              <b>{currentEditUrl}</b> <span className='fr-pl-1w fr-icon-survey-line' aria-hidden='true' />
            </i>

            {validationOnCopy && <p className='fr-grid-row--center fr-valid-text fr-col-12 fr-mt-0 fr-mb-3w'>{validationOnCopy}</p>}
            {errorOnCopy && <p className='fr-grid-row--center fr-error-text fr-col-12 fr-mt-0 fr-mb-3w'>{errorOnCopy}</p>}
          </div>

          <Button
            icon='refresh-line'
            label='Réinitialiser le lien d’édition'
            onClick={() => {
              setIsConfirmationModalOpen(true)
              setValidationOnCopy(null)
              setErrorOnCopy(null)
            }}
          >
            Réinitialiser le lien d’édition
          </Button>
        </div>
      </Modal>

      {isConfirmationModalOpen && (
        <Modal title='Êtes-vous certain de réinitialiser le lien d’édition ?' onClose={onClose}>
          <div className='fr-grid-row fr-col-12'>
            <div className='fr-alert fr-alert--warning fr-alert--sm fr-col-12'>
              <p>La réinitialisation du lien d’édition <b>invalidera le précédent lien</b>. Tous les possesseurs de ce lien seront dans <b>l’incapacité d’éditer le projet</b>.</p>
            </div>

            <div className='fr-col-12 fr-grid-row fr-grid-row--middle fr-mt-5w'>
              <div className='fr-col-md-5 fr-col-12'>
                <Button
                  icon='arrow-left-line'
                  iconSide='left'
                  label='Retourner sur la carte de suivi'
                  buttonStyle='secondary'
                  size='sm'
                  onClick={onClose}
                >
                  Retourner sur la carte de suivi
                </Button>
              </div>

              <div className='fr-grid-row fr-col-md-7 fr-col-12 fr-mt-2w fr-mt-md-0 fr-grid-row fr-grid-row--left'>
                <div className='fr-col-12'>
                  <Button
                    icon='refresh-line'
                    label='Réinitialiser le lien d’édition'
                    onClick={onReset}
                  >
                    Réinitialiser le lien d’édition
                  </Button>
                </div>
              </div>
            </div>

            {validationMessage && (
              <p className='fr-grid-row fr-grid-row--center fr-col-12 fr-valid-text fr-text--sm fr-mt-2w fr-pl-2w fr-mb-0'>
                {validationMessage}
              </p>
            )}

            {errorMessage && (
              <p className='fr-grid-row fr-col-12 fr-grid-row--center fr-error-text fr-text--sm fr-mt-2w fr-pl-3w fr-mb-0'>
                {errorMessage}
              </p>
            )}
          </div>
        </Modal>
      )}

      <style jsx>{`
        .link-infos {
          text-align: center;
        }

        .link {
          background: ${colors.blueFrance975};
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

ResetModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  currentEditUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default ResetModal

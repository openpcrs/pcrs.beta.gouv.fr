import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors.js'

import Modal from '@/components/modal.js'
import Button from '@/components/button.js'

const SHARE_URL = process.env.NEXT_PUBLIC_PROJECT_SHARE_URL || 'https://pcrs.beta.gouv.fr/'

const ShareModal = ({projectId, editCode, handleModal, validationMessage}) => {
  const [messageOnCopy, setMessageOnCopy] = useState('')
  const url = `${SHARE_URL}formulaire-suivi?id=${projectId}&editcode=${editCode}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setMessageOnCopy('lien copié !')
    } catch (error) {
      console.error('Impossible de copier le lien dans le presse-papiers:', error)
    }
  }

  return (
    <Modal onClose={handleModal}>
      <div className='fr-grid-row fr-grid-row--center fr-grid-row--gutters'>
        <Image src='/images/icons/check.png' height={80} width={80} />
        <b className='success fr-grid-row fr-grid-row--center fr-col-12 fr-text--lead'>
          {validationMessage}
        </b>
      </div>

      <div className='fr-notice fr-notice--info fr-my-6w'>
        <div className='fr-mx-2w fr-notice__body'>
          <p>
            Tout ce qu’il faut savoir sur le formulaire de suivi : <a href='https://docs.pcrs.beta.gouv.fr/suivi-des-projets/edition-des-donnees' target='_blank' rel='noreferrer'>consulter la documentation</a>
          </p>
        </div>
      </div>

      <div className='fr-grid-row fr-grid-row--center'>
        <b className='fr-grid-row fr-grid-row--center fr-col-12 fr-mb-5w'>Le lien suivant permet l’édition du projet et peut être partagé avec d’autres utilisateurs de confiance</b>
        <div className='fr-alert fr-alert--warning fr-alert--sm'>
          <p>Veuillez <b>impérativement</b> conserver ce lien <b>avant de quitter cette page</b>. Un oubli de votre part nécessitera de <b>contacter un administrateur</b> afin de vous refournir ce lien</p>
        </div>
        <i className='link fr-grid-row fr-grid-row--center fr-col-12 fr-mt-4w fr-mb-2w fr-p-1w fr-text--sm'><b>{url}</b></i>

        <Button
          icon='clipboard-line'
          label='Copier le lien d’édition'
          onClick={copyToClipboard}
        >
          Copier le lien d’édition
        </Button>

        {messageOnCopy && (
          <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-my-1w'>
            {messageOnCopy}
          </p>
        )}
      </div>

      <style jsx>{`
        .link {
          background: ${colors.blueFrance975};
        }

        .success {
          color: ${colors.success425};
        }
      `}</style>
    </Modal>
  )
}

ShareModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  editCode: PropTypes.string.isRequired,
  handleModal: PropTypes.func.isRequired,
  validationMessage: PropTypes.string.isRequired
}

export default ShareModal

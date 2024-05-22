import PropTypes from 'prop-types'
import {useInput} from '@/hooks/input.js'

import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'

const ReutilisationForm = ({initialValues, isReutilisationExists, onSubmit, onCancel}) => {
  const handleLinkError = lien => (
    isReutilisationExists(lien)
      ? 'Cette réutilisation existe déjà'
      : null
  )

  const [titre, setTitre] = useInput({
    initialValue: initialValues?.titre,
    isRequired: true
  })

  const [description, setDescription] = useInput({
    initialValue: initialValues?.description,
    isRequired: false
  })

  const [lien, setLien] = useInput({
    initialValue: initialValues?.lien,
    checkValue: handleLinkError,
    isRequired: true
  })

  const isFormComplete = Boolean(titre && lien)

  const handleSubmit = () => {
    onSubmit({
      titre,
      description,
      lien
    })
  }

  return (
    <>
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-col-12 fr-col-md-6 fr-pr-md-3w'>
          <TextInput
            isRequired
            label='Titre'
            value={titre}
            ariaLabel='Titre de la réutilisation'
            description='Titre de la réutilisation'
            onValueChange={e => setTitre(e.target.value)}
          />
        </div>
        <div className='fr-col-12 fr-col-md-6 fr-pt-3w fr-pt-md-0 fr-pr-md-3w'>
          <TextInput
            isRequired
            label='Lien'
            value={lien}
            ariaLabel='Lien vers la réutilisation'
            description='Lien vers la réutilisation'
            onValueChange={e => setLien(e.target.value)}
          />
        </div>
      </div>
      <div className='fr-grid-row fr-my-5w'>
        <div className='fr-grid-row fr-col-12 fr-pr-md-3w'>
          <div className='fr-col-12'>
            <TextInput
              type='textarea'
              label='Description'
              value={description}
              ariaLabel='Description de la réutilisation'
              description='Description de la réutilisation'
              onValueChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='fr-grid-row'>
        <Button
          label='Valider l’ajout de la subvention'
          icon='checkbox-circle-fill'
          isDisabled={!isFormComplete}
          onClick={handleSubmit}
        >
          Valider
        </Button>
        <div className='fr-pl-3w'>
          <Button
            label='Annuler l’ajout de la subvention'
            buttonStyle='tertiary'
            onClick={onCancel}
          >
            Annuler
          </Button>
        </div>
      </div>
    </>
  )
}

ReutilisationForm.propTypes = {
  initialValues: PropTypes.object,
  isReutilisationExists: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ReutilisationForm

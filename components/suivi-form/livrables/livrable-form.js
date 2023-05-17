/* eslint-disable camelcase */
import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import {natureOptions, diffusionOptions, licenceOptions, publicationOptions, systRefSpatialOptions} from '@/components/suivi-form/livrables/utils/select-options.js'

import SelectInput from '@/components/select-input.js'
import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'
import DateInput from '@/components/date-input.js'
import NumberInput from '@/components/number-input.js'

const LivrableForm = ({livrables, updatingLivrableIdx, isEditing, handleUpdatingLivrableIdx, handleLivrables, handleAdding, handleEditing, onRequiredFormOpen}) => {
  const [hasMissingInput, setHasMissingInput] = useState(false)
  const [hasInvalidInput, setHasInvalidInput] = useState(false)
  const [updatingLivrableName, setUpdatingLivrableName] = useState()
  const [errorMessage, setErrorMessage] = useState()

  const [livrable, setLivrable] = useState({
    nom: '',
    nature: '',
    diffusion: '',
    licence: '',
    avancement: '',
    crs: '',
    compression: '',
    publication: '',
    date_livraison: ''
  })

  const {nom, nature, diffusion, licence, avancement, crs, compression, publication, date_livraison} = livrable

  const avancementAsNumber = Number(avancement) || null

  const isFormComplete = Boolean(nom && nature && licence)
  const isAvancementValid = avancementAsNumber >= 0 && avancementAsNumber <= 100

  const handleSubmit = () => {
    setErrorMessage(null)

    if (isFormComplete && isAvancementValid && !hasInvalidInput) {
      const checkIsExisting = () => {
        if (isEditing) {
          return livrables.some(livrable => livrable.nom === nom) && nom !== updatingLivrableName
        }

        return livrables.some(livrable => livrable.nom === nom)
      }

      if (checkIsExisting()) {
        setErrorMessage('Un livrable avec un nom identique est déjà présent.')
      } else {
        const newLivrable = {
          nom,
          nature,
          diffusion: diffusion || null,
          licence,
          avancement: avancementAsNumber,
          crs: crs || null,
          compression: compression || null,
          publication: publication || null,
          date_livraison: date_livraison || null
        }

        if (isEditing) {
          handleLivrables(prevLivrables => {
            const livrablesCopy = [...prevLivrables]
            livrablesCopy[updatingLivrableIdx] = newLivrable
            return livrablesCopy
          })
        } else {
          handleLivrables([...livrables, newLivrable])
        }

        onReset()
      }
    } else {
      setHasMissingInput(true)
    }
  }

  const handleErrorMessage = (input => {
    if (!input && hasMissingInput) {
      return 'Ce champs est requis'
    }
  })

  const onReset = useCallback(() => {
    handleAdding(false)
    handleEditing(false)
    onRequiredFormOpen(false)
    setHasMissingInput(false)
    setLivrable({
      nom: '',
      nature: '',
      diffusion: '',
      licence: '',
      avancement: '',
      crs: '',
      compression: '',
      publication: '',
      date_livraison: ''
    })
    handleUpdatingLivrableIdx(null)
    setErrorMessage(null)
    setUpdatingLivrableName(null)
  }, [handleAdding, handleEditing, handleUpdatingLivrableIdx, onRequiredFormOpen])

  useEffect(() => {
    // Switch to livrable update form
    if (isEditing) {
      const foundLivrable = livrables[updatingLivrableIdx]

      setLivrable({
        nom: foundLivrable.nom,
        nature: foundLivrable.nature,
        diffusion: foundLivrable.diffusion,
        licence: foundLivrable.licence,
        avancement: foundLivrable.avancement?.toString() || '',
        crs: foundLivrable.crs || '',
        compression: foundLivrable.compression || '',
        publication: foundLivrable.publication || '',
        date_livraison: foundLivrable.date_livraison || ''
      })

      setUpdatingLivrableName(foundLivrable.nom)
      onRequiredFormOpen(false)
    }
  }, [updatingLivrableIdx, livrables, isEditing, onRequiredFormOpen])

  return (
    <div className='fr-mt-4w'>
      <div className='fr-grid-row'>
        {/* Nom du livrable */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-mb-0 fr-pr-3w'>
          <TextInput
            isRequired
            label='Nom'
            ariaLabel='nom du livrable'
            description='Nom du livrable'
            value={nom}
            placeholder='Nom du livrable'
            errorMessage={handleErrorMessage(nom)}
            onValueChange={e => {
              setLivrable({
                ...livrable,
                nom: e.target.value
              })
            }}
          />
        </div>

        {/* Nature du livrable - selecteur */}
        <div className='fr-col-12 fr-mt-6w fr-col-lg-4 fr-pr-3w'>
          <SelectInput
            isRequired
            label='Nature'
            value={nature}
            ariaLabel='nature du livrable'
            description='Nature du livrable'
            errorMessage={handleErrorMessage(nature)}
            options={natureOptions}
            onValueChange={e => {
              setLivrable({
                ...livrable,
                nature: e.target.value
              })
            }}
          />
        </div>

        {/* Mode de diffusion du livrable - selecteur */}
        <div className='fr-col-12 fr-mt-6w fr-col-lg-4 fr-pr-3w'>
          <SelectInput
            label='Diffusion'
            options={diffusionOptions}
            value={diffusion}
            ariaLabel='mode de diffusion du livrable'
            description='Mode de diffusion'
            errorMessage={handleErrorMessage(diffusion)}
            onValueChange={e => {
              setLivrable({
                ...livrable,
                diffusion: e.target.value
              })
            }}
          />
        </div>
      </div>

      <div className='fr-grid-row'>
        {/* Licence du livrable - select */}
        <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-mt-6w fr-mb-0 fr-pr-3w'>
          <SelectInput
            isRequired
            label='Licence'
            value={licence}
            ariaLabel='licence du livrable'
            description='Licence du livrable'
            errorMessage={handleErrorMessage(licence)}
            options={licenceOptions}
            onValueChange={e => {
              setLivrable({
                ...livrable,
                licence: e.target.value
              })
            }}
          />
        </div>

        {/* Type de publication du livrable - text */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <SelectInput
            label='Publication'
            options={publicationOptions}
            value={publication}
            ariaLabel='publication du livrable'
            description='Publication du livrable'
            onValueChange={e => {
              setLivrable({
                ...livrable,
                publication: e.target.value
              })
            }}
          />
        </div>

        {/* Date de livraison du projet - date */}
        <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <DateInput
            label='Date de livraison'
            value={date_livraison}
            ariaLabel='date de livraison du livrable'
            description='Date de livraison du livrable'
            onValueChange={e => {
              setLivrable({
                ...livrable,
                date_livraison: e.target.value
              })
            }}
          />
        </div>
      </div>

      <div className='fr-grid-row'>
        {/* Avancement du livrable - number */}
        <div className='fr-input-group fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
          <NumberInput
            label='Avancement'
            value={avancement}
            ariaLabel='pourcentage de progression du livrable en pourcentage'
            description='Pourcentage de progression'
            min={0}
            max={100}
            handleInvalidInput={setHasInvalidInput}
            onValueChange={e => {
              setLivrable({
                ...livrable,
                avancement: e.target.value
              })
            }}
          />
        </div>

        {/* Système de référence spatial du livrable - select */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <SelectInput
            label='Système de référence spatial'
            options={systRefSpatialOptions}
            value={crs}
            ariaLabel='système de référence spatial du livrable'
            description='Identifiant EPSG du livrable'
            onValueChange={e => {
              setLivrable({
                ...livrable,
                crs: e.target.value
              })
            }}
          />
        </div>

        {/* Nature de compression du livrable - text */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <TextInput
            label='Compression'
            value={compression}
            ariaLabel='nature de compression du livrable'
            description='Nature de compression du livrable'
            onValueChange={e => {
              setLivrable({
                ...livrable,
                compression: e.target.value
              })
            }}
          />
        </div>

      </div>

      <div className='fr-grid-row fr-mt-3w'>
        <Button
          label='Valider l’ajout du livrable'
          icon='checkbox-circle-fill'
          onClick={handleSubmit}
        >
          Valider
        </Button>

        <div className='fr-pl-3w'>
          <Button
            label='Annuler l’ajout du livrable'
            buttonStyle='tertiary'
            onClick={onReset}
          >
            Annuler
          </Button>
        </div>
      </div>
      {errorMessage && <p id='text-input-error-desc-error' className='fr-error-text'>{errorMessage}</p>}
    </div>
  )
}

LivrableForm.propTypes = {
  updatingLivrableIdx: PropTypes.number,
  handleUpdatingLivrableIdx: PropTypes.func.isRequired,
  livrables: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
  handleLivrables: PropTypes.func.isRequired,
  handleAdding: PropTypes.func.isRequired,
  handleEditing: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired
}

LivrableForm.defaultProps = {
  updatingLivrableIdx: null
}

export default LivrableForm

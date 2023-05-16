/* eslint-disable camelcase */
import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'

import {natureOptions, diffusionOptions, licenceOptions, publicationOptions, systRefSpatialOptions} from '@/components/suivi-form/livrables/utils/select-options.js'

import {useInput} from '@/hooks/input.js'

import SelectInput from '@/components/select-input.js'
import TextInput from '@/components/text-input.js'
import Button from '@/components/button.js'
import DateInput from '@/components/date-input.js'
import NumberInput from '@/components/number-input.js'

const LivrableForm = ({livrables, updatingLivrableIdx, isEditing, handleUpdatingLivrableIdx, handleLivrables, handleAdding, handleEditing, onRequiredFormOpen}) => {
  const [isFormComplete, setIsFormComplete] = useState(true)
  const [updatingLivrableName, setUpdatingLivrableName] = useState()
  const [errorMessage, setErrorMessage] = useState()

  const [nom, setNom, nomError] = useInput({isRequired: !isFormComplete})
  const [nature, setNature, natureError] = useInput({isRequired: !isFormComplete})
  const [diffusion, setDiffusion, diffusionError] = useInput({isRequired: !isFormComplete})
  const [licence, setLicence, licenceError] = useInput({isRequired: !isFormComplete})
  const [avancement, setAvancement, avancementError, setIsAvancementValid, isAvancementValid] = useInput({})
  const [crs, setCrs, crsError] = useInput({})
  const [compression, setCompression, compressionError] = useInput({})
  const [publication, setPublication, publicationError] = useInput({})
  const [dateLivraison, setDateLivraison, dateLivraisonError] = useInput({})

  const isCompleteOnSubmit = Boolean(nom && nature && licence)

  useEffect(() => {
    if (isCompleteOnSubmit && isAvancementValid) {
      setErrorMessage(null)
    }
  }, [isCompleteOnSubmit, isAvancementValid])

  const handleSubmit = () => {
    setErrorMessage(null)

    if (isCompleteOnSubmit) {
      if (isAvancementValid) {
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
            avancement: Number(avancement) || null,
            crs: crs || null,
            compression: compression || null,
            publication: publication || null,
            date_livraison: dateLivraison || null
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
        setErrorMessage('Veuillez modifier les champs invalides')
      }
    } else {
      setIsFormComplete(false)
      setErrorMessage('Veuillez compléter les champs requis manquants')
    }
  }

  const onReset = useCallback(() => {
    handleAdding(false)
    handleEditing(false)
    onRequiredFormOpen(false)
    setIsFormComplete(true)
    handleUpdatingLivrableIdx(null)
    setErrorMessage(null)
    setUpdatingLivrableName(null)

    setNom('')
    setNature('')
    setDiffusion('')
    setLicence('')
    setAvancement('')
    setCrs('')
    setCompression('')
    setPublication('')
    setDateLivraison('')
  }, [
    handleAdding,
    handleEditing,
    handleUpdatingLivrableIdx,
    onRequiredFormOpen,
    setNom,
    setNature,
    setDiffusion,
    setLicence,
    setAvancement,
    setCrs,
    setCompression,
    setPublication,
    setDateLivraison
  ])

  useEffect(() => {
    // Switch to livrable update form
    if (isEditing) {
      const foundLivrable = livrables[updatingLivrableIdx]
      setNom(foundLivrable.nom)
      setNature(foundLivrable.nature)
      setDiffusion(foundLivrable.diffusion)
      setLicence(foundLivrable.licence)
      setAvancement(foundLivrable.avancement?.toString() || '')
      setCrs(foundLivrable.crs || '')
      setCompression(foundLivrable.compression || '')
      setPublication(foundLivrable.publication || '')
      setDateLivraison(foundLivrable.date_livraison || '')

      setUpdatingLivrableName(foundLivrable.nom)
      onRequiredFormOpen(false)
    }
  }, [
    updatingLivrableIdx,
    livrables,
    isEditing,
    onRequiredFormOpen,
    setNom,
    setNature,
    setDiffusion,
    setLicence,
    setAvancement,
    setCrs,
    setCompression,
    setPublication,
    setDateLivraison
  ])

  return (
    <div className='fr-mt-4w'>
      <div className='fr-grid-row fr-grid-row--bottom'>
        {/* Nom du livrable */}
        <div className='fr-col-12 fr-col-lg-4 fr-pr-3w'>
          <TextInput
            isRequired
            label='Nom'
            ariaLabel='nom du livrable'
            value={nom}
            placeholder='Nom du livrable'
            errorMessage={nomError}
            onValueChange={e => setNom(e.target.value)}
          />
        </div>

        {/* Nature du livrable - selecteur */}
        <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
          <SelectInput
            isRequired
            label='Nature'
            value={nature}
            ariaLabel='nature du livrable'
            description='Nature du livrable'
            errorMessage={natureError}
            options={natureOptions}
            onValueChange={e => setNature(e.target.value)}
          />
        </div>

        {/* Mode de diffusion du livrable - selecteur */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <SelectInput
            label='Diffusion'
            options={diffusionOptions}
            value={diffusion}
            ariaLabel='mode de diffusion du livrable'
            description='Mode de diffusion'
            errorMessage={diffusionError}
            onValueChange={e => setDiffusion(e.target.value)}
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
            errorMessage={licenceError}
            options={licenceOptions}
            onValueChange={e => setLicence((e.target.value))}
          />
        </div>

        {/* Type de publication du livrable - text */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <SelectInput
            label='Publication'
            options={publicationOptions}
            value={publication}
            errorMessage={publicationError}
            ariaLabel='publication du livrable'
            description='Publication du livrable'
            onValueChange={e => setPublication((e.target.value))}
          />
        </div>

        {/* Date de livraison du projet - date */}
        <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <DateInput
            label='Date de livraison'
            value={dateLivraison}
            ariaLabel='date de livraison du livrable'
            description='Date de livraison du livrable'
            errorMessage={dateLivraisonError}
            onValueChange={e => setDateLivraison(e.target.value)}
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
            errorMessage={avancementError}
            setIsValueValid={setIsAvancementValid}
            onValueChange={e => setAvancement(e.target.value)}
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
            errorMessage={crsError}
            onValueChange={e => setCrs(e.target.value)}
          />
        </div>

        {/* Nature de compression du livrable - text */}
        <div className='fr-col-12 fr-col-lg-4 fr-mt-6w fr-pr-3w'>
          <TextInput
            label='Compression'
            value={compression}
            ariaLabel='nature de compression du livrable'
            description='Nature de compression du livrable'
            errorMessage={compressionError}
            onValueChange={e => setCompression(e.target.value)}
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

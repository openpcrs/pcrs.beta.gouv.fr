/* eslint-disable camelcase */
import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {uniqueId, find} from 'lodash-es'

import LivrableCard from '@/components/suivi-form/livrables/livrable-card.js'
import SelectInput from '@/components/select-input.js'
import TextInput from '@/components/text-input.js'
import NumberInput from '@/components/number-input.js'
import Button from '@/components/button.js'
import DateInput from '@/components/date-input.js'

const NATURES = [
  {label: 'Livrable GeoTIFF', value: 'geotiff'},
  {label: 'Livrable Jpeg 2000', value: 'jpeg2000'},
  {label: 'Livrable GML vecteur', value: 'gml'}
]

const DIFFUSIONS = [
  {label: 'Diffusion via un service WMS', value: 'wms'},
  {label: 'Diffusion via un service WMTS', value: 'wmts'},
  {label: 'Diffusion via un service TMS', value: 'tms'}
]

const LICENCES = [
  {label: 'Ouvert sous licence ODbL', value: 'ouvert_odbl'},
  {label: 'Ouvert sous licence ouverte', value: 'ouvert_lo'},
  {label: 'Fermé', value: 'ferme'}
]

const SYST_REF_SPATIAL = [
  {label: 'EPSG:2154', value: 'EPSG:2154'},
  {label: 'EPSG:3942', value: 'EPSG:3942'},
  {label: 'EPSG:3943', value: 'EPSG:3943'},
  {label: 'EPSG:3944', value: 'EPSG:3944'},
  {label: 'EPSG:3945', value: 'EPSG:3945'},
  {label: 'EPSG:3946', value: 'EPSG:3946'},
  {label: 'EPSG:3947', value: 'EPSG:3947'},
  {label: 'EPSG:3948', value: 'EPSG:3948'},
  {label: 'EPSG:3949', value: 'EPSG:3949'},
  {label: 'EPSG:3950', value: 'EPSG:3950'},
  {label: 'EPSG:32620', value: 'EPSG:32620'},
  {label: 'EPSG:5490', value: 'EPSG:5490'},
  {label: 'EPSG:2971', value: 'EPSG:2971'},
  {label: 'EPSG:2975', value: 'EPSG:2975'},
  {label: 'EPSG:4471', value: 'EPSG:4471'}
]

const PUBLICATIONS = [
  {label: 'Accès via FTP', value: 'ftp'},
  {label: 'Accès via un service cloud (oneDrive...)', value: 'cloud'},
  {label: 'Accès via service HTTP(S)', value: 'http'},
  {label: 'Aucun moyen d’accès en ligne', value: 'inexistante'}
]

const Livrables = ({livrables, hasMissingData, handleLivrables, onRequiredFormOpen}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hasMissingInput, setHasMissingInput] = useState(false)
  const [hasInvalidInput, setHasInvalidInput] = useState(false)
  const [updatingLivrableIndex, setUpdatingLivrableIndex] = useState()
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
  const isUpdating = updatingLivrableIndex || updatingLivrableIndex === 0

  const onAdd = () => {
    if (avancement && avancement < 0) {
      return setErrorMessage('Veuillez entrer des valeurs supérieurs à 0 dans les champs de financement')
    }

    if (isFormComplete && isAvancementValid && !hasInvalidInput) {
      if (livrables.some(livrable => livrable.nom === nom)) {
        setErrorMessage('Un livrable avec un nom identique est déjà présent.')
      } else {
        handleLivrables([...livrables, {
          nom,
          nature,
          diffusion: diffusion || null,
          licence,
          avancement: avancementAsNumber,
          crs: crs || null,
          compression: compression || null,
          publication: publication || null,
          date_livraison: date_livraison || null
        }])

        onReset()
      }
    } else {
      setHasMissingInput(true)
    }
  }

  const onUpdate = () => {
    if (avancement && avancement < 0) {
      return setErrorMessage('Veuillez entrer des valeurs supérieurs à 0 dans les champs de financement')
    }

    if (isFormComplete && isAvancementValid) {
      if (livrables.some(livrable => livrable.nom === nom) && nom !== updatingLivrableName) {
        setErrorMessage('Un livrable avec un nom identique est déjà présent.')
      } else {
        handleLivrables([...livrables].map((livrable, i) => {
          if (i === updatingLivrableIndex) {
            livrable = {
              nom,
              nature,
              diffusion,
              licence,
              avancement: avancementAsNumber,
              crs: crs || null,
              compression: compression || null,
              publication: publication || null,
              date_livraison: date_livraison || null
            }
          }

          return livrable
        }))

        onReset()
      }
    } else {
      setHasMissingInput(true)
    }
  }

  const onDelete = index => {
    handleLivrables(current => current.filter((_, i) => index !== i))
    onReset()
  }

  const handleErrorMessage = (input => {
    if (!input && hasMissingInput) {
      return 'Ce champs est requis'
    }
  })

  const onReset = useCallback(() => {
    setIsFormOpen(false)
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
    setUpdatingLivrableIndex()
    setErrorMessage()
    setUpdatingLivrableName()
  }, [onRequiredFormOpen])

  useEffect(() => {
    // Switch to livrable update form
    if (isUpdating) {
      const foundLivrable = livrables[updatingLivrableIndex]

      setLivrable({
        nom: foundLivrable.nom,
        nature: foundLivrable.nature,
        diffusion: foundLivrable.diffusion,
        licence: foundLivrable.licence,
        avancement: foundLivrable.avancement?.toString() || '',
        crs: foundLivrable.crs || '',
        compression: foundLivrable.compression || '',
        publication: foundLivrable.publication
      })

      setUpdatingLivrableName(foundLivrable.nom)
      setIsFormOpen(true)
      onRequiredFormOpen(false)
    }
  }, [updatingLivrableIndex, livrables, isUpdating, onRequiredFormOpen])

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5 fr-m-0'>Livrables *</h3>
      {(hasMissingData && livrables.length === 0) && (
        <div className='fr-error-text fr-mt-1w'>Au moins un livrable doit être ajouté</div>
      )}

      <div className='fr-mt-3w'>
        <Button
          label='Ajouter un livrable'
          icon='add-circle-fill'
          iconSide='left'
          isDisabled={isFormOpen}
          onClick={() => {
            onRequiredFormOpen(true)
            setIsFormOpen(true)
          }}
        >
          Ajouter un livrable
        </Button>
      </div>
      {(livrables.length > 1 || isFormOpen) && <div className='separator fr-my-3w' />}

      {(isFormOpen || isUpdating) && (
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
            <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
              <SelectInput
                isRequired
                label='Nature'
                value={nature}
                ariaLabel='nature du livrable'
                description='Nature du livrable'
                errorMessage={handleErrorMessage(nature)}
                options={NATURES}
                onValueChange={e => {
                  setLivrable({
                    ...livrable,
                    nature: e.target.value
                  })
                }}
              />
            </div>

            {/* Mode de diffusion du livrable - selecteur */}
            <div className='fr-col-12 fr-col-lg-4 fr-mt-6w'>
              <SelectInput
                isRequired
                label='Diffusion'
                options={DIFFUSIONS}
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
            <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w fr-mb-0'>
              <SelectInput
                isRequired
                label='Licence'
                value={licence}
                ariaLabel='licence du livrable'
                description='Licence du livrable'
                errorMessage={handleErrorMessage(licence)}
                options={LICENCES}
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
                options={PUBLICATIONS}
                value={publication}
                errorMessage={handleErrorMessage(publication)}
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
            <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-mt-6w'>
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
            <div className='fr-input-group fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w fr-mb-0'>
              <NumberInput
                label='Avancement'
                value={avancement}
                ariaLabel='pourcentage de progression du livrable en pourcentage'
                description='Pourcentage de progression'
                min={0}
                max={100}
                onIsInvalid={setHasInvalidInput}
                onValueChange={e => {
                  setLivrable({
                    ...livrable,
                    avancement: e.target.value
                  })
                }}
              />
            </div>

            {/* Système de référence spatial du livrable - select */}
            <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
              <SelectInput
                label='Système de référence spatial'
                options={SYST_REF_SPATIAL}
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
            <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
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
              onClick={() => isUpdating ? onUpdate() : onAdd()}
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
      )}

      {livrables.map((livrable, idx) => {
        const {nom, nature, licence, crs, avancement, diffusion, publication} = livrable

        return (
          <LivrableCard
            key={uniqueId()}
            index={idx}
            nom={nom}
            nature={find(NATURES, n => n.value === nature).label}
            licence={find(LICENCES, l => l.value === licence).label}
            diffusion={find(DIFFUSIONS, d => d.value === diffusion)?.label}
            crs={crs}
            publication={find(PUBLICATIONS, p => p.value === publication)?.label}
            avancement={avancement}
            handleEdition={() => setUpdatingLivrableIndex(idx)}
            handleDelete={() => onDelete(idx)}
          />
        )
      })}
    </div>
  )
}

Livrables.propTypes = {
  livrables: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handleLivrables: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired
}

Livrables.defaultProps = {
  hasMissingData: false
}

export default Livrables

import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {uniqueId, find} from 'lodash-es'

import LivrableCard from '@/components/suivi-form/livrables/livrable-card.js'
import SelectInput from '@/components/select-input.js'
import TextInput from '@/components/text-input.js'
import NumberInput from '@/components/number-input.js'
import Button from '@/components/button.js'

const NATURES = [
  {label: 'Livrable GeoTIFF', value: 'geotiff'},
  {label: 'Livrable Jpeg 2000', value: 'jpeg2000'},
  {label: 'Livrable GML vecteur', value: 'gml'}
]

const DIFFUSIONS = [
  {label: 'Téléchargement massif', value: 'telechargement'},
  {label: 'Accès via un serveur/flux', value: 'flux'}
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

const Livrables = ({livrables, hasMissingData, handleLivrables}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hasMissingInput, setHasMissingInput] = useState(false)
  const [updatingLivrableIndex, setUpdatingLivrableIndex] = useState()

  const [nom, setNom] = useState('')
  const [nature, setNature] = useState('')
  const [diffusion, setDiffusion] = useState('')
  const [licence, setLicence] = useState('')
  const [avancement, setAvancement] = useState('')
  const [crs, setCrs] = useState('')
  const [compression, setCompression] = useState('')

  const avancementAsNumber = Number(avancement)

  const isFormComplete = Boolean(nom && nature && licence)
  const isAvancementValid = avancementAsNumber >= 0 && avancementAsNumber <= 100
  const isUpdating = updatingLivrableIndex || updatingLivrableIndex === 0

  const onAdd = () => {
    if (isFormComplete && isAvancementValid) {
      handleLivrables([...livrables, {nom, nature, diffusion, licence, avancement: avancementAsNumber, crs, compression}])

      onReset()
    } else {
      setHasMissingInput(true)
    }
  }

  const onUpdate = () => {
    if (isFormComplete && isAvancementValid) {
      handleLivrables([...livrables].map((livrable, i) => {
        if (i === updatingLivrableIndex) {
          livrable = {
            nom,
            nature,
            diffusion,
            licence,
            avancement: avancementAsNumber,
            crs,
            compression
          }
        }

        return livrable
      }))

      onReset()
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
    setHasMissingInput(false)
    setNom('')
    setNature('')
    setDiffusion('')
    setLicence('')
    setAvancement('')
    setCrs('')
    setCompression('')
    setUpdatingLivrableIndex()
  }, [])

  useEffect(() => {
    // Switch to livrable update form
    if (isUpdating) {
      const foundedLivrable = livrables[updatingLivrableIndex]

      setNom(foundedLivrable.nom)
      setNature(foundedLivrable.nature)
      setDiffusion(foundedLivrable.diffusion)
      setLicence(foundedLivrable.licence)
      setAvancement(foundedLivrable.avancement?.toString())
      setCrs(foundedLivrable.crs)
      setCompression(foundedLivrable.compression)

      setIsFormOpen(true)
    }
  }, [updatingLivrableIndex, livrables, isUpdating])

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
          onClick={() => setIsFormOpen(true)}
        >
          Ajouter un livrable
        </Button>
      </div>
      {(livrables.length > 1 || isFormOpen) && <div className='separator fr-my-3w' />}

      {(isFormOpen || isUpdating) && (
        <div className='fr-mt-4w'>
          <div className='fr-grid-row'>
            {/* Nom du livrable */}
            <div className='fr-col-12 fr-col-md-6'>
              <TextInput
                isRequired
                label='Nom *'
                ariaLabel='nom du livrable'
                value={nom}
                placeholder='Nom du livrable'
                errorMessage={handleErrorMessage(nom)}
                onValueChange={setNom}
              />
            </div>
          </div>

          <div className='fr-grid-row'>
            {/* Nature du livrable - selecteur */}
            <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
              <SelectInput
                isRequired
                label='Nature *'
                value={nature}
                ariaLabel='nature du livrable'
                description='Nature du livrable'
                errorMessage={handleErrorMessage(nature)}
                options={NATURES}
                onValueChange={setNature}
              />
            </div>

            {/* Mode de diffusion du livrable - selecteur */}
            <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
              <SelectInput
                label='Diffusion'
                options={DIFFUSIONS}
                value={diffusion}
                ariaLabel='mode de diffusion du livrable'
                description='Mode de diffusion'
                onValueChange={setDiffusion}
              />
            </div>

            {/* Licence du livrable - select */}
            <div className='fr-select-group fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
              <SelectInput
                isRequired
                label='Licence *'
                value={licence}
                ariaLabel='licence du livrable'
                description='Licence du livrable'
                errorMessage={handleErrorMessage(licence)}
                options={LICENCES}
                onValueChange={setLicence}
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
                onValueChange={setAvancement}
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
                onValueChange={setCrs}
              />
            </div>

            {/* Nature de compression du livrable - text */}
            <div className='fr-col-12 fr-col-lg-4 fr-pr-3w fr-mt-6w'>
              <TextInput
                label='Compression'
                value={compression}
                ariaLabel='nature de compression du livrable'
                description='Nature de compression du livrable'
                onValueChange={setCompression}
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
                onClick={() => onReset()}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {livrables.map((livrable, idx) => {
        const {nom, nature, licence, crs, avancement, diffusion} = livrable

        return (
          <LivrableCard
            key={uniqueId()}
            index={idx}
            nom={nom}
            nature={find(NATURES, n => n.value === nature).label}
            licence={find(LICENCES, l => l.value === licence).label}
            diffusion={find(DIFFUSIONS, d => d.value === diffusion)?.label}
            crs={crs}
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
  handleLivrables: PropTypes.func.isRequired
}

Livrables.defaultProps = {
  hasMissingData: false
}

export default Livrables

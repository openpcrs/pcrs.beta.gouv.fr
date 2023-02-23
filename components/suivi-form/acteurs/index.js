/* eslint-disable camelcase */
import {useState, useEffect, useMemo, useCallback} from 'react'
import PropTypes from 'prop-types'
import {orderBy, debounce, pick} from 'lodash-es'

import {secteursActivites} from '@/components/suivi-form/acteurs/utils/actor-activites.js'

import colors from '@/styles/colors.js'

import {getEntreprises} from '@/lib/entreprises-api.js'

import ActeurCard from '@/components/suivi-form/acteurs/acteur-card.js'
import AutocompleteInput from '@/components/autocomplete-input.js'
import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import NumberInput from '@/components/number-input.js'
import Button from '@/components/button.js'

const ROLES = [
  {label: 'Autorité Public Locale Compétente', value: 'aplc'},
  {label: 'Financeur', value: 'financeur'},
  {label: 'Diffuseur des livrables', value: 'diffuseur'},
  {label: 'Prestataire de vol', value: 'presta_vol'},
  {label: 'Prestataire de relevé LIDAR', value: 'presta_lidar'},
  {label: 'Contrôleur des livrables', value: 'controleur'}
]

const Acteurs = ({acteurs, handleActors, hasMissingData}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hasInvalidInput, setHasInvalidInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [nom, setNom] = useState('')
  const [siren, setSiren] = useState('')
  const [phone, setPhone] = useState('')
  const [finPerc, setFinPerc] = useState('')
  const [finEuros, setFinEuros] = useState('')
  const [role, setRole] = useState('')
  const [foundedEtablissements, setFoundedEtablissements] = useState([])
  const [updatingActorIndex, setUpdatingActorIndex] = useState()

  const sortActorsByAplc = orderBy(acteurs, a => a.role === 'aplc', ['desc'])
  const isFormComplete = useMemo(() => nom && role, [nom, role])
  const isSirenValid = useMemo(() => siren && /^\d{9}$/.test(siren), [siren]) // Check if siren is 9 numbers long
  const isUpdating = useMemo(() => updatingActorIndex || updatingActorIndex === 0, [updatingActorIndex])

  const onAdd = () => {
    if (isFormComplete && isSirenValid) {
      const newActor = {
        nom,
        siren: Number(siren),
        role,
        telephone: phone,
        finance_part_perc: Number(finPerc),
        finance_part_euro: Number(finEuros)
      }

      handleActors([...acteurs, newActor])
      onReset()
    } else {
      setHasInvalidInput(true)
    }
  }

  const onUpdate = () => {
    if (isFormComplete && isSirenValid) {
      handleActors([...acteurs].map((acteur, idx) => {
        if (idx === updatingActorIndex) {
          acteur = {
            nom,
            siren: Number(siren),
            role,
            telephone: phone,
            finance_part_perc: Number(finPerc),
            finance_part_euro: Number(finEuros)
          }
        }

        return acteur
      }))

      onReset()
    } else {
      setHasInvalidInput(true)
    }
  }

  const onDelete = siren => {
    handleActors(current => current.filter(c => c.siren !== siren))
    onReset()
  }

  const onReset = () => {
    setIsFormOpen(false)
    setHasInvalidInput(false)
    setNom('')
    setSiren()
    setPhone('')
    setFinPerc()
    setFinEuros()
    setRole('')
    setUpdatingActorIndex()
  }

  const handleErrors = useCallback((input, name) => {
    if (!input && hasInvalidInput) {
      if (!input) {
        return 'Ce champs est requis'
      }

      if (name === 'siren' && !isSirenValid) {
        return 'Le SIREN doit être composé de 9 chiffres'
      }
    }
  }, [isSirenValid, hasInvalidInput])

  useEffect(() => {
    // Disable APLC selector option when already selected
    const hasAplc = acteurs.some(actor => actor.role === 'aplc')
    ROLES.find(role => role.value === 'aplc').isDisabled = Boolean(hasAplc)
  }, [acteurs])

  useEffect(() => {
    // Switch to actor update form
    if (isUpdating) {
      const foundedActor = acteurs[updatingActorIndex]
      setNom(foundedActor.nom)
      setSiren(foundedActor.siren?.toString())
      setRole(foundedActor.role)
      setFinPerc(foundedActor.finance_part_perc?.toString())
      setFinEuros(foundedActor.finance_part_euro?.toString())
      setPhone(foundedActor.telephone)

      setIsFormOpen(true)
    }
  }, [isUpdating, updatingActorIndex, acteurs])

  useEffect(() => {
    // Fetch actors on name changes
    if (nom && nom.length >= 3) {
      const fetchActors = (debounce(async () => {
        setIsLoading(true)
        try {
          const foundedActors = await getEntreprises(nom)
          const firstResults = foundedActors.results.slice(0, 5)

          const filteredResults = firstResults.map(result => pick(result, ['nom_complet', 'siren', 'section_activite_principale', 'tranche_effectif_salarie']))

          setFoundedEtablissements(filteredResults)
        } catch {
          setFoundedEtablissements([])
        }

        setIsLoading(false)
      }, 300))

      fetchActors()
    }
  }, [nom])

  const renderItem = (item, isHighlighted) => {
    const {nom_complet, section_activite_principale, siren} = item

    return (
      <div key={siren} className='item fr-px-1w fr-py-2w'>
        {nom_complet} - <span className='ape'>{secteursActivites[section_activite_principale]}</span>

        <style jsx>{`
          .item {
            background: ${isHighlighted ? colors.info425 : 'white'};
            color: ${isHighlighted ? 'white' : colors.darkgrey};
          }

          .ape {
            font-weight: bold;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5 fr-m-0'>Acteurs *</h3>
      {(hasMissingData && acteurs.length === 0) && (
        <div className='fr-error-text fr-mt-1w'>Au moins un acteur doit être ajouté</div>
      )}

      <div className='fr-mt-3w'>
        <Button
          label='Ajouter un acteur'
          icon='add-circle-fill'
          iconSide='left'
          isDisabled={isFormOpen || isUpdating}
          onClick={() => setIsFormOpen(true)}
        >
          Ajouter un acteur
        </Button>
      </div>
      {(acteurs.length > 1 || isFormOpen) && <div className='separator fr-my-3w' />}

      {(isFormOpen || isUpdating) && (
        <div className='fr-mt-4w'>
          <div className='fr-grid-row '>
            <div className='fr-col-12 fr-col-md-6'>
              <AutocompleteInput
                isRequired
                label='Nom *'
                value={nom}
                name='nom'
                description='Nom de l’entreprise'
                ariaLabel='nom de l’entreprise à rechercher'
                results={foundedEtablissements}
                isLoading={isLoading}
                errorMessage={handleErrors(nom)}
                getItemValue={item => item.siren}
                customItem={renderItem}
                onValueChange={setNom}
                onSelectValue={item => {
                  const foundActorName = foundedEtablissements.find(result => result.siren === item).nom_complet
                  setNom(foundActorName)
                  setSiren(item)
                }}
              />
            </div>
            <div className='fr-col-12 fr-col-md-6 fr-pl-md-3w'>
              <TextInput
                isRequired
                label='SIREN *'
                value={siren}
                ariaLabel='numéro siren de l’entreprise'
                description='SIREN de l’entreprise'
                errorMessage={handleErrors(siren, 'siren')}
                onValueChange={setSiren}
              />
            </div>
          </div>

          <div className='fr-grid-row'>
            <div className='fr-col-12 fr-mt-6w fr-col-md-6'>
              <TextInput
                label='Téléphone'
                value={phone}
                ariaLabel='numéro de téléphone de l’interlocuteur'
                description='Numéro de téléphone de l’interlocuteur'
                onValueChange={setPhone}
              />
            </div>
            <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
              <SelectInput
                isRequired
                label='Rôle *'
                options={ROLES}
                value={role}
                description='Rôle de l’acteur dans le projet'
                ariaLabel='rôle de l’acteur dans le projet'
                errorMessage={handleErrors(role)}
                onValueChange={setRole}
              />
            </div>
          </div>

          <div className='fr-grid-row fr-col-12'>
            <div className='fr-col-12 fr-col-md-6 fr-mt-6w'>
              <NumberInput
                label='Part de financement'
                value={finPerc}
                ariaLabel='Part de financement en pourcentage du total'
                description='Part de financement en pourcentage du total'
                placeholder='Veuillez n’entrer que des valeurs numéraires'
                min={0}
                max={100}
                onValueChange={setFinPerc}
              />
            </div>
            <div className='fr-col-12 fr-col-md-6 fr-mt-6w fr-pl-md-3w'>
              <NumberInput
                label='Montant du financement'
                value={finEuros}
                placeholder='Veuillez n’entrer que des valeurs numéraires'
                description='Montant du financement en euros'
                ariaLabel='montant du financement'
                onValueChange={setFinEuros}
              />
            </div>
          </div>

          <div className='fr-grid-row fr-mt-3w'>
            <Button
              label='Valider l’ajout de l’acteur'
              icon='checkbox-circle-fill'
              onClick={() => isUpdating ? onUpdate() : onAdd()}
            >
              Valider
            </Button>
            <div className='fr-pl-3w'>
              <Button
                label='Annuler l’ajout de l’acteur'
                buttonStyle='tertiary'
                onClick={() => onReset()}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {sortActorsByAplc.map((actor, idx) => (
        <ActeurCard
          key={actor.siren}
          handleActors={handleActors}
          roles={ROLES}
          handleEdition={() => setUpdatingActorIndex(idx)}
          handleDelete={() => onDelete(actor.siren)}
          {...actor}
        />
      ))}

      <style jsx>{`
        .separator {
          border-top: 3px solid ${colors.grey850};
        }

        .etablissement {
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

Acteurs.propTypes = {
  acteurs: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handleActors: PropTypes.func.isRequired
}

Acteurs.defaultProps = {
  hasMissingData: false
}

export default Acteurs

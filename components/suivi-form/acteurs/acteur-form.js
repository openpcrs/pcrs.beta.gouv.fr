/* eslint-disable camelcase */
import {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce, pick} from 'lodash-es'

import {getEntreprises} from '@/lib/entreprises-api.js'

import colors from '@/styles/colors.js'

import {secteursActivites} from '@/components/suivi-form/acteurs/utils/actor-activites.js'

import AutocompleteInput from '@/components/autocomplete-input.js'
import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import NumberInput from '@/components/number-input.js'
import Button from '@/components/button.js'

const renderItem = (item, isHighlighted) => {
  const {nom_complet, section_activite_principale, siren} = item

  return (
    <div key={siren} className='item fr-px-1w fr-py-2w'>
      {nom_complet} - <span className='ape'>{secteursActivites[section_activite_principale]}</span>

      <style jsx>{`
        .item {
          background: ${isHighlighted ? colors.blueHover : 'white'};
          color: ${isHighlighted ? 'white' : colors.darkgrey};
        }

        .ape {
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

const ActeurForm = ({acteurs, roles, updatingActorIndex, isEditing, handleActorIndex, handleActors, handleAdding, handleEditing, onRequiredFormOpen}) => {
  const [acteur, setActeur] = useState({
    nom: '',
    siren: '',
    phone: '',
    finPerc: '',
    finEuros: '',
    role: ''
  })

  const [foundEtablissements, setFoundEtablissements] = useState([])
  const [updatingActorSiren, setUpdatingActorSiren] = useState(null)

  const [hasMissingInput, setHasMissingInput] = useState(false)
  const [hasInvalidInput, setHasInvalidInput] = useState(false)
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true)
  const [isSirenValid, setIsSirenValid] = useState(true)
  const [isFormComplete, setIsFormComplete] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [searchErrorMessage, setSearchErrorMessage] = useState(null)

  const {nom, siren, phone, finPerc, finEuros, role} = acteur

  const onAdd = () => {
    if ((finPerc && finPerc < 0) || (finEuros && finEuros < 0)) {
      return setErrorMessage('Veuillez entrer des valeurs supérieurs à 0 dans les champs de financement')
    }

    if (isFormComplete) {
      if (isSirenValid) {
        if (acteurs.some(acteur => siren === acteur.siren.toString())) {
          setErrorMessage('Cet acteur est déjà présent.')
        } else {
          const newActor = {
            nom,
            siren: Number(siren),
            role,
            telephone: phone || null,
            finance_part_perc: Number(finPerc) || null,
            finance_part_euro: Number(finEuros) || null
          }

          handleActors([...acteurs, newActor])
          onReset()
        }
      } else {
        setHasInvalidInput(true)
      }
    } else {
      setHasMissingInput(true)
    }
  }

  const onUpdate = () => {
    if (finPerc < 0 || finEuros < 0) {
      return setErrorMessage('Veuillez entrer des valeurs supérieurs à 0 dans les champs de financement')
    }

    if (isFormComplete) {
      if (isSirenValid) {
        if (acteurs.some(a => siren === a.siren.toString()) && siren !== updatingActorSiren.toString()) {
          setErrorMessage('Cet acteur est déjà présent.')
        } else {
          const newActor = {
            nom,
            siren: Number(siren),
            role,
            telephone: phone || null,
            finance_part_perc: Number(finPerc) || null,
            finance_part_euro: Number(finEuros) || null
          }

          handleActors([...acteurs].map((a, i) => {
            if (i === updatingActorIndex) {
              a = newActor
            }

            return a
          }))

          onReset()
        }
      } else {
        setHasInvalidInput(true)
      }
    } else {
      setHasMissingInput(true)
    }
  }

  const onReset = useCallback(() => {
    handleAdding(false)
    onRequiredFormOpen(false)
    setHasInvalidInput(false)
    setActeur({
      nom: '',
      siren: '',
      phone: '',
      finPerc: '',
      finEuros: '',
      role: ''
    })
    handleActorIndex(null)
    handleEditing(false)
    setErrorMessage(null)
    setUpdatingActorSiren(null)
    setHasMissingInput(false)
    setSearchErrorMessage(null)
    setIsFormComplete(true)
  }, [handleAdding, handleActorIndex, handleEditing, onRequiredFormOpen])

  const handleErrors = (input, name) => {
    if (!input && hasMissingInput && name !== 'phone' && !input) {
      return 'Ce champs est requis'
    }

    if (name === 'siren' && !isSirenValid) {
      return 'Le SIREN doit être composé de 9 chiffres'
    }

    if (input && !isPhoneNumberValid && name === 'phone') {
      return 'Le numéro de téléphone doit être composé de 10 chiffres ou de 9 chiffres précédés du préfixe +33'
    }
  }

  useEffect(() => {
    // Enable aplc/porteur selector choices for editing aplc/porteur actor...
    if (acteur.role === 'aplc' || acteur.role === 'porteur') {
      roles.find(role => role.value === 'porteur').isDisabled = false
      roles.find(role => role.value === 'aplc').isDisabled = false
    } else {
      const hasAplc = acteurs.some(actor => actor.role === 'aplc' || actor.role === 'porteur')

      // ... disable aplc/porteur selector choices when actor with this role already exist
      roles.find(role => role.value === 'aplc').isDisabled = Boolean(hasAplc)
      roles.find(role => role.value === 'porteur').isDisabled = Boolean(hasAplc)
    }
  }, [acteur, roles, acteurs])

  useEffect(() => {
    // Switch to actor update form
    if (isEditing) {
      const foundActor = acteurs[updatingActorIndex]
      setActeur(
        {
          nom: foundActor.nom,
          siren: foundActor.siren?.toString(),
          phone: foundActor.telephone || '',
          finPerc: foundActor.finance_part_perc?.toString() || '',
          finEuros: foundActor.finance_part_euro?.toString() || '',
          role: foundActor.role || ''
        }
      )
      setUpdatingActorSiren(foundActor.siren)
      onRequiredFormOpen(true)
    }
  }, [isEditing, updatingActorIndex, acteurs, onRequiredFormOpen])

  const fetchActors = useCallback(debounce(async (nom, signal) => { // eslint-disable-line react-hooks/exhaustive-deps
    setIsLoading(true)
    setSearchErrorMessage(null)

    try {
      const foundActors = await getEntreprises(nom, {signal})
      const firstResults = foundActors.results.slice(0, 5)

      const sanitizedResults = firstResults.map(result => pick(result, ['nom_complet', 'siren', 'section_activite_principale', 'tranche_effectif_salarie']))

      setFoundEtablissements(sanitizedResults)
    } catch {
      if (!signal.aborted) {
        setSearchErrorMessage('Aucun acteur n’a été trouvé')
        setFoundEtablissements([])
      }
    }

    setIsLoading(false)
  }, 300), [setIsLoading, setFoundEtablissements])

  useEffect(() => {
    if (!nom || nom.length < 3) {
      setSearchErrorMessage(null)
      return
    }

    const ac = new AbortController()
    fetchActors(nom, ac.signal)

    return () => {
      ac.abort()
    }
  }, [nom, fetchActors, setSearchErrorMessage])

  useEffect(() => {
    if (updatingActorIndex || updatingActorIndex === 0) {
      handleEditing(true)
    }
  }, [updatingActorIndex, handleEditing])

  useEffect(() => {
    if (nom && role && !hasInvalidInput && (!phone || isPhoneNumberValid)) {
      setIsFormComplete(true)
    } else {
      setIsFormComplete(false)
    }
  }, [nom, role, hasInvalidInput, phone, isPhoneNumberValid])

  useEffect(() => {
    if (phone) {
      if (/^(?:\+33|0)[1-9](?:\d{8}|\d{9})$/.test(phone)) {
        setIsPhoneNumberValid(true)
      } else {
        setIsPhoneNumberValid(false)
      }
    }
  }, [phone])

  return (
    <div className='fr-mt-4w'>
      <div className='fr-grid-row '>
        <div className='fr-col-12 fr-col-md-6'>
          <AutocompleteInput
            isRequired
            label='Nom'
            value={nom}
            name='nom'
            description='Nom de l’entreprise'
            ariaLabel='nom de l’entreprise à rechercher'
            results={foundEtablissements}
            isLoading={isLoading}
            errorMessage={searchErrorMessage ? searchErrorMessage : handleErrors(nom)}
            getItemValue={item => item.siren}
            customItem={renderItem}
            onValueChange={e => {
              setActeur({
                ...acteur,
                nom: e.target.value
              })
            }}
            onSelectValue={item => {
              const foundActorName = foundEtablissements.find(result => result.siren === item).nom_complet

              setActeur({
                ...acteur,
                nom: foundActorName,
                siren: item
              })
            }}
          />
        </div>
        <div className='fr-col-12 fr-col-md-6 fr-pl-md-3w'>
          <TextInput
            isRequired
            label='SIREN'
            value={siren}
            ariaLabel='numéro siren de l’entreprise'
            description='SIREN de l’entreprise'
            errorMessage={handleErrors(siren, 'siren')}
            onValueChange={e => {
              setActeur({
                ...acteur,
                siren: e.target.value
              })
              setIsSirenValid(/^\d{9}$/.test(e.target.value))
            }}
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
            errorMessage={handleErrors(phone, 'phone')}
            onValueChange={e => {
              setActeur({
                ...acteur,
                phone: e.target.value
              })
            }}
          />
        </div>
        <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
          <SelectInput
            isRequired
            label='Rôle'
            options={roles}
            value={role}
            description='Rôle de l’acteur dans le projet'
            ariaLabel='rôle de l’acteur dans le projet'
            errorMessage={handleErrors(role)}
            onValueChange={e => {
              setActeur({
                ...acteur,
                role: e.target.value
              })
            }}
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
            onIsInvalid={setHasInvalidInput}
            onValueChange={e => {
              setActeur({
                ...acteur,
                finPerc: e.target.value
              })
            }}
          />
        </div>
        <div className='fr-col-12 fr-col-md-6 fr-mt-6w fr-pl-md-3w'>
          <NumberInput
            label='Montant du financement'
            value={finEuros}
            placeholder='Veuillez n’entrer que des valeurs numéraires'
            description='Montant du financement en euros'
            ariaLabel='montant du financement'
            min={0}
            onIsInvalid={setHasInvalidInput}
            onValueChange={e => {
              setActeur({
                ...acteur,
                finEuros: e.target.value
              })
            }}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-mt-3w'>
        <Button
          label='Valider l’ajout de l’acteur'
          icon='checkbox-circle-fill'
          onClick={() => isEditing ? onUpdate() : onAdd()}
        >
          Valider
        </Button>
        <div className='fr-pl-3w'>
          <Button
            label='Annuler l’ajout de l’acteur'
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

ActeurForm.propTypes = {
  acteurs: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  updatingActorIndex: PropTypes.number,
  handleActorIndex: PropTypes.func.isRequired,
  handleActors: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  handleAdding: PropTypes.func.isRequired,
  handleEditing: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired
}

ActeurForm.defaultProps = {
  updatingActorIndex: null
}

export default ActeurForm

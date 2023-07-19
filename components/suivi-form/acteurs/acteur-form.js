/* eslint-disable camelcase */
import {useState, useCallback, useEffect, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import {debounce, pick} from 'lodash-es'

import {checkIsPhoneValid, checkIsEmailValid, checkIsSirenValid} from '@/components/suivi-form/acteurs/utils/error-handlers.js'
import {getEntreprises} from '@/lib/entreprises-api.js'

import {secteursActivites} from '@/components/suivi-form/acteurs/utils/actor-activites.js'
import {roleOptions} from '@/components/suivi-form/acteurs/utils/select-options.js'

import {useInput} from '@/hooks/input.js'

import AutocompleteInput from '@/components/autocomplete-input.js'
import AutocompleteRenderItem from '@/components/autocomplete-render-item.js'
import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'
import Button from '@/components/button.js'
import NumberInput from '@/components/number-input.js'

const renderItem = (item, isHighlighted) => {
  const {nom_complet, section_activite_principale, siren} = item

  return (
    <div key={siren}>
      <AutocompleteRenderItem isHighlighted={isHighlighted}>
        {nom_complet} - <span className='ape'>{secteursActivites[section_activite_principale]}</span>
      </AutocompleteRenderItem>

      <style jsx>{`
        .ape {
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

const ActeurForm = ({acteurs, updatingActorIndex, isEditing, handleActorIndex, handleActors, handleAdding, handleEditing, onRequiredFormOpen}) => {
  const [isFormComplete, setIsFormComplete] = useState(true)
  const [isFormValid, setIsFormValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [searchErrorMessage, setSearchErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [foundEtablissements, setFoundEtablissements] = useState([])
  const [updatingActorSiren, setUpdatingActorSiren] = useState(null)

  // Phone number conformity error handler
  const handlePhoneError = useCallback(input => {
    if (!checkIsPhoneValid(input) && !isFormValid) {
      return 'Le numéro de téléphone doit être composé de 10 chiffres ou de 9 chiffres précédés du préfixe +33'
    }
  }, [isFormValid])

  // Mail conformity error handler
  const handleMailError = useCallback(input => {
    if (!checkIsEmailValid(input) && !isFormValid) {
      return 'L’adresse mail entrée est invalide. Exemple : dupont@domaine.fr'
    }
  }, [isFormValid])

  // Siren conformity error handler
  const handleSirenError = useCallback(input => {
    if (!checkIsSirenValid(input) && !isFormValid) {
      return 'Le SIREN doit être composé de 9 chiffres'
    }
  }, [isFormValid])

  const [nom, setNom, nomError] = useInput({isRequired: !isFormComplete})
  const [siren, setSiren, sirenError] = useInput({checkValue: handleSirenError, isRequired: !isFormComplete})
  const [phone, setPhone, phoneError] = useInput({checkValue: handlePhoneError})
  const [mail, setMail, mailError] = useInput({checkValue: handleMailError})
  const [finPerc, setFinPerc, finPercError, handleFinPercValidity, isFinPercInputValid] = useInput({})
  const [finEuros, setFinEuros, finEurosError, handleFinEurosValidity, isFinEurosInputValid] = useInput({})
  const [role, setRole, roleError] = useInput({isRequired: !isFormComplete})

  const isCompleteOnSubmit = Boolean(nom && siren && role)
  const isValidOnSubmit = useMemo(() => {
    if (checkIsSirenValid(siren) && checkIsPhoneValid(phone) && checkIsEmailValid(mail) && isFinPercInputValid && isFinEurosInputValid) {
      return true
    }

    return false
  }, [siren, phone, mail, isFinPercInputValid, isFinEurosInputValid])

  useEffect(() => {
    if (isCompleteOnSubmit && isValidOnSubmit) {
      setErrorMessage(null)
    }
  }, [isCompleteOnSubmit, isValidOnSubmit])

  const isActorExisting = useMemo(() => {
    if (isEditing) {
      return acteurs.some(a => siren === a.siren.toString()) && siren !== updatingActorSiren.toString()
    }

    return acteurs.some(acteur => siren === acteur.siren.toString())
  }, [acteurs, siren, isEditing, updatingActorSiren])

  const handleSubmit = () => {
    setErrorMessage(null)
    setIsFormValid(true)

    if (isCompleteOnSubmit) {
      if (isValidOnSubmit) {
        if (isActorExisting) {
          setErrorMessage('Cet acteur est déjà présent.')
        } else {
          const newActor = {
            nom,
            siren: Number(siren),
            role,
            mail: mail || null,
            telephone: phone || null,
            finance_part_perc: Number(finPerc) || null,
            finance_part_euro: Number(finEuros) || null
          }

          if (isEditing) {
            handleActors(prevActeurs => {
              const acteursCopy = [...prevActeurs]
              acteursCopy[updatingActorIndex] = newActor
              return acteursCopy
            })
          } else {
            handleActors([...acteurs, newActor])
          }

          onReset()
        }
      } else {
        setErrorMessage('Veuillez modifier les champs invalides')
        setIsFormValid(false)
      }
    } else {
      setIsFormComplete(false)
      setIsFormValid(false)
      setErrorMessage('Veuillez compléter les champs requis manquants')
    }
  }

  const onReset = useCallback(() => {
    handleAdding(false)
    onRequiredFormOpen(false)
    setIsFormValid(true)
    setIsFormComplete(true)
    handleActorIndex(null)
    handleEditing(false)
    setErrorMessage(null)
    setUpdatingActorSiren(null)
    setSearchErrorMessage(null)

    setNom('')
    setSiren('')
    setPhone('')
    setMail('')
    setFinPerc('')
    setFinEuros('')
    setRole('')
  }, [
    handleAdding,
    handleActorIndex,
    handleEditing,
    onRequiredFormOpen,
    setFinEuros,
    setSiren,
    setPhone,
    setMail,
    setFinPerc,
    setRole,
    setNom
  ])

  useEffect(() => {
    // Enable aplc/porteur selector choices for editing aplc/porteur actor...
    if (role === 'aplc' || role === 'porteur') {
      roleOptions.find(role => role.value === 'porteur').isDisabled = false
      roleOptions.find(role => role.value === 'aplc').isDisabled = false
    } else {
      const hasAplc = acteurs.some(actor => actor.role === 'aplc' || actor.role === 'porteur')

      // ... disable aplc/porteur selector choices when actor with this role already exist
      roleOptions.find(role => role.value === 'aplc').isDisabled = Boolean(hasAplc)
      roleOptions.find(role => role.value === 'porteur').isDisabled = Boolean(hasAplc)
    }
  }, [role, acteurs])

  useEffect(() => {
    // Switch to actor update form
    if (isEditing) {
      const foundActor = acteurs[updatingActorIndex]
      setNom(foundActor.nom)
      setSiren(foundActor.siren?.toString())
      setPhone(foundActor.telephone || '')
      setMail(foundActor.mail || '')
      setFinPerc(foundActor.finance_part_perc?.toString() || '')
      setFinEuros(foundActor.finance_part_euro?.toString() || '')
      setRole(foundActor.role || '')

      setUpdatingActorSiren(foundActor.siren)
      onRequiredFormOpen(true)
    }
  }, [isEditing, updatingActorIndex, acteurs, onRequiredFormOpen, setFinEuros, setSiren, setPhone, setMail, setFinPerc, setRole, setNom])

  const fetchActors = useRef(debounce(async (nom, signal) => {
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
  }, 300))

  useEffect(() => {
    if (!nom || nom.length < 3) {
      setSearchErrorMessage(null)
      return
    }

    const ac = new AbortController()
    fetchActors.current(nom, ac.signal)

    return () => {
      ac.abort()
    }
  }, [nom, fetchActors, setSearchErrorMessage])

  useEffect(() => {
    if (updatingActorIndex || updatingActorIndex === 0) {
      handleEditing(true)
    }
  }, [updatingActorIndex, handleEditing])

  return (
    <div className='fr-mt-4w'>
      <div className='fr-grid-row'>
        <div className='fr-col-12 fr-mt-6w fr-col-md-6'>
          <AutocompleteInput
            isRequired
            label='Nom'
            value={nom}
            name='nom'
            description='Nom de l’entreprise'
            ariaLabel='nom de l’entreprise à rechercher'
            results={foundEtablissements}
            isLoading={isLoading}
            errorMessage={searchErrorMessage ? searchErrorMessage : nomError}
            getItemValue={item => item.siren}
            customItem={renderItem}
            onValueChange={e => setNom(e.target.value)}
            onSelectValue={item => {
              const foundActorName = foundEtablissements.find(result => result.siren === item).nom_complet
              setNom(foundActorName)
              setSiren(item)
            }}
          />
        </div>
        <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
          <TextInput
            isRequired
            label='SIREN'
            value={siren}
            ariaLabel='numéro siren de l’entreprise'
            description='SIREN de l’entreprise'
            errorMessage={sirenError}
            onValueChange={e => setSiren(e.target.value)}
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
            errorMessage={phoneError}
            onValueChange={e => setPhone(e.target.value.replace(/\s/g, ''))} // Delete white space
          />
        </div>

        <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
          <TextInput
            label='Adresse e-mail'
            value={mail}
            type='email'
            ariaLabel='Adresse e-mail de l’interlocuteur'
            description='Adresse e-mail de l’interlocuteur'
            errorMessage={mailError}
            placeholder='exemple@domaine.fr'
            onValueChange={e => setMail(e.target.value)}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-col-12'>
        <div className='fr-col-12 fr-mt-6w fr-col-md-4 fr-pr-md-3w'>
          <SelectInput
            isRequired
            label='Rôle'
            options={roleOptions}
            value={role}
            description='Rôle de l’acteur dans le projet'
            ariaLabel='rôle de l’acteur dans le projet'
            errorMessage={roleError}
            onValueChange={e => setRole(e.target.value)}
          />
        </div>
        <div className='fr-col-12 fr-col-md-4 fr-mt-6w'>
          <NumberInput
            label='Part de financement'
            value={finPerc}
            ariaLabel='Part de financement en pourcentage du total'
            description='Part de financement en pourcentage du total'
            placeholder='Veuillez n’entrer que des valeurs numéraires'
            setIsValueValid={handleFinPercValidity}
            min={0}
            max={100}
            errorMessage={finPercError}
            onValueChange={e => setFinPerc(e.target.value)}
          />
        </div>

        <div className='fr-col-12 fr-col-md-4 fr-mt-6w fr-pl-md-3w'>
          <NumberInput
            label='Montant du financement'
            value={finEuros}
            ariaLabel='montant du financement'
            description='Montant du financement en euros'
            placeholder='Veuillez n’entrer que des valeurs numéraires'
            min={0}
            setIsValueValid={handleFinEurosValidity}
            errorMessage={finEurosError}
            onValueChange={e => setFinEuros(e.target.value)}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-mt-3w'>
        <Button
          label='Valider l’ajout de l’acteur'
          icon='checkbox-circle-fill'
          onClick={handleSubmit}
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

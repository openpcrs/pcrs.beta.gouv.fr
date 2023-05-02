/* eslint-disable camelcase */
import {useState, useCallback, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'
import {debounce, pick} from 'lodash-es'

import {getEntreprises} from '@/lib/entreprises-api.js'

import {secteursActivites} from '@/components/suivi-form/acteurs/utils/actor-activites.js'
import {roleOptions} from '@/components/suivi-form/acteurs/utils/select-options.js'

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
  const [acteur, setActeur] = useState({
    nom: '',
    siren: '',
    phone: '',
    mail: '',
    finPerc: '',
    finEuros: '',
    role: ''
  })

  const [foundEtablissements, setFoundEtablissements] = useState([])
  const [updatingActorSiren, setUpdatingActorSiren] = useState(null)

  const [hasMissingInput, setHasMissingInput] = useState(false)
  const [hasInvalidInput, setHasInvalidInput] = useState(false)
  const [isSirenValid, setIsSirenValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [searchErrorMessage, setSearchErrorMessage] = useState(null)

  const {nom, siren, phone, mail, finPerc, finEuros, role} = acteur

  const isEmailValid = useMemo(() => {
    const emailChecker = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
    if (emailChecker.test(mail) || !mail) {
      return true
    }

    return false
  }, [mail])

  const isPhoneNumberValid = useMemo(() => {
    if (/^(?:\+33|0)[1-9](?:\d{8}|\d{9})$/.test(phone) || !phone) {
      return true
    }

    return false
  }, [phone])

  const isFormComplete = useMemo(() => {
    const isRequiredValueComplete = Boolean(nom && role)
    if (isRequiredValueComplete && !hasInvalidInput && isEmailValid && isPhoneNumberValid) {
      return true
    }

    return false
  }, [hasInvalidInput, isEmailValid, isPhoneNumberValid, nom, role])

  const handleSubmit = () => {
    if ((finPerc && finPerc < 0) || (finEuros && finEuros < 0)) {
      return setErrorMessage('Veuillez entrer des valeurs supérieures à 0 dans les champs de financement')
    }

    if (isFormComplete) {
      if (isSirenValid && isEmailValid && isPhoneNumberValid) {
        const checkIsExisting = () => {
          if (isEditing) {
            return acteurs.some(a => siren === a.siren.toString()) && siren !== updatingActorSiren.toString()
          }

          return acteurs.some(acteur => siren === acteur.siren.toString())
        }

        if (checkIsExisting()) {
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
        setHasInvalidInput(true)
      }
    } else {
      if (!isEmailValid || !isPhoneNumberValid) {
        setHasInvalidInput(true)
      }

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
      mail: '',
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
  }, [handleAdding, handleActorIndex, handleEditing, onRequiredFormOpen])

  const handleErrors = (input, name) => {
    if (!input && hasMissingInput && name !== 'phone' && name !== 'email' && !input) {
      return 'Ce champs est requis'
    }

    if (input && name === 'email' && !isEmailValid && hasInvalidInput) {
      return 'L’adresse mail entrée est invalide'
    }

    if (name === 'siren' && !isSirenValid) {
      return 'Le SIREN doit être composé de 9 chiffres'
    }

    if (input && name === 'phone' && !isPhoneNumberValid && hasInvalidInput) {
      return 'Le numéro de téléphone doit être composé de 10 chiffres ou de 9 chiffres précédés du préfixe +33'
    }
  }

  useEffect(() => {
    // Enable aplc/porteur selector choices for editing aplc/porteur actor...
    if (acteur.role === 'aplc' || acteur.role === 'porteur') {
      roleOptions.find(role => role.value === 'porteur').isDisabled = false
      roleOptions.find(role => role.value === 'aplc').isDisabled = false
    } else {
      const hasAplc = acteurs.some(actor => actor.role === 'aplc' || actor.role === 'porteur')

      // ... disable aplc/porteur selector choices when actor with this role already exist
      roleOptions.find(role => role.value === 'aplc').isDisabled = Boolean(hasAplc)
      roleOptions.find(role => role.value === 'porteur').isDisabled = Boolean(hasAplc)
    }
  }, [acteur, acteurs])

  useEffect(() => {
    // Switch to actor update form
    if (isEditing) {
      const foundActor = acteurs[updatingActorIndex]
      setActeur(
        {
          nom: foundActor.nom,
          siren: foundActor.siren?.toString(),
          phone: foundActor.telephone || '',
          mail: foundActor.mail || '',
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
        <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
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
              setHasInvalidInput(false)
              setActeur({
                ...acteur,
                phone: e.target.value
              })
            }}
          />
        </div>

        <div className='fr-col-12 fr-mt-6w fr-col-md-6 fr-pl-md-3w'>
          <TextInput
            label='Adresse e-mail'
            value={mail}
            type='email'
            ariaLabel='Adresse e-mail de l’interlocuteur'
            description='Adresse e-mail de l’interlocuteur'
            errorMessage={handleErrors(mail, 'email')}
            placeholder='exemple@domaine.fr'
            onValueChange={e => {
              setHasInvalidInput(false)
              setActeur({
                ...acteur,
                mail: e.target.value
              })
            }}
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
            errorMessage={handleErrors(role)}
            onValueChange={e => {
              setActeur({
                ...acteur,
                role: e.target.value
              })
            }}
          />
        </div>
        <div className='fr-col-12 fr-col-md-4 fr-mt-6w'>
          <NumberInput
            label='Part de financement'
            value={finPerc}
            ariaLabel='Part de financement en pourcentage du total'
            description='Part de financement en pourcentage du total'
            placeholder='Veuillez n’entrer que des valeurs numéraires'
            min={0}
            max={100}
            handleInvalidInput={setHasInvalidInput}
            onValueChange={e => {
              setActeur({
                ...acteur,
                finPerc: e.target.value
              })
            }}
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
            handleInvalidInput={setHasInvalidInput}
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

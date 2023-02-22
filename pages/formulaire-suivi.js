
import {useState} from 'react'
import Image from 'next/image'

import {postSuivi} from '@/lib/suivi-pcrs.js'
import {dateToUtc} from '@/lib/date-utils.js'

import Page from '@/layouts/main.js'

import GeneralInfos from '@/components/suivi-form/general-infos.js'
import Livrables from '@/components/suivi-form/livrables/index.js'
import Acteurs from '@/components/suivi-form/acteurs/index.js'
import Perimetres from '@/components/suivi-form/perimetres/index.js'
import Etapes from '@/components/suivi-form/etapes.js'
import Button from '@/components/button.js'

const FormulaireSuivi = () => {
  const [hasMissingDataOnValidation, setHasMissingDataOnValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorOnValidationMessage, setErrorOnValidationMessage] = useState(null)

  const [nom, setNom] = useState('')
  const [nature, setNature] = useState('')
  const [regime, setRegime] = useState('')
  const [livrables, setLivrables] = useState([])
  const [acteurs, setActeurs] = useState([])
  const [perimetres, setPerimetres] = useState([])
  const [etapes, setEtapes] = useState([{statut: 'investigation', date_debut: ''}]) // eslint-disable-line camelcase

  const handleSubmit = event => {
    event.preventDefault()

    const hasMissingData = livrables.length === 0 || acteurs.length === 0 || perimetres.length === 0

    setValidationMessage(null)
    setErrorOnValidationMessage(null)
    setHasMissingDataOnValidation(false)

    try {
      if (hasMissingData) {
        setHasMissingDataOnValidation(true)
        setErrorOnValidationMessage('Veuillez ajouter les données manquantes')
      } else {
        const etapesWithSanitizedDates = etapes.map(etape => ({...etape, date_debut: dateToUtc(etape.date_debut)})) // eslint-disable-line camelcase

        const suivi = {
          nom,
          regime,
          nature,
          livrables,
          acteurs,
          perimetres,
          etapes: etapesWithSanitizedDates
        }
        postSuivi(suivi)
        setValidationMessage('Le suivi a correctement été envoyé !')
      }
    } catch {
      console.log('L’envoi du suivi du PCRS a échoué')
    }
  }

  return (
    <Page>
      <div className='form-header fr-my-5w'>
        <Image
          src='/images/illustrations/form_illustration.png'
          height={200}
          width={200}
          alt=''
          aria-hidden='true'
        />
        <h2 className='fr-mt-5w fr-mb-0'>Formulaire de suivi PCRS</h2>
      </div>

      <form className='fr-my-5w fr-p-5w' onSubmit={handleSubmit}>
        <p className='required-disclaimer'>Les champs indiqués par une * sont obligatoires</p>

        <GeneralInfos
          inputValues={{nom, nature, regime}}
          handleName={setNom}
          handleRegime={setRegime}
          handleNature={setNature}
        />

        <Livrables
          livrables={livrables}
          handleLivrables={setLivrables}
          hasMissingData={hasMissingDataOnValidation}
        />

        <Acteurs
          acteurs={acteurs}
          handleActors={setActeurs}
          hasMissingData={hasMissingDataOnValidation}
        />

        <Perimetres
          perimetres={perimetres}
          handlePerimetres={setPerimetres}
          hasMissingData={hasMissingDataOnValidation}
        />

        <Etapes etapes={etapes} handleEtapes={setEtapes} />

        <div className='fr-grid-row fr-grid-row--center fr-mt-5w'>
          <div className='fr-grid-row fr-grid-row--center fr-col-12'>
            <Button
              label='Valider le formulaire'
              icon='checkbox-circle-fill'
              iconSide='right'
              type='submit'
              size='lg'
            >
              Valider le formulaire
            </Button>
          </div>

          {validationMessage && (
            <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-0'>
              {validationMessage}
            </p>
          )}

          {hasMissingDataOnValidation && (
            <p className='fr-grid-row fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
              {errorOnValidationMessage}
            </p>
          )}
        </div>
      </form>

      <style jsx>{`
        .form-header {
          text-align: center;
        }

        .required-disclaimer {
          font-style: italic;
        }
     `}</style>
    </Page>
  )
}

export default FormulaireSuivi

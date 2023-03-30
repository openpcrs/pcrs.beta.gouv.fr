import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {useRouter} from 'next/router'

import {getProject, editProject} from '@/lib/suivi-pcrs.js'

import Page from '@/layouts/main.js'

import GeneralInfos from '@/components/suivi-form/general-infos.js'
import Livrables from '@/components/suivi-form/livrables/index.js'
import Acteurs from '@/components/suivi-form/acteurs/index.js'
import Perimetres from '@/components/suivi-form/perimetres/index.js'
import Etapes from '@/components/suivi-form/etapes.js'
import Subventions from '@/components/suivi-form/subventions/index.js'
import Button from '@/components/button.js'
import AuthentificationModal from '@/components/suivi-form/authentification-modal.js'

const EditProject = ({project}) => {
  const router = useRouter()
  const {_id, nom, nature, regime, livrables, subventions, perimetres, etapes, acteurs} = project

  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)
  const [hasMissingDataOnValidation, setHasMissingDataOnValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorOnValidationMessage, setErrorOnValidationMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [generalInfos, setGeneralInfos] = useState({
    nom: nom || '',
    nature: nature || '',
    regime: regime || ''
  })
  const [editedLivrables, setEditedLivrables] = useState(livrables)
  const [editedActeurs, setEditedActeurs] = useState(acteurs)
  const [editedPerimetres, setEditedPerimetres] = useState(perimetres)
  const [editedEtapes, setEditedEtapes] = useState(etapes || [{statut: 'investigation', date_debut: ''}]) // eslint-disable-line camelcase
  const [editedSubventions, setEditedSubventions] = useState(subventions || [])
  const [token, setToken] = useState(null)

  useEffect(() => {
    setToken(localStorage.getItem('Token'))
    setIsLoading(false)
  }, [])

  const handleModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)

  const handleSubmit = async event => {
    event.preventDefault()

    const hasMissingData = editedLivrables.length === 0 || editedActeurs.length === 0 || editedPerimetres.length === 0
    const {nom, nature, regime} = generalInfos

    setValidationMessage(null)
    setErrorOnValidationMessage(null)
    setHasMissingDataOnValidation(false)

    try {
      if (hasMissingData) {
        setHasMissingDataOnValidation(true)
        setErrorOnValidationMessage(['Veuillez ajouter les données manquantes'])
      } else {
        const suivi = {
          nom,
          regime,
          nature,
          livrables: editedLivrables,
          acteurs: editedActeurs,
          perimetres: editedPerimetres,
          etapes: editedEtapes,
          subventions: editedSubventions
        }

        const sendSuivi = await editProject(suivi, _id, token)

        if (sendSuivi.message) {
          if (sendSuivi.message === 'Invalid payload') {
            sendSuivi.message = 'Le projet n’a pas pu être pris en compte car il y a des erreurs'
          }

          setErrorOnValidationMessage(sendSuivi)
        } else {
          setValidationMessage('Le suivi a correctement été envoyé !')
          setTimeout(() => {
            router.push('/suivi-pcrs')
          }, 2000)
        }
      }
    } catch (error) {
      console.log(error)
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
      <div className='fr-p-5w'>
        {!isLoading && !token && <AuthentificationModal handleToken={setToken} handleModal={handleModal} />}

        <p className='required-disclaimer'>Les champs indiqués par une * sont obligatoires</p>

        <form className='fr-p-5w' onSubmit={handleSubmit}>
          <GeneralInfos
            inputValues={generalInfos}
            handleValues={setGeneralInfos}
          />

          <Livrables
            livrables={editedLivrables}
            handleLivrables={setEditedLivrables}
            hasMissingData={hasMissingDataOnValidation}
          />

          <Acteurs
            acteurs={editedActeurs}
            handleActors={setEditedActeurs}
            hasMissingData={hasMissingDataOnValidation}
          />

          <Perimetres
            perimetres={editedPerimetres}
            handlePerimetres={setEditedPerimetres}
            hasMissingData={hasMissingDataOnValidation}
          />

          <Etapes
            etapes={editedEtapes}
            handleEtapes={setEditedEtapes}
            initialValue={etapes[etapes.length - 1]}
          />

          <Subventions subventions={editedSubventions} handleSubventions={setEditedSubventions} />

          <div className='fr-grid-row fr-grid-row--center fr-mt-5w'>
            <div className='fr-grid-row fr-grid-row--center fr-grid-row--middle fr-col-12'>
              <div className='fr-p-2w'>
                <Button
                  label='Valider le formulaire'
                  buttonStyle='tertiary'
                  icon='arrow-go-back-fill'
                  iconSide='left'
                  isDisabled={validationMessage}
                  onClick={() => router.push('/suivi-pcrs')}
                >
                  Annuler et retourner sur la carte
                </Button>
              </div>
              <div className='fr-p-2w'>
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
            </div>

            {validationMessage && (
              <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-mt-2w fr-mb-0'>
                {validationMessage}
              </p>
            )}

            {errorOnValidationMessage && !hasMissingDataOnValidation && (
              <p key={errorOnValidationMessage.message} className='fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
                {errorOnValidationMessage.message}
              </p>
            )}
          </div>
        </form>
      </div>

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

EditProject.getInitialProps = async ({query}) => {
  const {id} = query
  const project = await getProject(id)

  return {
    project
  }
}

EditProject.propTypes = {
  project: PropTypes.object.isRequired
}
export default EditProject


import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {useRouter} from 'next/router'

import {editProject} from '@/lib/suivi-pcrs.js'

import GeneralInfos from '@/components/suivi-form/general-infos.js'
import Livrables from '@/components/suivi-form/livrables/index.js'
import Acteurs from '@/components/suivi-form/acteurs/index.js'
import Perimetres from '@/components/suivi-form/perimetres/index.js'
import Etapes from '@/components/suivi-form/etapes.js'
import Subventions from '@/components/suivi-form/subventions/index.js'
import Button from '@/components/button.js'
import AuthentificationModal from '@/components/suivi-form/authentification-modal.js'

const EditForm = ({project}) => {
  const router = useRouter()

  const {_id, nom, nature, regime, livrables, subventions, perimetres, etapes, acteurs} = project

  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)
  const [hasMissingDataOnValidation, setHasMissingDataOnValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorOnValidationMessages, setErrorOnValidationMessages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequiredFormOpen, setIsRequiredFormOpen] = useState(false)

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

  const handleModalClose = () => {
    setIsAuthentificationModalOpen(!isAuthentificationModalOpen)
    router.push('/suivi-pcrs')
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const hasMissingData = editedLivrables.length === 0 || editedActeurs.length === 0 || editedPerimetres.length === 0
    const {nom, nature, regime} = generalInfos

    setValidationMessage(null)
    setErrorOnValidationMessages(null)
    setHasMissingDataOnValidation(false)

    const handleScrollToError = () => {
      const firstErrorSection = editedLivrables.length === 0 ? 'livrables' : (editedActeurs.length === 0 ? 'acteurs' : 'perimetres')
      const input = document.querySelector(`#${firstErrorSection}`)

      input.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }

    try {
      if (isRequiredFormOpen) {
        return setErrorOnValidationMessages([{message: 'Veuiller valider ou annuler le livrable, l’acteur ou le périmètre en cours d’ajout.'}])
      }

      if (hasMissingData) {
        setHasMissingDataOnValidation(true)
        handleScrollToError()
        setErrorOnValidationMessages([{message: 'Des données nécessaires à la validation du formulaires sont manquantes. Au moins un livrable, un acteur et un périmètre doivent être ajoutés.'}])
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

          setErrorOnValidationMessages(sendSuivi)
        } else {
          setValidationMessage('Le projet a bien été modifié, vous allez maintenant être redirigé vers la carte de suivi')
          setTimeout(() => {
            router.push('/suivi-pcrs')
          }, 2000)
        }
      }
    } catch {
      throw new Error('Une erreur a eu lieu lors de la modification du suivi')
    }
  }

  return (
    <>
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
        {!isLoading && !token && <AuthentificationModal handleToken={setToken} handleModal={handleModalClose} />}

        <p className='required-disclaimer'>Les champs indiqués par une * sont obligatoires</p>

        <form className='fr-p-5w' onSubmit={handleSubmit}>
          <GeneralInfos
            inputValues={generalInfos}
            handleValues={setGeneralInfos}
          />

          <div id='livrables'>
            <Livrables
              livrables={editedLivrables}
              handleLivrables={setEditedLivrables}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='acteurs'>
            <Acteurs
              acteurs={editedActeurs}
              handleActors={setEditedActeurs}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='perimetres'>
            <Perimetres
              perimetres={editedPerimetres}
              handlePerimetres={setEditedPerimetres}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

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
                  isDisabled={Boolean(validationMessage)}
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

            {errorOnValidationMessages && (
              errorOnValidationMessages.map(error => (
                <p key={error.message} className='fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
                  {error.message}
                </p>
              ))
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
    </>
  )
}

EditForm.propTypes = {
  project: PropTypes.object.isRequired
}

export default EditForm

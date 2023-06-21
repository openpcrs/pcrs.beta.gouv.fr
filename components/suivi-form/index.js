import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {uniq, sortBy} from 'lodash'

import {PAYLOAD_ERRORS} from './utils/payload-errors.js'

import {postSuivi, editProject} from '@/lib/suivi-pcrs.js'

import {useInput} from '@/hooks/input.js'

import AuthentificationModal from '@/components/suivi-form/authentification/authentification-modal.js'
import GeneralInfos from '@/components/suivi-form/general-infos.js'
import Livrables from '@/components/suivi-form/livrables/index.js'
import Acteurs from '@/components/suivi-form/acteurs/index.js'
import Perimetres from '@/components/suivi-form/perimetres/index.js'
import Etapes from '@/components/suivi-form/etapes.js'
import Subventions from '@/components/suivi-form/subventions/index.js'
import ShareModal from '@/components/suivi-form/share-modal.js'
import DeleteModal from '@/components/suivi-form/delete-modal.js'
import Button from '@/components/button.js'
import colors from '@/styles/colors.js'

const SuiviForm = ({nom, nature, regime, livrables, acteurs, perimetres, subventions, etapes, _id, token, userRole, projectEditCode, isTokenRecovering}) => {
  const router = useRouter()

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [hasMissingItemsOnValidation, setHasMissingItemsOnValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errors, setErrors] = useState([])
  const [isRequiredFormOpen, setIsRequiredFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [editedProjectId, setEditedProjectId] = useState(null)
  const [editCode, setEditCode] = useState(projectEditCode)

  const [suiviNom, setSuiviNom] = useInput({initialValue: nom})
  const [suiviNature, setSuiviNature] = useInput({initialValue: nature})
  const [suiviRegime, setSuiviRegime] = useInput({initialValue: regime})

  const [projetLivrables, setProjetLivrables] = useState(livrables)
  const [projetActeurs, setProjetActeurs] = useState(acteurs)
  const [projetPerimetres, setProjetPerimetres] = useState(perimetres)
  const [projetEtapes, setProjetEtapes] = useState(etapes)
  const [projetSubventions, setProjetSubventions] = useState(subventions || [])

  const hasMissingData = projetLivrables.length === 0 || projetActeurs.length === 0 || projetPerimetres.length === 0
  const handleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen)

  useEffect(() => {
    if (!hasMissingData && !isRequiredFormOpen) {
      setErrorMessage(null)
    }
  }, [hasMissingData, isRequiredFormOpen])

  const handleAuthentificationModal = () => router.push('/suivi-pcrs')
  const handleModal = () => router.push('/suivi-pcrs')

  const handleSubmit = async event => {
    event.preventDefault()

    setValidationMessage(null)
    setErrorMessage(null)
    setHasMissingItemsOnValidation(false)

    const handleScrollToError = () => {
      const firstErrorSection = projetLivrables.length === 0 ? 'livrables' : (projetActeurs.length === 0 ? 'acteurs' : 'perimetres')
      const input = document.querySelector(`#${firstErrorSection}`)

      input.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }

    try {
      if (isRequiredFormOpen) {
        return setErrorMessage('Veuiller valider ou annuler le livrable, l’acteur ou le périmètre en cours d’ajout.')
      }

      if (hasMissingData) {
        setHasMissingItemsOnValidation(true)
        handleScrollToError()
        setErrorMessage('Des données nécessaires à la validation du formulaires sont manquantes. Au moins un livrable, un acteur et un périmètre doivent être ajoutés.')
      } else {
        const suivi = {
          nom: suiviNom,
          regime: suiviRegime,
          nature: suiviNature,
          livrables: projetLivrables,
          acteurs: projetActeurs,
          perimetres: projetPerimetres,
          etapes: projetEtapes,
          subventions: projetSubventions
        }

        const authorisationCode = editCode || token
        const sendSuivi = _id ? await editProject(suivi, _id, authorisationCode) : await postSuivi(suivi, token)

        setEditedProjectId(sendSuivi._id)
        setEditCode(sendSuivi.editorKey)

        if (sendSuivi.message) {
          if (sendSuivi.message === 'Invalid payload') {
            const payloadErrors = []
            sendSuivi.message = ('Le projet n’a pas pu être pris en compte car il y a des erreurs :')

            const sortedErrors = sortBy(sendSuivi.validationErrors, error => error.context.key)
            sortedErrors.map(error => {
              let message
              if (PAYLOAD_ERRORS[error.context.key]) {
                message = `Section ${error.path[0]} - ${PAYLOAD_ERRORS[error.context.key]} ${error.context.value ? `: ${error.context.value}` : ''}`
              }

              return payloadErrors.push(message)
            })

            setErrors(uniq(payloadErrors))
          }

          setErrorMessage(sendSuivi.message)
        } else {
          const validation = _id ? 'Le projet a bien été modifié, vous allez maintenant être redirigé vers la carte de suivi' : 'Le projet a bien été créé, vous allez maintenant être redirigé vers la carte de suivi'
          setValidationMessage(validation)

          if (userRole === 'admin' || _id) {
            setTimeout(() => {
              router.push('/suivi-pcrs')
            }, 3000)
          } else {
            setIsShareModalOpen(true)
          }
        }
      }
    } catch {
      const errorMessage = _id ? 'Une erreur a eu lieu lors de la modification du suivi' : 'Une erreur a eu lieu lors de la création du suivi'

      setErrorMessage(errorMessage)
      throw new Error(errorMessage)
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
        {(!token && !isTokenRecovering && !editCode) && <AuthentificationModal handleModalClose={handleAuthentificationModal} />}

        <div className='fr-grid-row fr-col-12'>
          <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-10'>
            <Button
              label='Retourner à la carte de suivi'
              iconSide='left'
              buttonStyle='secondary'
              icon='arrow-left-line'
              type='button'
              size='sm'
              onClick={() => router.push('/suivi-pcrs')}
            >
              Retourner à la carte de suivi
            </Button>
          </div>

          {_id && (
            <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-2 fr-mt-3w fr-mt-md-0'>
              <button
                type='button'
                aria-label='Supprimer le projet'
                icon='delete-line'
                className='delete-button'
                onClick={handleDeleteModalOpen}
              >
                <span className='fr-icon-delete-fill fr-icon--sm fr-mr-1w' aria-hidden='true' />Supprimer le projet
              </button>
            </div>
          )}
        </div>

        <p className='required-disclaimer fr-mt-3w'>Les champs indiqués par une * sont obligatoires</p>

        <form className='fr-mt-5w' onSubmit={handleSubmit}>
          <GeneralInfos
            inputValues={{nom: suiviNom, nature: suiviNature, regime: suiviRegime}}
            handleNom={setSuiviNom}
            handleRegime={setSuiviRegime}
            handleNature={setSuiviNature}
          />

          <div id='livrables'>
            <Livrables
              livrables={projetLivrables}
              handleLivrables={setProjetLivrables}
              hasMissingData={hasMissingItemsOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='acteurs'>
            <Acteurs
              acteurs={projetActeurs}
              handleActors={setProjetActeurs}
              hasMissingData={hasMissingItemsOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='perimetres'>
            <Perimetres
              perimetres={projetPerimetres}
              handlePerimetres={setProjetPerimetres}
              hasMissingData={hasMissingItemsOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <Etapes
            etapes={projetEtapes}
            handleEtapes={setProjetEtapes}
            initialValue={projetEtapes[projetEtapes.length - 1]}
          />

          <Subventions subventions={projetSubventions} handleSubventions={setProjetSubventions} />

          <div className='fr-grid-row fr-grid-row--center  fr-grid-row--gutters fr-mt-2w'>
            <div className='fr-grid-row fr-mt-12w fr-col-12'>
              <div className='fr-grid-row fr-col-12'>
                <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-10'>
                  <Button
                    label='Retourner à la carte de suivi'
                    iconSide='left'
                    buttonStyle='secondary'
                    icon='arrow-left-line'
                    type='button'
                    size='sm'
                    onClick={() => router.push('/suivi-pcrs')}
                  >
                    Retourner à la carte de suivi
                  </Button>
                </div>

                {_id && (
                  <div className='fr-grid-row fr-grid-row--left fr-col-12 fr-col-md-2 fr-mt-3w fr-mt-md-0'>
                    <button
                      type='button'
                      aria-label='Supprimer le projet'
                      icon='delete-line'
                      className='delete-button'
                      onClick={handleDeleteModalOpen}
                    >
                      <span className='fr-icon-delete-fill fr-icon--sm fr-mr-1w' aria-hidden='true' />Supprimer le projet
                    </button>
                  </div>
                )}
              </div>

              <div className='fr-grid-row fr-grid-row--center fr-mt-10w fr-col-12'>
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

            {isDeleteModalOpen && (
              <DeleteModal
                nom={nom}
                id={_id}
                token={editCode}
                handleDeleteModalOpen={handleDeleteModalOpen}
              />
            )}

            {validationMessage && (
              <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-col-md-6 fr-mb-0'>
                {validationMessage}
              </p>
            )}

            {errorMessage && (
              <div>
                <p className='fr-grid-row--center fr-error-text fr-text--sm fr-col-12 fr-mt-2w fr-mb-0'>
                  {errorMessage}
                </p>

                <ul>
                  {errors.map(error => <li key={error} className='fr-text--sm error-list'>{error}</li>)}
                </ul>
              </div>
            )}
          </div>
        </form>
      </div>

      {isShareModalOpen && userRole !== 'admin' && (
        <ShareModal
          handleModal={handleModal}
          validationMessage={validationMessage}
          projectId={editedProjectId}
          editCode={editCode}
        />
      )}

      <style jsx>{`
        .form-header {
          text-align: center;
        }

        .required-disclaimer {
          font-style: italic;
        }

        .delete-button {
          color: ${colors.redMarianne425};
          font-weight: bold;
          border: 1px solid ${colors.redMarianne425};
        }

        .error-list {
          color: ${colors.error425};
          list-style-type: disc;
        }
      `}</style>
    </>
  )
}

SuiviForm.propTypes = {
  userRole: PropTypes.string,
  nom: PropTypes.string,
  nature: PropTypes.string,
  regime: PropTypes.string,
  livrables: PropTypes.array,
  acteurs: PropTypes.array,
  perimetres: PropTypes.array,
  etapes: PropTypes.array,
  subventions: PropTypes.array,
  _id: PropTypes.string,
  token: PropTypes.string,
  projectEditCode: PropTypes.string,
  isTokenRecovering: PropTypes.bool.isRequired
}

SuiviForm.defaultProps = {
  userRole: null,
  nom: '',
  nature: '',
  regime: '',
  livrables: [],
  acteurs: [],
  perimetres: [],
  etapes: [{statut: 'investigation', date_debut: ''}], // eslint-disable-line camelcase
  subventions: [],
  _id: null,
  projectEditCode: null,
  token: null
}

export default SuiviForm

import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {useRouter} from 'next/router'

import {postSuivi, editProject} from '@/lib/suivi-pcrs.js'

import {useInput} from '@/hooks/input.js'

import AuthentificationModal from '@/components/suivi-form/authentification-modal.js'
import GeneralInfos from '@/components/suivi-form/general-infos.js'
import Livrables from '@/components/suivi-form/livrables/index.js'
import Acteurs from '@/components/suivi-form/acteurs/index.js'
import Perimetres from '@/components/suivi-form/perimetres/index.js'
import Etapes from '@/components/suivi-form/etapes.js'
import Subventions from '@/components/suivi-form/subventions/index.js'
import Button from '@/components/button.js'

const SuiviForm = ({nom, nature, regime, livrables, acteurs, perimetres, subventions, etapes, _id}) => {
  const router = useRouter()

  const [hasMissingDataOnValidation, setHasMissingDataOnValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorOnValidationMessage, setErrorOnValidationMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequiredFormOpen, setIsRequiredFormOpen] = useState(false)

  const [suiviNom, setSuiviNom] = useInput({initialValue: nom})
  const [suiviNature, setSuiviNature] = useInput({initialValue: nature})
  const [suiviRegime, setSuiviRegime] = useInput({initialValue: regime})

  const [projetLivrables, setProjetLivrables] = useState(livrables)
  const [projetActeurs, setProjetActeurs] = useState(acteurs)
  const [projetPerimetres, setProjetPerimetres] = useState(perimetres)
  const [projetEtapes, setProjetEtapes] = useState(etapes)
  const [projetSubventions, setProjetSubventions] = useState(subventions || [])
  const [token, setToken] = useState(null)

  const hasMissingData = projetLivrables.length === 0 || projetActeurs.length === 0 || projetPerimetres.length === 0

  useEffect(() => {
    setToken(localStorage.getItem('Token'))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!hasMissingData && !isRequiredFormOpen) {
      setErrorOnValidationMessage(null)
    }
  }, [hasMissingData, isRequiredFormOpen])

  const handleModal = () => router.push('/suivi-pcrs')

  const handleSubmit = async event => {
    event.preventDefault()

    setValidationMessage(null)
    setErrorOnValidationMessage(null)
    setHasMissingDataOnValidation(false)

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
        return setErrorOnValidationMessage('Veuiller valider ou annuler le livrable, l’acteur ou le périmètre en cours d’ajout.')
      }

      if (hasMissingData) {
        setHasMissingDataOnValidation(true)
        handleScrollToError()
        setErrorOnValidationMessage('Des données nécessaires à la validation du formulaires sont manquantes. Au moins un livrable, un acteur et un périmètre doivent être ajoutés.')
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

        const sendSuivi = _id ? await editProject(suivi, _id, token) : await postSuivi(suivi, token)

        if (sendSuivi.message) {
          if (sendSuivi.message === 'Invalid payload') {
            sendSuivi.message = 'Le projet n’a pas pu être pris en compte car il y a des erreurs'
          }

          setErrorOnValidationMessage(sendSuivi.message)
        } else {
          const validation = _id ? 'Le projet a bien été modifié, vous allez maintenant être redirigé vers la carte de suivi' : 'Le projet a bien été créé, vous allez maintenant être redirigé vers la carte de suivi'
          setValidationMessage(validation)
          setTimeout(() => {
            router.push('/suivi-pcrs')
          }, 2000)
        }
      }
    } catch {
      const errorMessage = _id ? 'Une erreur a eu lieu lors de la modification du suivi' : 'Une erreur a eu lieu lors de la création du suivi'

      setErrorOnValidationMessage(errorMessage)
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
        {!isLoading && !token && <AuthentificationModal handleToken={setToken} handleModal={handleModal} />}

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
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='acteurs'>
            <Acteurs
              acteurs={projetActeurs}
              handleActors={setProjetActeurs}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='perimetres'>
            <Perimetres
              perimetres={projetPerimetres}
              handlePerimetres={setProjetPerimetres}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <Etapes
            etapes={projetEtapes}
            handleEtapes={setProjetEtapes}
            initialValue={projetEtapes[projetEtapes.length - 1]}
          />

          <Subventions subventions={projetSubventions} handleSubventions={setProjetSubventions} />

          <div className='fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mt-12w'>
            <div className='fr-grid-row fr-col-12 fr-grid-row--center'>
              <div className='fr-grid-row fr-py-2w fr-px-1w fr-px-md-6w'>
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

              <div className='fr-grid-row fr-py-2w fr-px-1w fr-px-md-6w'>
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
              <p className='fr-grid-row fr-grid-row--center fr-valid-text fr-col-12 fr-col-md-6 fr-mb-0'>
                {validationMessage}
              </p>
            )}

            {errorOnValidationMessage && (
              <p className='fr-grid-row--center fr-error-text fr-col-12 fr-mt-2w fr-mb-0'>
                {errorOnValidationMessage}
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
    </>
  )
}

SuiviForm.propTypes = {
  nom: PropTypes.string,
  nature: PropTypes.string,
  regime: PropTypes.string,
  livrables: PropTypes.array,
  acteurs: PropTypes.array,
  perimetres: PropTypes.array,
  etapes: PropTypes.array,
  subventions: PropTypes.array,
  _id: PropTypes.string

}

SuiviForm.defaultProps = {
  nom: '',
  nature: '',
  regime: '',
  livrables: [],
  acteurs: [],
  perimetres: [],
  etapes: [{statut: 'investigation', date_debut: ''}], // eslint-disable-line camelcase
  subventions: [],
  _id: null
}

export default SuiviForm

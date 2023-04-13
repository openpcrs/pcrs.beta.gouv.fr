import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {useRouter} from 'next/router'

import {postSuivi, editProject} from '@/lib/suivi-pcrs.js'

import AuthentificationModal from '@/components/suivi-form/authentification-modal.js'
import GeneralInfos from '@/components/suivi-form/general-infos.js'
import Livrables from '@/components/suivi-form/livrables/index.js'
import Acteurs from '@/components/suivi-form/acteurs/index.js'
import Perimetres from '@/components/suivi-form/perimetres/index.js'
import Etapes from '@/components/suivi-form/etapes.js'
import Subventions from '@/components/suivi-form/subventions/index.js'
import Button from '@/components/button.js'

const SuiviForm = ({initialProject}) => {
  const router = useRouter()

  const [isAuthentificationModalOpen, setIsAuthentificationModalOpen] = useState(false)
  const [hasMissingDataOnValidation, setHasMissingDataOnValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState(null)
  const [errorOnValidationMessages, setErrorOnValidationMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRequiredFormOpen, setIsRequiredFormOpen] = useState(false)

  const [generalInfos, setGeneralInfos] = useState({
    nom: initialProject?.nom || '',
    nature: initialProject?.nature || '',
    regime: initialProject?.regime || ''
  })

  const [livrables, setLivrables] = useState(initialProject?.livrables || [])
  const [acteurs, setActeurs] = useState(initialProject?.acteurs || [])
  const [perimetres, setPerimetres] = useState(initialProject?.perimetres || [])
  const [etapes, setEtapes] = useState(initialProject?.etapes || [{statut: 'investigation', date_debut: ''}]) // eslint-disable-line camelcase
  const [subventions, setSubventions] = useState(initialProject?.subventions || [])
  const [token, setToken] = useState(null)

  useEffect(() => {
    setToken(localStorage.getItem('Token'))
    setIsLoading(false)
  }, [])

  const handleModal = () => setIsAuthentificationModalOpen(!isAuthentificationModalOpen)

  const handleSubmit = async event => {
    event.preventDefault()

    const hasMissingData = livrables.length === 0 || acteurs.length === 0 || perimetres.length === 0
    const {nom, nature, regime} = generalInfos

    setValidationMessage(null)
    setErrorOnValidationMessages([])
    setHasMissingDataOnValidation(false)

    const handleScrollToError = () => {
      const firstErrorSection = livrables.length === 0 ? 'livrables' : (acteurs.length === 0 ? 'acteurs' : 'perimetres')
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
          livrables,
          acteurs,
          perimetres,
          etapes,
          subventions
        }

        const sendSuivi = initialProject ? await editProject(suivi, initialProject?._id, token) : await postSuivi(suivi, token)

        if (sendSuivi.message) {
          if (sendSuivi.message === 'Invalid payload') {
            sendSuivi.message = 'Le projet n’a pas pu être pris en compte car il y a des erreurs'
          }

          setErrorOnValidationMessages([sendSuivi])
        } else {
          const validation = initialProject ? 'Le projet a bien été modifié, vous allez maintenant être redirigé vers la carte de suivi' : 'Le projet a bien été créé, vous allez maintenant être redirigé vers la carte de suivi'
          setValidationMessage(validation)
          setTimeout(() => {
            router.push('/suivi-pcrs')
          }, 2000)
        }
      }
    } catch {
      throw new Error(initialProject ? 'Une erreur a eu lieu lors de la modification du suivi' : 'Une erreur a eu lieu lors de la création du suivi')
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

        <p className='required-disclaimer'>Les champs indiqués par une * sont obligatoires</p>

        <form className='fr-p-5w' onSubmit={handleSubmit}>
          <GeneralInfos
            inputValues={generalInfos}
            handleValues={setGeneralInfos}
          />

          <div id='livrables'>
            <Livrables
              livrables={livrables}
              handleLivrables={setLivrables}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='acteurs'>
            <Acteurs
              acteurs={acteurs}
              handleActors={setActeurs}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <div id='perimetres'>
            <Perimetres
              perimetres={perimetres}
              handlePerimetres={setPerimetres}
              hasMissingData={hasMissingDataOnValidation}
              onRequiredFormOpen={setIsRequiredFormOpen}
            />
          </div>

          <Etapes
            etapes={etapes}
            handleEtapes={setEtapes}
            initialValue={etapes[etapes.length - 1]}
          />

          <Subventions subventions={subventions} handleSubventions={setSubventions} />

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

            {errorOnValidationMessages.length > 0 && (
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

SuiviForm.propTypes = {
  initialProject: PropTypes.object
}

export default SuiviForm


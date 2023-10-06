import {useContext, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'

import colors from '@/styles/colors.js'

import {getProject} from '@/lib/suivi-pcrs.js'
import AuthentificationContext from '@/contexts/authentification-token.js'

import Page from '@/layouts/main.js'

import Button from '@/components/button.js'
import SuiviForm from '@/components/suivi-form/index.js'
import CenteredSpinner from '@/components/centered-spinner.js'

const FormulaireSuivi = () => {
  const {token, userRole, isTokenRecovering} = useContext(AuthentificationContext)
  const [project, setProject] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const {id, editcode} = router.query

  useEffect(() => {
    async function getProjectData() {
      setIsLoading(true)
      try {
        const project = await getProject(id, editcode)
        setProject(project)
      } catch (error) {
        setErrorMessage(error.message)
      }

      setIsLoading(false)
    }

    if (id) {
      if (!editcode) {
        setErrorMessage('Jeton manquant')
      }

      getProjectData()
    } else {
      setIsLoading(false)
    }
  }, [id, editcode])

  if (errorMessage) {
    return (
      <Page>
        <div className='not-found-wrapper fr-p-5w'>
          <Image
            src='/images/illustrations/403.png'
            height={456}
            width={986}
            alt=''
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto'
            }}
          />

          <div className='not-found-explain fr-pt-8w'>
            <p><b className='fr-mt-3w fr-text--xl'>{errorMessage}</b></p>
            <Button label='Retour à la page d’accueil' href='/'><span className='fr-icon-home-4-line' aria-hidden='true' />&nbsp;Retour au début de la rue</Button>
          </div>
        </div>

        <style jsx>{`
          .not-found-wrapper, h1 {
            text-align: center;
            color: ${colors.darkgrey};
          }
        `}</style>
      </Page>
    )
  }

  return (
    <Page>
      {isLoading ? (
        <CenteredSpinner />
      ) : (
        <SuiviForm
          userRole={userRole}
          token={token}
          projectEditCode={editcode}
          isTokenRecovering={isTokenRecovering}
          {...project}
        />
      )}
    </Page>
  )
}

export default FormulaireSuivi

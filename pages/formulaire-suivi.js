import {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import Image from 'next/image'

import colors from '@/styles/colors.js'

import {getProject} from '@/lib/suivi-pcrs.js'
import AuthentificationContext from '@/contexts/authentification-token.js'

import Page from '@/layouts/main.js'

import Button from '@/components/button.js'
import SuiviForm from '@/components/suivi-form/index.js'
import Loader from '@/components/loader.js'

const FormulaireSuivi = () => {
  const router = useRouter()
  const {token, userRole, isTokenRecovering} = useContext(AuthentificationContext)
  const [project, setProject] = useState()
  const [errorCode, setErrorCode] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const {id, editcode} = router.query

  useEffect(() => {
    async function getProjectData() {
      setIsLoading(true)
      try {
        const project = await getProject(id)
        setProject(project)
      } catch {
        setErrorCode(404)
      }

      setIsLoading(false)
    }

    if (id) {
      if (!editcode) {
        setErrorCode(403)
      }

      getProjectData()
    } else {
      setIsLoading(false)
    }
  }, [id, editcode])

  if (errorCode) {
    return (
      <Page>
        <div className='not-found-wrapper fr-p-5w'>
          <Image
            src={`/images/illustrations/${editcode ? 'pcrs-beta_illustration' : '403'}.png`}
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
            <h1 className='fr-my-1w'>{errorCode}</h1>
            <p><b className='fr-mt-3w'>Vous n’avez pas les droits pour éditer ce projet. Veuillez demander un lien d’édition à un administrateur</b></p>
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
        <div className='loading-container'>
          <Loader />
        </div>
      ) : (
        <SuiviForm
          userRole={userRole}
          token={token}
          projectEditCode={editcode}
          isTokenRecovering={isTokenRecovering}
          {...project}
        />
      )}

      <style jsx>{`
        .loading-container {
          display: flex;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
        `}</style>
    </Page>
  )
}

FormulaireSuivi.propTypes = {
  project: PropTypes.object,
  editCode: PropTypes.string,
  isNotFound: PropTypes.bool,
  isForbidden: PropTypes.bool
}

FormulaireSuivi.defaultProps = {
  editCode: null,
  isNotFound: false,
  isForbidden: false
}

export default FormulaireSuivi

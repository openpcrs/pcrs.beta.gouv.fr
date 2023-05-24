import {useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors.js'

import {getProject} from '@/lib/suivi-pcrs.js'
import AuthentificationContext from '@/contexts/authentification-token.js'

import Page from '@/layouts/main.js'

import Button from '@/components/button.js'
import SuiviForm from '@/components/suivi-form/index.js'

const FormulaireSuivi = ({project, isNotFound, isForbidden, editionCode}) => {
  const {token, userRole, isTokenRecovering, storeToken} = useContext(AuthentificationContext)

  useEffect(() => {
    if (editionCode) {
      storeToken(editionCode)
    }
  }, [storeToken, editionCode])

  if (isNotFound || isForbidden) {
    return (
      <Page>
        <div className='not-found-wrapper fr-p-5w'>
          <Image
            src={`/images/illustrations/${isForbidden ? '403' : 'pcrs-beta_illustration'}.png`}
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
            <h1 className='fr-my-1w'>{isForbidden ? 403 : 404}</h1>
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
      <SuiviForm
        userRole={userRole}
        token={token}
        isTokenRecovering={isTokenRecovering}
        {...project}
      />
    </Page>
  )
}

FormulaireSuivi.getInitialProps = async ({query}) => {
  let project

  if (query.id) {
    project = await getProject(query.id)
    // If the project is not found (code 404), return {isNotFound: true}
    if (!project) {
      return {isNotFound: true}
    }

    if (query.editcode) {
      return {
        project,
        editionCode: query.editcode
      }
    }

    // If edit code is not provided, return {isForbidden: true}
    return {isForbidden: true}
  }

  return {
    project
  }
}

FormulaireSuivi.propTypes = {
  project: PropTypes.object,
  editionCode: PropTypes.string,
  isNotFound: PropTypes.bool,
  isForbidden: PropTypes.bool
}

FormulaireSuivi.defaultProps = {
  editionCode: null,
  isNotFound: false,
  isForbidden: false
}

export default FormulaireSuivi

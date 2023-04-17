import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors.js'

import {getProject} from '@/lib/suivi-pcrs.js'

import Page from '@/layouts/main.js'

import Button from '@/components/button.js'
import SuiviForm from '@/components/suivi-form/index.js'

const FormulaireSuivi = ({project, isNotFound}) => {
  if (isNotFound) {
    return (
      <Page>
        <div className='not-found-wrapper fr-p-5w'>
          <Image
            src='/images/illustrations/pcrs-beta_illustration.png'
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
            <h1 className='fr-my-1w'>404</h1>
            <p><b className='fr-mt-3w'>La page demandée n’a pas pu être trouvée</b></p>
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
      <SuiviForm {...project} />
    </Page>
  )
}

FormulaireSuivi.getInitialProps = async ({query}) => {
  let project

  if (query.id) {
    project = await getProject(query.id)

    if (project.code && project.code === 404) {
      return {isNotFound: true}
    }
  }

  return {
    project
  }
}

FormulaireSuivi.propTypes = {
  project: PropTypes.object,
  isNotFound: PropTypes.bool
}

export default FormulaireSuivi

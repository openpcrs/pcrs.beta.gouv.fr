import Image from 'next/image'

import colors from '@/styles/colors'

import Page from '@/layouts/main'

import Button from '@/components/button'

const Custom404 = () => (
  <Page>
    <div className='not-found-wrapper fr-p-5w'>
      <Image
        src='/images/illustrations/404.png'
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
        <h1 className='fr-m-0'>404</h1>
        <p className='info'>La page demandée n’a pas pu être trouvée</p>
        <Button label='Retour à la page d’accueil' href='/'><span className='fr-icon-home-4-line' aria-hidden='true' />&nbsp;Retour au début de la rue</Button>
      </div>

      <style jsx>{`
        .not-found-wrapper {
          height: 100%;
          text-align: center;
          color: ${colors.darkgrey};
        }

        .not-found-explain h1 {
          text-align: center;
          color: ${colors.darkgrey};
        }

        .info {
          font-weight: bold;
        }
      `}</style>
    </div>
  </Page>
)

export default Custom404

import Image from 'next/image'

import colors from '@/styles/colors'

import Page from '@/layouts/main'

import Button from '@/components/button'

const Custom500 = () => (
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
        <h1 className='fr-my-1w'>500</h1>
        <p><b className='fr-mt-3w'>Cette page est temporairement indisponible</b></p>
        <Button label='Retour à la page d’accueil' href='/'>
          <span className='fr-icon-home-4-line' aria-hidden='true' />&nbsp;Retour au début de la rue
        </Button>
      </div>

      <style jsx>{`
        .not-found-wrapper, h1 {
          text-align: center;
          color: ${colors.darkgrey};
        }
      `}</style>
    </div>
  </Page>
)

export default Custom500

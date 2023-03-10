import Image from 'next/image'
import Link from 'next/link'

import colors from '@/styles/colors.js'

const Hero = () => (
  <div className='hero-component'>
    <div className='hero-title fr-p-4w'>
      <h2>Accompagnement national des projets PCRS</h2>
      <div className='subtitle fr-text fr-text--lg'>Animer et outiller les projets locaux du Plan Corps de Rue Simplifié en cours et à venir</div>
    </div>

    <div className='nav-wrapper fr-mb-3w'>
      <div className='fr-p-2w'>
        <Link
          passHref
          legacyBehavior
          href='/#feuille-de-route'
        >
          <a aria-label='Accéder à la section feuille de route' className='fr-link illustrated-link fr-text--sm'>
            <Image
              height={70}
              width={51}
              src='/images/icons/document.png'
              alt=''
            />
            <span className='fr-pt-2w'>Feuille de route</span>
          </a>
        </Link>
      </div>

      <div className='fr-p-2w'>
        <Link
          passHref
          legacyBehavior
          href='/#contact'
        >
          <a aria-label='Accéder à la section prendre contact' className='fr-link illustrated-link fr-text--sm'>
            <Image
              height={70}
              width={72}
              src='/images/icons/community.png'
              alt=''
            />
            <span className='fr-pt-2w'>Prendre contact</span>
          </a>
        </Link>
      </div>

      <div className='fr-p-2w'>
        <Link
          passHref
          legacyBehavior
          href='/#newsletter'
        >
          <a aria-label='Accéder à la section suivez l’actualité' className='fr-link illustrated-link fr-text--sm'>
            <Image
              height={70}
              width={70}
              src='/images/icons/newsletter.png'
              alt=''
            />
            <span className='fr-pt-2w'>Suivez l’actualité</span>
          </a>
        </Link>
      </div>
    </div>

    <Image
      src='/images/illustrations/banner.webp'
      alt=''
      height={700}
      width={4000}
      aria-hidden='true'
      style={{
        width: '100%',
        height: 'auto',
        marginBottom: '-1em'
      }}
    />

    <style jsx>{`
      .hero-component {
        text-align: center;
        position: relative;
      }

      .subtitle {
         color: ${colors.grey200};
         font-weight: bold;
      }

      .nav-wrapper {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 1em;
      }

      .illustrated-link {
        display: grid;
        grid-template-rows: 1fr auto;
        align-items: center;
        justify-items: center;
      }

      .banner {
        width: 100%;
        margin-bottom: -1em;
      }

      .banner img {
        width: 100%;
      }

      h3 {
        color: white;
      }

      .fr-link--icon-right {
        color: white;
      }
    `}</style>
  </div>
)

export default Hero

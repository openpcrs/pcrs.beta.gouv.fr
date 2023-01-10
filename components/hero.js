import Image from 'next/image'
import Link from 'next/link'

import colors from '@/styles/colors'

const Hero = () => (
  <div className='hero-component'>
    <div className='hero-title'>
      <h2>Accompagnement national des projets PCRS</h2>
      <div className='subtitle fr-text fr-text--lg'>Animer et outiller les projets locaux du Plan Corps de Rue Simplifié en cours et à venir</div>
    </div>

    <div className='nav-wrapper'>
      <Link
        href='/#documentation'
        passHref
        legacyBehavior
      >
        <a aria-label='Accéder à la section documentation' className='fr-link illustrated-link'>
          <Image
            height={100}
            width={100}
            src='/images/icons/book.png'
            alt=''
          />
          Documentation
        </a>
      </Link>
      <Link
        href='/#suivi-geo'
        passHref
        legacyBehavior
      >
        <a aria-label='Accéder à la section suivi géo' className='fr-link illustrated-link'>
          <Image
            height={100}
            width={100}
            src='/images/icons/map.png'
            alt=''
          />
          Suivi géographique
        </a>
      </Link>
      <Link
        href='/#feuille-de-route'
        passHref
        legacyBehavior
      >
        <a aria-label='Accéder à la section feuille de route' className='fr-link illustrated-link'>
          <Image
            height={100}
            width={100}
            src='/images/icons/document.png'
            alt=''
          />
          Feuille de route
        </a>
      </Link>
      <Link
        href='/#evenements'
        passHref
        legacyBehavior
      >
        <a aria-label='Accéder à la section évenements' className='fr-link illustrated-link'>
          <Image
            height={100}
            width={100}
            src='/images/icons/calendar.png'
            alt=''
          />
          Événements
        </a>
      </Link>
      <Link href='/blog' legacyBehavior>
        <a aria-label='Accéder au blog du PCRS' className='fr-link illustrated-link'>
          <Image
            height={100}
            width={100}
            src='/images/icons/blog.png'
            alt=''
          />
          Blog du PCRS
        </a>
      </Link>
      <Link
        href='/#contact'
        passHref
        legacyBehavior
      >
        <a aria-label='Accéder à la section prendre contact' className='fr-link illustrated-link'>
          <Image
            height={100}
            width={100}
            src='/images/icons/community.png'
            alt=''
          />
          Prendre contact
        </a>
      </Link>
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

      .hero-title {
        padding: 2em 5em;
      }

      .subtitle {
         color: ${colors.grey200};
         font-weight: bold;
      }

      .nav-wrapper {
        padding: 2em 5em;
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

      .intro {
        box-sizing: border-box;
        position: absolute;
        background: ${colors.darkgrey};
        color: white;
        padding: 2em 5em;
      }

      .fr-link--icon-right {
        color: white;
      }
  `}</style>
  </div>
)

export default Hero

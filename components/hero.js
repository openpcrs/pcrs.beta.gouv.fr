import Image from 'next/image'
import Link from 'next/link'

import colors from '@/styles/colors'

const Hero = () => (
  <div className='hero-component'>
    <div className='hero-title'>
      <h2>Le suivi national du PCRS</h2>
      <div className='fr-text'>Accompagner et diffuser les projets locaux de PCRS en cours et à venir.</div>
    </div>

    <div className='nav-wrapper'>
      <Link href='/#documentation' passHref legacyBehavior>
        <a aria-label='Accéder à la section documentation' className='fr-link illustrated-link'>
          <Image src='/images/icons/book.png' height={100} width={100} alt='' />Documentation
        </a>
      </Link>
      <Link href='/#suivi-geo' passHref legacyBehavior>
        <a aria-label='Accéder à la section suivi géo' className='fr-link illustrated-link'>
          <Image src='/images/icons/map.png' height={100} width={100} alt='' />Suivi géographique
        </a>
      </Link>
      <Link href='/#feuille-de-route' passHref legacyBehavior>
        <a href='' aria-label='Accéder à la section feuille de route' className='fr-link illustrated-link'>
          <Image src='/images/icons/document.png' height={100} width={100} alt='' />
          Feuille de route
        </a>
      </Link>
      <Link href='/#evenements' passHref legacyBehavior>
        <a href='' aria-label='Accéder à la section évenements' className='fr-link illustrated-link'>
          <Image src='/images/icons/calendar.png' height={100} width={100} alt='' />Événements
        </a>
      </Link>
      <Link href='/#contact' passHref legacyBehavior>
        <a href='' aria-label='Accéder à la section prendre contact' className='fr-link illustrated-link'>
          <Image src='/images/icons/community.png' height={100} width={100} alt='' />Prendre contact
        </a>
      </Link>
    </div>

    <div className='banner'> </div>

    <style jsx>{`
      .hero-component {
        text-align: center;
      }

      .hero-title {
        padding: 2em 5em;
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
        position: absolute;
        left: 0;
        right: 0;
        height: 250px;
        background: bottom / cover no-repeat url("/images/illustrations/banner.png");
        position: relative;
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

Hero.propTypes = {}
export default Hero

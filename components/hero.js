import Link from 'next/link'

import DocumentIcon from '@/components/icons/document-icon'
import MapIcon from '@/components/icons/map-icon'
import BookIcon from '@/components/icons/book-icon'
import CalendarIcon from '@/components/icons/calendar-icon'
import CommunityIcon from '@/components/icons/community-icon'

import colors from '@/styles/colors'

const Hero = () => (
  <div className='hero-component'>
    <div className='hero-title'>
      <h2>Accompagnement national des projets PCRS</h2>
      <div className='subtitle fr-text fr-text--lg'>Accompagner et diffuser les projets locaux de PCRS en cours et à venir.</div>
    </div>

    <div className='nav-wrapper'>
      <Link
        href='/#documentation'
        passHref
        legacyBehavior
      >
        <a aria-label='Accéder à la section documentation' className='fr-link illustrated-link'>
          <BookIcon />Documentation
        </a>
      </Link>
      <Link
        href='/#suivi-geo'
        passHref
        legacyBehavior
      >
        <a aria-label='Accéder à la section suivi géo' className='fr-link illustrated-link'>
          <MapIcon />Suivi géographique
        </a>
      </Link>
      <Link
        href='/#feuille-de-route'
        passHref
        legacyBehavior
      >
        <a href='' aria-label='Accéder à la section feuille de route' className='fr-link illustrated-link'>
          <DocumentIcon />Feuille de route
        </a>
      </Link>
      <Link
        href='/#evenements'
        passHref
        legacyBehavior
      >
        <a href='' aria-label='Accéder à la section évenements' className='fr-link illustrated-link'>
          <CalendarIcon />Événements
        </a>
      </Link>
      <Link
        href='/#contact'
        passHref
        legacyBehavior
      >
        <a href='' aria-label='Accéder à la section prendre contact' className='fr-link illustrated-link'>
          <CommunityIcon />Prendre contact
        </a>
      </Link>
    </div>

    <div className='banner' />

    <style jsx>{`
      .hero-component {
        text-align: center;
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

export default Hero

import PropTypes from 'prop-types'
import Image from 'next/image'

import Page from '@/layouts/main.js'

import colors from '@/styles/colors.js'

import {getPosts} from '@/lib/blog.js'

import Hero from '@/components/hero.js'
import SectionImage from '@/components/section-image.js'
import Section from '@/components/section.js'
import Button from '@/components/button.js'
import Follow from '@/components/follow.js'
import EventCarousel from '@/components/event-carousel.js'
import PostCard from '@/components/post-card.js'

const Home = ({testimonies}) => (
  <Page>
    <EventCarousel />
    <Hero />
    <>
      <p className='intro fr-p-4w fr-p-md-9w fr-text--xl'>
        Vous êtes sur le site construit par et pour les territoires. Il expose les différents projets PCRS en cours, leurs acteurs et résultats produits. C’est le support de l’animation nationale associé à la documentation à produire.
      </p>

      <style jsx>{`
          .intro {
            background: ${colors.darkgrey};
            color: white;
            text-align: center;
          }
        `}</style>
    </>

    <SectionImage
      title='Documentation'
      imageLink='/images/illustrations/doc_illustration.png'
      id='documentation'
    >
      <p>
        Accompagné par l’ANCT, vous avez tous les éléments en main pour mettre au point le PCRS sur votre territoire. Vous pouvez accéder au contexte réglementaire sur <a className='fr-link fr-icon-external-link-line fr-link--icon-right' href=' https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/reglementation'>cette page</a>.
      </p>
      <p>
        Un ensemble de fiches pratiques est disponible en fonction des problématiques que vous pouvez rencontrer, associées à une foire aux questions pour répondre aux interrogations les plus fréquentes.
        Si vous ne trouvez pas le contenu correspondant à vos attentes, n’hésitez pas à nous contacter.
      </p>

      <div className='doc-links'>
        <ul className='doc-list'>
          <li>
            <a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/geostandards'>
              Standards
            </a>
          </li>
          <li>
            <a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/reglementation'>
              Règlementation
            </a>
          </li>
          <li>
            <a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/organiser-son-projet-pcrs/construction'>
              Bonnes pratiques
            </a>
          </li>
        </ul>

        <Button
          isExternal
          href='https://docs.pcrs.beta.gouv.fr/'
          label='Accéder à la documentation'
        >
          Voir la documentation
        </Button>
      </div>

      <style jsx>{`
          p, .doc-links{
            text-align: left;
          }

          .doc-links {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2em;
          }

          .doc-list {
            display: grid;
            justify-content: center;
            gap: 10px;
          }
        `}</style>
    </SectionImage>

    <SectionImage
      title='Feuille de route'
      subtitle='Les étapes suivantes marqueront le développement de ce portail'
      imageLink='/images/illustrations/progress_illustration.png'
      id='feuille-de-route'
    >
      <ul className='fr-text--sm dev-list'>
        <li>
          <span className='fr-icon-git-branch-fill' /> Mise en ligne d’une cartographie des projets et d’un annuaire des APLC complétés de manière collaborative.
        </li>
        <li>
          <span className='fr-icon-git-branch-fill' /> Consolidation de la documentation en continu
        </li>
        <li>
          <span className='fr-icon-git-branch-fill' /> Construction d’un cadre de financement commun
        </li>
        <li>
          <span className='fr-icon-git-branch-fill' /> Mise en valeur des PCRS d’ores et déjà disponibles sous licence ouverte.
        </li>
      </ul>

      <style jsx>{`
          .dev-list {
            text-align: left;
            display: grid;
            justify-content: center;
            gap: 10px;
          }
        `}</style>
    </SectionImage>

    <Section
      title='Événements autour du PCRS'
      background='blue'
      id='evenements'
      style={{
        textAlign: 'center'
      }}
    >
      <Image
        src='/images/illustrations/calendar_illustration.png'
        height={250}
        width={250}
        alt=''
        className='fr-my-5w'
      />
      <div className='fr-p-2w fr-p-lg-4w'>
        <p className='fr-py-1w'>
          Tenez-vous informé des prochains événements organisés par l’ANCT à propos du PCRS. Ateliers, conférences, annonces pour être toujours à jour.
        </p>
        <Button
          isWhite
          href='/evenements'
          buttonStyle='secondary'
          label='Évenement à venir'
        >
          Événements à venir
        </Button>
      </div>
    </Section>

    {testimonies.length > 0 && (
      <Section
        title='Témoignages autour du PCRS'
        background='secondary'
        id='testimonies'
        style={{
          textAlign: 'center'
        }}
      >
        <Image
          src='/images/illustrations/testimony_illustration.png'
          height={250}
          width={250}
          alt=''
          className='fr-my-5w'
        />
        <div className='fr-p-2w fr-p-lg-4w fr-container--fluid'>
          <div className='fr-grid-row fr-grid-row--gutters fr-my-5w'>
            {testimonies.map(testimony => (
              <div key={testimony.id} className='card-container fr-col-12 fr-col-lg'>
                <PostCard isTestimony post={testimony} />
              </div>
            )
            )}
          </div>

          <Button href='/temoignages' label='Lire tous les témoignages'>
            Lire tous les témoignages
          </Button>
        </div>

        <style jsx>{`
            .card-container {
              text-align: start;
            }
          `}</style>
      </Section>
    )}

    <Section
      title='Contactez-nous'
      subtitle='Vous ne trouvez pas les réponses à vos questions sur ce site ou dans la documentation ?'
      id='contact'
      style={{
        textAlign: 'center'
      }}
    >
      <>
        <Image
          src='/images/illustrations/contact_illustration.png'
          height={250}
          width={250}
          alt=''
          className='fr-my-5w'
        />
        <div className='fr-px-2w fr-px-lg-5w'>
          <p className='fr-mb-1w fr-h5' style={{fontWeight: 'bold'}}>
            Vous pouvez nous contacter !
          </p>
        </div>
      </>
      <div className='separator fr-mt-3w fr-mb-5w' />

      <div className='fr-container--fluid'>
        <div className=' fr-grid-row'>
          <div className='communication-system fr-col-12 fr-col-md-6 fr-col-lg-5 fr-p-2w'>
            <h3 className='fr-h6'>En rejoignant notre forum</h3>
            <p>Un lieu d’échange entre <b>porteurs de projets</b>, <b>animateurs</b> et <b>utilisateurs des livrables</b> du PCRS. Venez nous rencontrer pour présenter <b>vos problématiques</b> et vous inspirer d’autres solutions dans les échanges existants</p>
            <Button
              isExternal
              href='https://forum.pcrs.beta.gouv.fr/'
              label='Rejoindre le forum'
            >
              <span className='fr-icon-question-answer-line' aria-hidden='true' />&nbsp;Rejoindre le forum
            </Button>
          </div>

          <div className='fr-col-lg-1 fr-col-xl-2' />

          <div className='communication-system fr-col-12 fr-col-md-6 fr-col-lg-5 fr-mx-auto fr-p-2w'>
            <h3 className='fr-h6'>En nous envoyant un email</h3>
            <p>Notre équipe fera le nécessaire pour vous répondre dans les plus brefs délais, dans la limite de sa disponibilité.</p>
            <Button
              isExternal
              href='mailto:contact@pcrs.beta.gouv.fr'
              label='Contacter l’équipe'
            >
              <span className='fr-icon-mail-line' aria-hidden='true' />&nbsp;Contactez-nous
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
          .separator {
            width: 100%;
            border: solid 1px ${colors.blueFrance925};
          }

          .communication-systems p {
            text-align: left;
          }

          .communication-system {
            min-width: 300px;
            display: grid;
            grid-template-rows: auto 1fr auto;
            justify-items: center;
          }
        `}</style>
    </Section>

    <Section
      title='Suivez l’actualité'
      subtitle='En vous inscrivant à la newsletter ou en nous suivant sur Twitter'
      background='secondary'
      style={{
        textAlign: 'center'
      }}
    >
      <Follow />
    </Section>
  </Page>
)

export async function getServerSideProps({query}) {
  const data = await getPosts({...query, tags: 'temoignage'})
  const lastThreeTestimonies = data?.posts.slice(0, 3)

  return {
    props: {
      testimonies: lastThreeTestimonies || []
    }
  }
}

Home.propTypes = {
  testimonies: PropTypes.array
}

Home.defaultProps = {
  testimonies: []
}

export default Home

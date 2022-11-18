import {useState} from 'react'
import Image from 'next/image'

import Page from '@/layouts/main'

import colors from '@/styles/colors'

import Hero from '@/components/hero'
import SectionImage from '@/components/section-image'
import Button from '@/components/button'
import Follow from '@/components/follow'
import PcrsIframeMap from '@/components/pcrs-iframe-map'

const Home = () => {
  const [isMapShown, setIsMapShown] = useState(false)

  return (
    <Page>
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
        image='/images/illustrations/doc_illustration.png'
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
            href='https://docs.pcrs.beta.gouv.fr/'
            isExternal
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
        title='Suivi géographique'
        subtitle=''
        background='secondary'
        image='/images/illustrations/geo_illustration.png'
        imageSide='right'
        id='suivi-geo'
        panelBottom={isMapShown ? <PcrsIframeMap /> : null}
      >
        <p>
          De nombreux territoires ont déjà mené à terme des projets PCRS ou entrepris les démarches pour être prêts pour l’échéance de complétude de 2026.
        </p>
        <p>
          Une cartographie vous montre quelles zones sont déjà pourvues de données raster ou vecteur, programmées ou en cours de réflexion. C’est un outil précieux pour identifier si votre territoire est déjà concerné ou doit faire l’objet d’une réflexion pour construire un PCRS.
        </p>
        <p>
          Ces cartes sont régulièrement mises à jour dans le cadre d’une veille de l’équipe ou au gré des déclarations spontanées des autorités publiques.
        </p>

        <Button
          label='Consulter la carte d’état d’avancement du PCRS'
          onClick={() => setIsMapShown(!isMapShown)}
        >
          Consulter la carte d’état d’avancement du PCRS <span className={isMapShown ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'} />
        </Button>

        <style jsx>{`
          p {
            text-align : left
          }

          .iframes {
            width: 100%;
          }
        `}</style>
      </SectionImage>

      <SectionImage
        title='Feuille de route'
        subtitle='Les étapes suivantes marqueront le développement de ce portail'
        image='/images/illustrations/progress_illustration.png'
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

      <SectionImage
        title='Événements autour du PCRS'
        background='color'
        id='evenements'
      >
        <Image
          src='/images/illustrations/calendar_illustration.png'
          height={200}
          width={200}
          alt=''
        />
        <div className='event-infos'>
          <p>
            Tenez-vous informé des prochains événements organisés par l’ANCT à propos du PCRS. Ateliers, conférences, annonces pour être toujours à jour.
          </p>
          <Button
            buttonStyle='tertiary'
            disabled
            label='Évenement à venir'
          >
            Évènements à venir
          </Button>
        </div>

        <style jsx>{`
          .event-infos {
            margin-top: 2em;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1em;
          }
        `}</style>
      </SectionImage>

      <SectionImage
        title='Contactez-nous'
        subtitle='Vous ne trouvez pas les réponses à vos questions sur ce site ou dans la documentation ?'
        id='contact'
      >
        <p>
          Vous pouvez nous contacter !
        </p>
        <p>
          Notre équipe fera le nécessaire pour vous répondre dans les plus brefs délais, dans la limite de sa disponibilité.
        </p>
        <Button
          href='mailto:contact@pcrs.beta.gouv.fr'
          isExternal
          label='Contacter l’équipe'
        >
          <span className='fr-icon-mail-line' aria-hidden='true' />&nbsp;Contactez-nous
        </Button>
      </SectionImage>

      <SectionImage
        title='Suivez l’actualité'
        subtitle='En vous inscrivant à la newsletter ou en nous suivant sur Twitter'
        background='secondary'
      >
        <Follow />
      </SectionImage>
    </Page>
  )
}

export default Home

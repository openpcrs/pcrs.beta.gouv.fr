import Image from 'next/image'
import Page from '@/layouts/main'

import Hero from '@/components/hero'
import Section from '@/components/section'
import Button from '@/components/button'

const Home = () => (
  <Page>
    <Hero />
    <Section background='dark'>
      <p className='fr-text--lg'>Vous êtes sur le site construit par et pour les territoires. Il expose les différents projets PCRS en cours, leurs acteurs et résultats produits. C’est le support de l’animation nationale associé à la documentation à produire.</p>
    </Section>

    <Section title='Documentation' image='/images/illustrations/doc_illustration.png' id='documentation'>
      <p>
        Accompagné par l’ANCT, vous avez tous les éléments en main pour mettre au point le PCRS sur votre territoire. Vous pouvez accéder au contexte réglementaire sur <a className='fr-link fr-icon-external-link-line fr-link--icon-right' href=' https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/reglementation'>cette page</a>.<br />
        <br />
        Un ensemble de fiches pratiques est disponible en fonction des problématiques que vous pouvez rencontrer, associées à une foire aux questions pour répondre aux interrogations les plus fréquentes.
        Si vous ne trouvez pas le contenu correspondant à vos attentes, n’hésitez pas à nous contacter.
      </p>

      <div className='doc-links'>
        <ul className='doc-list'>
          <li><a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/geostandards'>Standards</a></li>
          <li><a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/contexte-reglementaire/reglementation'>Règlementation</a></li>
          <li><a className='fr-link fr-icon-article-fill fr-link--icon-left' href='https://docs.pcrs.beta.gouv.fr/organiser-son-projet-pcrs/construction'>Bonnes pratiques</a></li>
        </ul>

        <Button href='https://docs.pcrs.beta.gouv.fr/' isExternal label='Accéder à la documentation'>Voir la documentation</Button>
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
    </Section>

    <Section title='Suivi géographique' subtitle='' background='secondary' image='/images/illustrations/geo_illustration.png' imageSide='right' id='suivi-geo'>
      <>
        <p>
          De nombreux territoires ont déjà mené à terme des projets PCRS ou entrepris les démarches pour être prêts pour l’échéance de complétude de 2026.<br /><br />
          Une cartographie vous montre quelles zones sont déjà pourvues de données raster ou vecteur, programmées ou en cours de réflexion. C’est un outil précieux pour identifier si votre territoire est déjà concerné ou doit faire l’objet d’une réflexion pour construire un PCRS.<br /><br />
          Ces cartes sont régulièrement mises à jour dans le cadre d’une veille de l’équipe ou au gré des déclarations spontanées des autorités publiques.
        </p>

        <Button href='http://cnig.gouv.fr/?page_id=25213' isExternal label='Consulter la carte d’état d’avancement du PCRS'>
          Consulter la carte d’état d’avancement du PCRS
        </Button>
      </>

      <style jsx>{`
        p {
          text-align : left
        }
      `}</style>
    </Section>

    <Section title='Fiche de route' subtitle='Les étapes suivantes marqueront le développement de ce portail' image='/images/illustrations/progress_illustration.png' id='feuille-de-route'>
      <ul className='fr-text--sm dev-list'>
        <li><span className='fr-icon-git-branch-fill' /> Mise en ligne d’une cartographie des projets et d’un annuaire des APLC complétés de manière collaborative.</li>
        <li><span className='fr-icon-git-branch-fill' /> Consolidation de la documentation en continu</li>
        <li><span className='fr-icon-git-branch-fill' /> Construction d’un cadre de financement commun</li>
        <li><span className='fr-icon-git-branch-fill' /> Mise en valeur des PCRS d’ores et déjà disponibles sous licence ouverte.</li>
      </ul>

      <style jsx>{`
        .dev-list {
          text-align: left;
          display: grid;
          justify-content: center;
          gap: 10px;
        }
      `}</style>
    </Section>

    <Section title='Événements autour du PCRS' background='color' id='evenements'>
      <Image src='/images/illustrations/calendar_illustration.png' height={200} width={200} />
      <div className='event-infos'>
        <p>Tenez-vous informé des prochains événements organisés par l’ANCT à propos du PCRS. Ateliers, conférences, annonces pour être toujours à jour.</p>
        <Button buttonStyle='tertiary' disabled>Évènements à venir</Button>
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
    </Section>
  </Page>
)

export default Home

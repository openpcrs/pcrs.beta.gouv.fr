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
  </Page>
)

export default Home

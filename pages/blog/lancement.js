import Page from '@/layouts/main'
import Follow from '@/components/follow'
import Section from '@/components/section'

const Lancement = () => (
  <Page>
    <section className='fr-px-3w fr-my-8w'>
      <h1 className='fr-py-4w'>Lancement</h1>
      <p>
        Les projets de Plan Corps de Rue Simplifiés (PCRS) sont en cours en France depuis 7 ans. Ils sont principalement portés par les Autorités Publiques Locales Compétentes (APLC) dans les territoires, en collaboration étroite avec leurs partenaires gestionnaires de réseaux et financeurs.
      </p>

      <p>
        Introduits par la réglementation anti-endommagement des réseaux en 2012, ces fonds de plan devront être disponibles en 2026. C’est une échéance proche.
      </p>

      <p>
        Consciente de l’ampleur des défis que cela représente pour les territoires, l’ANCT met en place dès à présent un dispositif national d’accompagnement à destination des collectivités. Il sera porté par une Startup d’État du programme beta.gouv, la Startup d’État pcrs.beta.gouv, dont l’équipe est déjà constituée de quatre personnes et en lien privilégié avec les équipes de l’IGN.
      </p>

      <p>
        Les ambitions que nous portons sont multiples :
      </p>
      <ul className='fr-p-3w'>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' />Consolidation de la documentation à propos et autour du PCRS à destination des collectivités</li>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' />Suivi des déclarations des APLC et des projets de production ou mise à jour de PCRS</li>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' />Proposition d’un cadre de financement national</li>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' />Mise en valeur des PCRS d’ores et déjà disponibles sous licence ouverte</li>
      </ul>

      <p>
        Notre équipe travaille en ce moment même à la mise au point des outils et rassemble les données nécessaires pour que cette feuille de route devienne une réalité d’ici le mois de mars 2023. Nous annonçons aujourd’hui-même la mise à disposition de notre site internet et de la documentation associée qui seront complétés en continu.
      </p>

      <p>
        Dans l’attente de prochains rendez-vous marquant la montée en puissance de notre initiative, nous nous tenons à votre disposition sur notre @ de contact.
      </p>
    </section>
    <section className='fr-px-3w fr-my-8w'>
      <p>
        Lien du site : <a href='pcrs.beta.gouv.fr'>pcrs.beta.gouv.fr</a>
      </p>
      <p>
        Lien vers la documentation : <a href='doc.pcrs.gouv.fr'>doc.pcrs.beta.gouv.fr</a>
      </p>
      <p>
        Adresse de contact : <a href='mailto:contact&#64;pcrs.beta.gouv.fr'>contact&#64;pcrs.beta.gouv.fr</a>
      </p>
    </section>
    <Section
      title='Suivez l’actualité'
      subtitle='En vous inscrivant à la newsletter ou en nous suivant sur Twitter'
      background='secondary'
    >
      <Follow />
    </Section>
    <style jsx>{`
      section {
        max-width: 1000px;
        margin: auto;
      }
    `}</style>
  </Page>
)

export default Lancement

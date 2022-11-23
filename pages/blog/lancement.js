import Image from 'next/image'

import Page from '@/layouts/main'
import Follow from '@/components/follow'
import Section from '@/components/section'

const Lancement = () => (
  <Page
    title='Lancement'
    description='Création d’une Startup d’Etat afin de produire la documentation et le suivi nécessaire aux territoires concernés par des projets PCRS, par l’ANCT'
    type='article'
  >
    <Section
      title='Lancement'
    >
      <div className='fr-container fr-pb-3w' style={{textAlign: 'center'}}>
        <div className='fr-col-12'>
          <Image
            src='/images/illustrations/illust_pcrs.png'
            height={450}
            width={1100}
            alt=''
            layout='responsive'
          />
        </div>
        <div>
          <small>PCRS Savoie - CD73 - RGD SMB</small>
        </div>
      </div>
      <p>
        <b>Les projets de Plan Corps de Rue Simplifiés</b> (PCRS) sont en cours en France depuis 7 ans. Ils sont principalement portés par les Autorités Publiques Locales Compétentes (APLC) dans les territoires, en collaboration étroite avec leurs partenaires gestionnaires de réseaux et financeurs.
      </p>

      <p>
        Introduits par la <b>réglementation anti-endommagement des réseaux</b> en 2012, ces fonds de plan devront être disponibles <b>en 2026</b>. C’est une échéance proche.
      </p>

      <p>
        Consciente de l’ampleur des défis que cela représente pour les territoires, l’ANCT met en place dès à présent <b>un dispositif national d’accompagnement</b> à destination des collectivités. Il sera porté par une Startup d’État du programme <a href='https://beta.gouv.fr' className='fr-link'>beta.gouv.fr</a>, la Startup d’État pcrs.beta.gouv, dont l’équipe est déjà constituée de six personnes et en lien privilégié avec les équipes de l’IGN.
      </p>

      <p>
        Les ambitions que nous portons sont multiples :
      </p>
      <ul className='fr-p-3w'>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' /><b>Consolidation de la documentation</b> à propos et autour du PCRS à destination des collectivités</li>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' /><b>Suivi</b> des déclarations des APLC et des projets de production ou mise à jour de PCRS</li>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' />Proposition d’un cadre de <b>financement national</b></li>
        <li className='fr-p-1w'><span className='fr-icon-arrow-right-s-line' aria-hidden='true' /><b>Mise en valeur des PCRS</b> d’ores et déjà disponibles sous licence ouverte</li>
      </ul>

      <p>
        Notre équipe travaille en ce moment même à la <b>mise au point des outils</b> et <b>rassemble les données</b> nécessaires pour que cette feuille de route devienne une réalité d’ici le mois de mars 2023. Nous annonçons aujourd’hui-même la mise à disposition de notre site internet et de la documentation associée qui seront complétés en continu.
      </p>

      <p>
        Dans l’attente de prochains rendez-vous marquant la montée en puissance de notre initiative, nous nous tenons à votre disposition sur notre adresse de contact.
      </p>
    </Section>
    <Section>
      <p>
        Lien du site : <a href='https://pcrs.beta.gouv.fr' className='fr-link fr-icon-links-line fr-link--icon-right'>pcrs.beta.gouv.fr</a>
      </p>
      <p>
        Lien vers la documentation : <a href='https://docs.pcrs.beta.gouv.fr' className='fr-link fr-icon-links-line fr-link--icon-right'>docs.pcrs.beta.gouv.fr</a>
      </p>
      <p>
        Adresse de contact : <a href='mailto:contact&#64;pcrs.beta.gouv.fr' className='fr-link fr-icon-links-line fr-link--icon-right'>contact&#64;pcrs.beta.gouv.fr</a>
      </p>
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
    <style jsx>{`
      section {
        max-width: 1000px;
        margin: auto;
      }
    `}</style>
  </Page>
)

export default Lancement

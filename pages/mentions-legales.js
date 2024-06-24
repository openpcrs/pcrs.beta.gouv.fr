import Page from '@/layouts/main.js'
import Section from '@/components/section.js'

const MentionsLegales = () => (
  <Page title='Mentions légales' description='Mentions légales relatives au site pcrs.beta.gouv.fr'>
    <Section
      title='Mentions légales'
    >
      <h4>Nous contacter</h4>
      <p>
        <a href='mailto:contact&#64;pcrs.beta.gouv.fr'>contact&#64;pcrs.beta.gouv.fr</a>
      </p>
      <h5>Éditeur</h5>
      <p>
        Agence Nationale de la Cohésion des Territoires <br /> 20, avenue de Ségur 75007 Paris
      </p>
      <p>
        <a href='mailto:info&#64;anct.gouv.fr'>info&#64;anct.gouv.fr</a>
      </p>
      <p>
        Directeur de publication : Stanislas Bourron, ANCT
      </p>
      <h5>Hébergeur</h5>
      <p>
        société Scalingo SAS <br /> Code APE 6311Z
      </p>
      <p>
        Siège social : <br /> 3, place de Haguenau <br /> 67000 Strasbourg - France
      </p>
    </Section>
  </Page>
)

export default MentionsLegales


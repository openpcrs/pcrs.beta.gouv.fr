import Page from '@/layouts/main'
import Section from '@/components/section'

const MentionsLegales = () => (
  <Page title='Mentions légales' description='Mentions légales relatives au site pcrs.beta.gouv.fr'>
    <Section
      title='Mentions légales'
    >
      <h4>Données personnelles</h4>
      <p>
        Les données recueillies ou traitées sont hébergées en France ou en Union Européenne.
      </p>
      <p>
        En application de la loi n°78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les utilisateurs de la plateforme pcrs.beta.gouv.fr disposent notamment d’un droit d’accès et de rectification auprès de l’éditeur de la plateforme.
      </p>
      <p>
        Ce droit s’exerce auprès de l’Agence Nationale de la Cohésion des Territoires, 20 avenue de Ségur, 75007 Paris. <br />dpo [à] anct.gouv.fr
      </p>
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
        Directeur de publication : Yves Le Breton, ANCT
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


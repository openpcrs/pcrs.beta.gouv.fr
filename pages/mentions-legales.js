import Page from '@/layouts/main'

const MentionsLegales = () => (
  <Page>
    <section className='fr-p-3w'>
      <h1>Mentions légales</h1>
      <h2>Données personnelles</h2>
      <p>
        Les données recueillies ou traitées sont hébergées en France ou en Union Européenne.
      </p>
      <p>
        En application de la loi n°78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les utilisateurs de la plateforme pcrs.beta.gouv.fr disposent notamment d’un droit d’accès et de rectification auprès de l’éditeur de la plateforme.
      </p>
      <p>
        Ce droit s’exerce auprès de l’Agence Nationale de la Cohésion des Territoires, 20 avenue de Ségur, 75007 Paris. <br />dpo [à] anct.gouv.fr
      </p>
    </section>
    <section className='fr-p-3w'>
      <h2>Nous contacter</h2>
      <p>
        <a href='mailto:contact&#64;pcrs.beta.gouv.fr'>contact&#64;pcrs.beta.gouv.fr</a>
      </p>
      <h3>Éditeur</h3>
      <p>
        Agence Nationale de la Cohésion des Territoires <br /> 20, avenue de Ségur 75007 Paris
      </p>
      <p>
        <a href='mailto:info&#64;anct.gouv.fr'>info&#64;anct.gouv.fr</a>
      </p>
      <p>
        Directeur de publication : Yves Le Breton, ANCT
      </p>
      <h3>Hébergeur</h3>
      <p>
        société Scalingo SAS <br /> Code APE 6311Z
      </p>
      <p>
        Siège social : <br /> 3, place de Haguenau <br /> 67000 Strasbourg - France
      </p>
    </section>
    <style jsx>{`
      section {
        max-width: 1000px;
        margin: auto;
      }
    `}</style>
  </Page>
)

export default MentionsLegales


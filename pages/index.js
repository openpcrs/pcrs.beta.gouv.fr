import Page from '@/layouts/main'

import Hero from '@/components/hero'
import Section from '@/components/section'

const Home = () => (
  <Page>
    <Hero />
    <Section background='dark'>
      <p className='fr-text--sm'>Vous êtes sur le site construit par et pour les territoires. Il expose les différents projets PCRS en cours, leurs acteurs et résultats produits. C’est le support de l’animation nationale associé à la documentation à produire.</p>
    </Section>
  </Page>
)

export default Home

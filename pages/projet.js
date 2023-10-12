import Page from '@/layouts/main.js'

import StockagePreview from '@/components/containers/stockage-preview.js'

const Projet = () => (
  <Page
    title='Carte des PCRS'
    description='Carte de déploiement des PCRS'
    hasFooter={false}
  >
    <StockagePreview stockageId='6526c4e5e93c9b0d1b5f6b44' />
  </Page>
)

export default Projet


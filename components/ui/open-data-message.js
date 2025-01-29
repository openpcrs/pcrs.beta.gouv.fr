import colors from '@/styles/colors.js'

const OpenDataMessage = () => (
  <div
    className='fr-p-1w fr-text--sm fr-m-0 fr-grid-row fr-grid-row--middle fr-grid-row--center'
  >
    <div>
      Les données de cette carte sont disponibles sur le site&nbsp;<a rel='noreferrer' href='https://www.data.gouv.fr/fr/organizations/pcrs-beta-gouv-fr/' target='_blank' title='ouvre un onglet vers data.gouv.fr'>data.gouv.fr</a>&nbsp;et leur mise à jour assurée en autonomie&nbsp;<a rel='noreferrer' href='https://docs.pcrs.beta.gouv.fr/suivi-des-projets/edition-des-donnees' target='_blank' title='ouvre un onglet vers docs.pcrs.beta.gouv.fr'>par les porteurs de projets</a>.
    </div>

    <style jsx>{`
        .open-data-message {
          background: ${colors.info975};
          text-align: center:
        }
        `}</style>
  </div>
)

export default OpenDataMessage

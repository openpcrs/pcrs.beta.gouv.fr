import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Contact from '@/components/map-sidebar/contact.js'

const GeneralInfos = ({regime, nature, porteur}) => (
  <div className='fr-grid-row fr-grid-row--gutters'>
    <div className='fr-col-12'>
      <h3 className='fr-text--lg fr-m-0 title fr-mb-1w'>Porteur de project</h3>
      <div className='fr-text--sm label'>{porteur.nom}</div>
    </div>

    <div className='fr-grid-row fr-col-12'>
      <div className='fr-col-6'>
        <h3 className='fr-text--lg fr-m-0 title fr-mb-1w'>Format</h3>
        <div className='fr-text--sm label'>{nature}</div>
      </div>
      <div className='fr-col-6'>
        <h3 className='fr-text--lg fr-m-0 title fr-mb-1w'>Régime</h3>
        <div className='fr-text--sm label'>{regime}</div>
      </div>
    </div>

    <div className='fr-col-12'>
      <h3 className='fr-text--lg fr-m-0 title fr-pl-0 fr-mb-2w'>Contact</h3>
      <Contact
        name={porteur.nom}
        phone={porteur.telephone}
        mail={porteur.mail}
      />
    </div>

    <style jsx>{`
        .title {
          color: ${colors.info425};
        }

        .label {
          font-weight: bold;
        }
      `}</style>
  </div>
)

GeneralInfos.propTypes = {
  nature: PropTypes.string.isRequired,
  regime: PropTypes.string.isRequired,
  porteur: PropTypes.object.isRequired
}

export default GeneralInfos

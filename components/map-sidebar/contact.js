import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const Contact = ({name, phone, mail}) => (
  <div className='contact'>
    <div className='contact-icons fr-pr-1w'>
      <span aria-disabled className='fr-icon-user-fill' aria-hidden='true' />
      <span aria-disabled className='fr-icon-phone-fill' aria-hidden='true' />
      <span aria-disabled className='fr-icon-mail-fill' aria-hidden='true' />
    </div>
    <div className='contact-infos fr-pl-2w'>
      <div className={name ? '' : 'no-data'} aria-label='Nom du contact de référence'>
        {`${name || 'non-renseigné'}`}
      </div>

      <a
        href={`tel:${phone}`}
        className={phone ? '' : 'no-data'}
        aria-label='Numéro de téléphone du contact de référence'
      >
        {`${phone || 'non-renseigné'}`}
      </a>

      <a
        href={`mailto:${mail}`}
        className={mail ? '' : 'no-data'}
        target='_self'
        aria-label='Email du contact de référence'
      >
        {`${mail || 'non-renseigné'}`}
      </a>
    </div>

    <style jsx>{`
      .contact {
        display: grid;
        grid-template-columns: 40px 1fr;
        align-items: center;
        color: ${colors.blueFranceSun113};
      }

      .contact-icons {
        border-right: 3px solid ${colors.blueFrance850};
      }

      .contact-icons, .contact-infos {
        display: grid;
        grid-template-rows: 30px;
        gap: 10px
      }

      .contact a {
        width: fit-content;
      }

      .no-data {
        pointer-events: none;
        font-style: italic;
        text-decoration: none;
        color: ${colors.grey200};
      }
    `}</style>
  </div>
)

Contact.defaultProps = {
  name: null,
  phone: null,
  mail: null
}

Contact.propTypes = {
  name: PropTypes.string,
  phone: PropTypes.string,
  mail: PropTypes.string
}

export default Contact

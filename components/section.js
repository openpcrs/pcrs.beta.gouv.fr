import PropTypes from 'prop-types'

import colors from '@/styles/colors'

const Section = ({title, subtitle, background, children, ...props}) => (
  <section className={`fr-p-3w ${background}`} {...props}>
    <div className='fr-container'>
      {title && (
        <h1 className='fr-pt-4w'>{title}</h1>
      )}

      {subtitle && (
        <h3 className='fr-p-2w subtitle'>{subtitle}</h3>
      )}

      <div className='fr-grid fr-grid--gutter'>
        {children}
      </div>
    </div>
    <style jsx>{`
      h1 {
        color: ${(background === 'dark' || background === 'blue') ? 'white' : 'inherit'}
      }

      .subtitle {
        color: ${(background === 'dark' || background === 'blue') ? 'white' : colors.grey200}
      }
 
      .primary {
        background-color: white;
      }

      .secondary {
        background-color: ${colors.grey975};
      }

      .dark {
        background-color: ${colors.darkgrey};
        color: white;
      }

      .blue {
        background-color: ${colors.info200};
        color: white;
      }
    `}</style>
  </section>
)

Section.defaultProps = {
  title: null,
  subtitle: null,
  background: 'primary'
}

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  background: PropTypes.oneOf([
    'primary',
    'secondary',
    'dark',
    'blue'
  ]),
  children: PropTypes.node.isRequired
}

export default Section


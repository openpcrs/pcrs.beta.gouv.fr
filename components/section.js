import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors'

const Section = ({title, subtitle, background, image, imageSide, children, ...props}) => (
  <section className={background} {...props}>
    <div className={`content-wrapper ${image ? 'illustrated' : ''}`}>
      {image && (<div className='illustration'><Image src={image} height={300} width={300} alt='' /></div>)}
      <div className='rows-section'>
        <div className='titles'>
          <h3>{title}</h3>
          <div className='subtitle fr-text fr-text--lg'>{subtitle}</div>
        </div>
        {children}
      </div>
    </div>

    <style jsx>{`
      section {
        padding: 2em 0;
        display: flex;
        justify-content: center;
      }

      .primary {
        background: white;
      }

      .secondary {
        background: ${colors.grey975};
      }

      .color {
        background: ${colors.info200};
        color: white;
      }

      .dark {
        background: ${colors.darkgrey};
        color: white;
      }

      h3 {
        color: ${background === 'color' || background === 'dark' ? 'white' : ''}
      }

      .subtitle {
         color: ${colors.grey200};
         font-weight: bold;
      }

      .content-wrapper {
        display: flex;
        justify-content: center;
        gap: 1em;
        width: 80%;
        padding: 5em 0;
      }

      .illustrated {
        display: flex;
        flex-direction: ${imageSide === 'right' ? 'row-reverse' : 'row'};
        justify-content: center;
        flex-wrap: wrap;
      }

      .titles {
        margin-bottom: 3em;
      }

      .illustration {
       flex: 1;
       display: flex;
       justify-content: center;
       align-items: center;
      }

      .rows-section {
        text-align: center;
        flex: 2;
      }

      p {
        text-align: ${image ? 'left' : 'center'}
      }

      h3 {
        margin-bottom: 0.5em;
      }
    `}</style>
  </section>
)

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  background: PropTypes.oneOf([
    'primary',
    'secondary',
    'color',
    'dark'
  ]),
  imageSide: PropTypes.oneOf([
    'left',
    'right'
  ]),
  children: PropTypes.node
}

Section.defaultProps = {
  title: null,
  subtitle: null,
  image: null,
  children: null,
  background: 'primary',
  imageSide: 'left'
}

export default Section

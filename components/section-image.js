import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors'

const SectionImage = ({title, subtitle, background, image, imageSide, panelBottom, children, ...props}) => (
  <section className={`fr-py-4w ${background}`} {...props}>
    <div className={`content-wrapper ${image ? 'illustrated' : ''}`}>
      {image && (
        <div className='illustration fr-m-auto'>
          <Image
            src={image}
            height={300}
            width={300}
            alt=''
          />
        </div>
      )}

      <div className='rows-section'>
        <div className='fr-mb-4w'>
          <h2>{title}</h2>
          <div className='subtitle fr-text fr-text--lg'>
            <b>{subtitle}</b>
          </div>
        </div>
        {children}
      </div>
    </div>

    {panelBottom && (
      <div className='fr-col-12 fr-mt-n4w'>
        {panelBottom}
      </div>
    )}

    <style jsx>{`
      section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .primary {
        background: white;
      }

      .secondary {
        background: ${colors.grey975};
      }

      .blue {
        background: ${colors.info200};
        color: white;
      }

      .dark {
        background: ${colors.darkgrey};
        color: white;
      }

      h2 {
        text-align: center;
        color: ${background === 'color' || background === 'dark' ? 'white' : ''};
      }

      .subtitle {
         color: ${colors.grey200};
         text-align: center;
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

      .illustration {
        flex: 1;
      }

      .rows-section {
        flex: 2;
      }

      p {
        text-align: ${image ? 'left' : 'center'}
      }
    `}</style>
  </section>
)

SectionImage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  background: PropTypes.oneOf([
    'primary',
    'secondary',
    'blue',
    'dark'
  ]),
  imageSide: PropTypes.oneOf([
    'left',
    'right'
  ]),
  children: PropTypes.node,
  panelBottom: PropTypes.node
}

SectionImage.defaultProps = {
  title: null,
  subtitle: null,
  image: null,
  children: null,
  panelBottom: null,
  background: 'primary',
  imageSide: 'left'
}

export default SectionImage


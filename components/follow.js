import {useState} from 'react'

const Follow = () => {
  const [isShown, setIsShown] = useState(false)

  return (
    <div className='fr-follow fr-px-5w'>
      <div className='fr-container'>
        <div className='fr-grid-row'>
          <div className='fr-col-12 fr-col-md-8'>
            <div className='fr-follow__newsletter'>
              <div>
                <h5 className='fr-h5 fr-follow__title'>Abonnez-vous à notre lettre d’information</h5>
                <p className='fr-text--sm fr-follow__desc'>
                  En renseignant votre adresse électronique, vous acceptez de recevoir nos actualités par courriel. Vous pouvez vous désinscrire à tout moment à l’aide des liens de désincription ou en nous contactant.
                </p>
              </div>
              <div>
                <button
                  className='fr-btn'
                  title='S’abonner à notre lettre d’information'
                  type='button'
                  onClick={() => setIsShown(!isShown)}
                >
                  S’abonner <span className={isShown ? 'fr-icon-arrow-up-s-line' : 'fr-icon-arrow-down-s-line'} />

                </button>
              </div>
              {isShown && (
                <iframe
                  sandbox
                  width='548'
                  height='562'
                  src='https://8d772127.sibforms.com/serve/MUIEAGVrRRdNf8ex7lKBHfryHEbpAvlG43zvsloz_wwk0bLT4HHAhAEm7P0qytxpW5YUqN5-YBdaLWhj3kD_N6NLZbIJtfNpuKdTrHWScyA5vmTpxoWGyokKSkvhHfUeEvhh4qxttYTfmdfx_w2v_mwGh8C7tOBaloCOZMM1F9TqIOtfnIbcrVa7-N9GvSYHhVHqNvXOnJXhfpLs'
                  frameBorder='0'
                  scrolling='auto'
                  allowfullscreen
                  className='fr-m-1w'
                  style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: '100%'
                  }}
                />
              )}
            </div>
          </div>
          <div className='fr-col-12 fr-col-md-4'>
            <div className='fr-follow__social'>
              <p className='fr-h5 fr-mb-3v'>
                Suivez-nous <br /> sur les réseaux sociaux
              </p>
              <ul className='fr-links-group fr-links-group--lg'>
                <li>
                  <a
                    className='fr-link--twitter fr-link'
                    title='Nous suivre sur Twitter'
                    href='https://twitter.com/pcrsbeta'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    className='fr-link--linkedin fr-link'
                    title='Nous suivre sur Linkedin'
                    href='https://www.linkedin.com/company/pcrs-beta-gouv-fr/about/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Linkedin
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fr-follow {
          text-align: left;
        }
      `}</style>
    </div>
  )
}

export default Follow

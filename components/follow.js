const Follow = () => {
  const handleSubmit = e => {
    e.preventDefault()
    console.log('Enregistrement à la Newsletter effectué!')
  }

  return (
    <div className='fr-follow'>
      <div className='fr-container'>
        <div className='fr-grid-row'>
          <div className='fr-col-12 fr-col-md-8'>
            <div className='fr-follow__newsletter'>
              <h5 className='fr-h5 fr-follow__title'>Abonnez-vous à notre lettre d’information</h5>
              <div>
                <form onSubmit={handleSubmit}>
                  <label className='fr-label' htmlFor='newsletter-email'>Votre adresse électronique (ex. : nom@domaine.fr)
                  </label>
                  <div className='fr-input-wrap fr-input-wrap--addon'>
                    <input className='fr-input' aria-describedby='fr-newsletter-hint-text' title='Votre adresse électronique (ex. : nom@domaine.fr)' placeholder='Votre adresse électronique (ex. : nom@domaine.fr)' type='email' id='newsletter-email' name='newsletter-email' />
                    <button className='fr-btn' id='newsletter-button' title='S’abonner à notre lettre d’information' value='submit' type='submit'>
                      S’abonner
                    </button>
                  </div>
                  <p id='fr-newsletter-hint-text' className='fr-hint-text'>En renseignant votre adresse électronique, vous acceptez de recevoir nos actualités par courriel. Vous pouvez vous désinscrire à tout moment à l’aide des liens de désinscription ou en nous contactant.</p>
                </form>
              </div>
            </div>
          </div>
          <div className='fr-col-12 fr-col-md-4'>
            <div className='fr-follow__social'>
              <p className='fr-h5 fr-mb-3v fr-mb-3v'>Suivez-nous
                <br /> sur les réseaux sociaux</p>
              <div className='social-media'>
                <a className='fr-link--twitter fr-link' title='Nous suivre sur Twitter' href='https://twitter.com/pcrsbeta' target='_blank' rel='noreferrer'>Twitter</a>
                <a className='fr-link--linkedin fr-link' title='Nous suivre sur Linkedin' href='https://www.linkedin.com/company/pcrs-beta-gouv-fr/about/' target='_blank' rel='noreferrer'>Linkedin</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fr-follow__newsletter {
          gap: 1em;
        }

        .fr-follow__social {
          justify-content: flex-start;
        }

        .fr-follow__title {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export default Follow

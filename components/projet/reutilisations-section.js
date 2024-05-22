import PropTypes from 'prop-types'

const Reutilisations = ({reutilisations}) => (
  <>
    <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Réutilisations : {reutilisations?.length}</h3>
    <div>
      {reutilisations ? (
        reutilisations.map(reutilisation => (
          <div key={reutilisation.lien} className='fr-grid-row fr-mb-3w'>
            <div className='fr-col-12'>
              <div className='fr-card fr-enlarge-link'>
                <div className='fr-card__body'>
                  <div className='fr-card__content'>
                    <h3 className='fr-card__title'>
                      <a target='_blank' rel='noreferrer' href={reutilisation.lien}>
                        {reutilisation.titre}
                      </a>
                    </h3>
                    <div className='fr-card__desc'>
                      {reutilisation.description.split('\n').map((line, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={idx}>{line}</div>
                      ))}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>Aucune réutilisation renseignée</div>
      )}
    </div>
  </>
)

Reutilisations.propTypes = {
  reutilisations: PropTypes.array.isRequired
}

export default Reutilisations

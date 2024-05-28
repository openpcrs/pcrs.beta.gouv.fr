import PropTypes from 'prop-types'

const Reutilisations = ({reutilisations}) => (
  <>
    <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Réutilisations : {reutilisations?.length}</h3>
    <div className='grid-container'>
      {reutilisations ? (
        reutilisations.map(reutilisation => (
          <div key={reutilisation.lien} className='fr-mb-3w flex-container'>
            <div className='flex-child'>
              <div className='fr-card fr-enlarge-link'>
                <div className='fr-card__body'>
                  <div className='fr-card__content'>
                    <h3 className='fr-card__title'>
                      <a
                        href={reutilisation.lien}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {reutilisation.titre}
                      </a>
                    </h3>
                    <div className='fr-card__desc'>
                      {reutilisation.description && (
                        reutilisation.description.split('\n').map((line, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx}>{line}</div>
                        ))
                      )}
                    </div>
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
    <style jsx>{`
      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1em;
      }

      .flex-container {
        display: flex;
        flex-direction: column;
        max-width: 500px;
      }

      .flex-child {
        flex: 1;
      }
    `}</style>
  </>
)

Reutilisations.propTypes = {
  reutilisations: PropTypes.array.isRequired
}

export default Reutilisations

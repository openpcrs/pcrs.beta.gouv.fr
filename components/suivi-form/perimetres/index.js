import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Perimetre from '@/components/suivi-form/perimetres/perimetre.js'
import PerimetreForm from '@/components/suivi-form/perimetres/perimetre-form.js'

const Perimetres = ({perimetres, hasMissingData, handlePerimetres, onRequiredFormOpen}) => {
  const onDelete = index => {
    handlePerimetres(current => current.filter((_, i) => index !== i))
  }

  return (
    <div className='fr-mt-8w'>
      <h3 className='fr-h5 fr-m-0'>Périmètres *</h3>
      <hr className='fr-my-3w' />

      {(hasMissingData && perimetres.length === 0) && (
        <div className='fr-error-text fr-mt-1w'>Au moins un périmètre doit être ajouté</div>
      )}

      <div className='fr-notice fr-notice--info'>
        <div className='fr-mx-2w fr-notice__body'>
          <p>les référentiels INSEE les plus à jour qui ne tiennent pas compte des territoires fusionnés il y a plus d’un an </p>
        </div>
      </div>

      <PerimetreForm
        perimetres={perimetres}
        handlePerimetres={handlePerimetres}
        onRequiredFormOpen={onRequiredFormOpen}
      />

      {perimetres.length > 0 && (
        <hr className='edit-separator fr-my-3w' />
      )}

      <div className='fr-grid-row fr-mt-2w'>
        {perimetres.map((perimetre, index) => {
          const [type, code] = perimetre.split(':')
          return (
            <Perimetre
              key={perimetre}
              type={type}
              code={code}
              handleDelete={() => onDelete(index)}
            />
          )
        })}
      </div>

      <style jsx>{`
        hr {
          border-top: 3px solid ${colors.grey850};
        }
        .edit-separator {
          border-top: 2px solid ${colors.blueFrance850};
        }
      `}</style>
    </div>
  )
}

Perimetres.propTypes = {
  perimetres: PropTypes.array.isRequired,
  hasMissingData: PropTypes.bool,
  handlePerimetres: PropTypes.func.isRequired,
  onRequiredFormOpen: PropTypes.func.isRequired
}

Perimetres.defaultProps = {
  hasMissingData: false
}
export default Perimetres

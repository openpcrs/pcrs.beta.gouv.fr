import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import {getPerimetersByCode} from '@/lib/decoupage-administratif-api.js'
import Loader from '@/components/loader.js'

const Perimetre = ({perimetre, perimetreAsObject, handleUpdate, handleDelete}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState(null)
  const [nom, setNom] = useState(null)
  const {perimetreType, perimetreCode} = perimetreAsObject

  useEffect(() => {
    const getPerimetreData = async () => {
      try {
        const perimetreData = await getPerimetersByCode(perimetreCode, perimetreType)

        setType(perimetreType)
        setNom(perimetreData.nom)
      } catch (error) {
        throw new Error(error)
      }

      setIsLoading(false)
    }

    getPerimetreData()
  }, [perimetre, perimetreType, perimetreCode])

  return (
    <div className='fr-grid-row fr-mr-1w fr-px-2w fr-py-1w fr-my-1w card-container'>
      {isLoading ? (
        <div className='fr-grid-row fr-grid-row--center'>
          <Loader size='small' />
        </div>
      ) : (
        <>

          <div className='fr-grid-row'>
            <div className='label'>{type} :</div>
            <div className='fr-pl-1w'>{nom}</div>
          </div>

          <div className='fr-pl-6w'>
            <button
              type='button'
              className='update-button fr-mr-1w fr-col-5'
              aria-label='Modifier le périmètre'
              onClick={handleUpdate}
            >
              <span className='fr-icon-edit-line' aria-hidden='true' />
            </button>

            <button
              type='button'
              aria-label='Supprimer le périmètre'
              className='delete-button fr-col-5'
              onClick={handleDelete}
            >
              <span className='fr-icon-delete-line' aria-hidden='true' />
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .card-container {
          background: ${colors.grey975};
          border-radius: 4px;
        }

        .label {
          font-weight: bold;
          color: ${colors.blueFranceSun113};
        }

        .update-button, .delete-button {
          text-decoration: underline;
          width: fit-content;
        }

        .update-button {
          color: ${colors.blueFranceSun113};
        }

        .delete-button {
          color: ${colors.error425};
        }
      `}</style>
    </div>
  )
}

Perimetre.propTypes = {
  perimetre: PropTypes.string.isRequired,
  perimetreAsObject: PropTypes.object.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Perimetre


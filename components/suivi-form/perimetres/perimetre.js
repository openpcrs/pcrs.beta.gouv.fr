import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import {getPerimetersByCode} from '@/lib/decoupage-administratif-api.js'
import Loader from '@/components/loader.js'

const Perimetre = ({type, code, handleDelete}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [nom, setNom] = useState(null)

  useEffect(() => {
    const getPerimetreData = async () => {
      try {
        const perimetreData = await getPerimetersByCode(code, type)

        setNom(perimetreData.nom)
      } catch (error) {
        throw new Error(error)
      }

      setIsLoading(false)
    }

    getPerimetreData()
  }, [type, code])

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

        .delete-button {
          text-decoration: underline;
          width: fit-content;
          color: ${colors.error425};
        }
      `}</style>
    </div>
  )
}

Perimetre.propTypes = {
  type: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Perimetre


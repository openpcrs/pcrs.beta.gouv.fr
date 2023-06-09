import {useEffect, useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {fr} from 'date-fns/locale'
import Loader from '../loader.js'

const Changes = ({token}) => {
  const [changes, setChanges] = useState()

  const getChanges = useCallback(async () => {
    const response = await fetch('/report', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    const projetsChanges = await response.json()

    setChanges(projetsChanges)
  }, [token])

  function returnLastChange(change) {
    if (change._deleted) {
      return 'Suppression'
    }

    if (change._updated !== change._created) {
      return 'Mise à jour'
    }

    return 'Création'
  }

  useEffect(() => {
    getChanges()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (changes?.length === 0) {
    return <div><i>Aucun changement dans les dernières 24h</i></div>
  }

  return (
    <div>
      <div className='fr-table fr-table--bordered'>
        <table>
          <thead>
            <tr>
              <th scope='col' className='fr-p-3w'>Nom du projet</th>
              <th scope='col' className='fr-p-3w'>Action</th>
              <th scope='col' className='fr-p-3w'>Depuis</th>
            </tr>
          </thead>
          {changes ? (
            <tbody>
              {changes.map(change => {
                const lastChange = returnLastChange(change)
                const modificationTime = new Date(change._updated)

                return (
                  <tr key={change.nom}>
                    <td className='fr-p-3w'><b>{change?.nom}</b></td>
                    <td className='fr-p-3w'>{lastChange}</td>
                    <td className='fr-p-3w'><i>{`(Il y a ${formatDistanceToNow(modificationTime, {locale: fr})})`}</i></td>
                  </tr>
                )
              })}
            </tbody>
          ) : (
            <Loader />
          )}
        </table>
      </div>
    </div>
  )
}

Changes.propTypes = {
  token: PropTypes.string.isRequired
}

export default Changes

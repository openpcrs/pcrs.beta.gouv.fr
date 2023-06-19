import {useEffect, useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {fr} from 'date-fns/locale'

import Loader from '../loader.js'

const Changes = ({token}) => {
  const [changes, setChanges] = useState()
  const [search, setSearch] = useState()
  const [filteredChanges, setFilteredChanges] = useState()

  const getAllChanges = useCallback(async () => {
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
    if (changes && search) {
      setFilteredChanges(changes.filter(p => p.nom.includes(search)))
    } else {
      setFilteredChanges(changes)
    }
  }, [changes, search])

  useEffect(() => {
    getAllChanges()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className='fr-col-12 fr-col-md-4'>
        <label className='fr-label fr-mb-1w'>
          <b>Rechercher un projet :</b>
        </label>
        <div className='fr-search-bar' >
          <input
            className='fr-input'
            placeholder='Chercher un projet'
            type='search'
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className='fr-table fr-table--layout-fixed'>
        {filteredChanges ? (
          <>
            <table>
              <thead>
                <tr>
                  <th scope='col' className='fr-p-2w'>Nom du projet</th>
                  <th scope='col' className='fr-p-2w'>Action</th>
                  <th scope='col' className='fr-p-2w'>Depuis</th>
                </tr>
              </thead>
              <tbody>
                {filteredChanges.map(change => {
                  const lastChange = returnLastChange(change)
                  const modificationTime = new Date(change._updated)

                  return (
                    <tr key={change.nom}>
                      <td className='fr-p-2w'><b>{change?.nom}</b></td>
                      <td className='fr-p-2w'>{lastChange}</td>
                      <td className='fr-p-2w'><i>{`(Il y a ${formatDistanceToNow(modificationTime, {locale: fr})})`}</i></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredChanges.length === 0 && (
              <div className='fr-p-2w'><i>Aucun résultat...</i></div>
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  )
}

Changes.propTypes = {
  token: PropTypes.string.isRequired
}

export default Changes

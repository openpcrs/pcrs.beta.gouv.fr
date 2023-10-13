import {useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

const ListSlicer = ({list, max, renderListItem}) => {
  const [listSize, setListSize] = useState(max)
  const [showFullList, setShowFullList] = useState(false)

  const toggleFullList = () => {
    setShowFullList(!showFullList)
    setListSize(showFullList ? max : list.length)
  }

  const buttonText = showFullList ? '...Masquer la liste' : '...Afficher la liste complète'

  if (list.length === 0) {
    return (
      <>
        <div className='fr-text--sm empty'>Aucun élément disponible à afficher</div>

        <style jsx>{`
          .empty {
            font-style: italic;
          }
        `}</style>
      </>
    )
  }

  return (
    <div>
      <ul className='fr-pl-0'>
        {list.slice(0, listSize).map(item => (
          <li key={uniqueId()}>{renderListItem ? renderListItem(item) : item}</li>
        ))}
      </ul>
      <div className='fr-text--sm show-hide-toggle' onClick={toggleFullList}>
        {list.length > max && buttonText}
      </div>

      <style jsx>{`
        .show-hide-toggle {
          font-style: italic;
          text-decoration: underline;
          cursor: pointer;
        }
     `}</style>
    </div>
  )
}

ListSlicer.propTypes = {
  list: PropTypes.array,
  max: PropTypes.number,
  renderListItem: PropTypes.func
}

ListSlicer.defaultProps = {
  list: [],
  max: 5
}

export default ListSlicer

import {useState} from 'react'
import PropTypes from 'prop-types'
import {uniqueId} from 'lodash-es'

const ListSlicer = ({list, start, end, renderListItem}) => {
  const [listSize, setListSize] = useState(end)
  const [showFullList, setShowFullList] = useState(false)

  const toggleFullList = () => {
    setShowFullList(!showFullList)
    setListSize(showFullList ? end : list.length)
  }

  const buttonText = showFullList ? '...Masquer la liste' : '...Afficher la liste complète'

  return (
    <div>
      <ul className='fr-pl-0'>
        {list.slice(start, listSize).map(item => (
          <li key={uniqueId()}>{renderListItem ? renderListItem(item) : item}</li>
        ))}
      </ul>
      <div className='fr-text--sm show-hide-toggle' onClick={toggleFullList}>
        {list.length > end && buttonText}
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
  start: PropTypes.number,
  end: PropTypes.number,
  renderListItem: PropTypes.func
}

ListSlicer.defaultProps = {
  list: [],
  start: 0,
  end: 0
}

export default ListSlicer

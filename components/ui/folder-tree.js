import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {orderBy, flatMap, sum} from 'lodash-es'

function sizeFormat(size) {
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' Ko'
  }

  if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' Mo'
  }

  if (size < 1024 * 1024 * 1024 * 1024) {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' Go'
  }

  return (size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' To'
}

// Folder component
const Folder = ({name, size, iconSize, isOpenByDefault, children}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault)

  const folderIconSize = iconSize === 'large' ? 50 : 26

  const toggleFolder = () => setIsOpen(!isOpen)
  return (
    <div className='folder-container'>
      <div className={`fr-grid-row fr-grid-row--bottom fr-grid-row--gutters ${(isOpen && children.length > 0) ? 'fr-mb-1w' : ''}`} onClick={toggleFolder}>
        <div className='fr-mr-1w'>
          <Image
            src={`/images/icons/folder-${isOpen ? 'open' : 'close'}.svg`}
            alt={isOpen ? 'dossier ouvert' : 'dossier fermé'}
            height={folderIconSize}
            width={folderIconSize}
          />
        </div>

        <div className={`${iconSize === 'large' ? 'fr-text--lead' : 'fr-text'} fr-grid-row fr-grid-row--bottom folder-infos`}>
          <div className='fr-mr-1w'>{name}</div>
          <div className='size fr-text--sm fr-m-0'>{size}</div>
        </div>
      </div>

      {isOpen && children}

      <style jsx>{`
        .folder-container {
          margin-left: 10px;
          margin-top: 20px;
          margin-bottom: 5px;
        }

        .folder-infos {
          font-weight: bold;
          margin-bottom: 5px;
          cursor: pointer;
        }

        .size {
          font-weight: 100;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

Folder.propTypes = {
  name: PropTypes.string,
  iconSize: PropTypes.oneOf([
    'medium',
    'large'
  ]),
  isOpenByDefault: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.node
}

Folder.defaultProps = {
  name: null,
  iconSize: 'medium',
  isOpenByDefault: false,
  size: null,
  children: null
}

// File component
const File = ({name, size}) => (
  <div className='fr-grid-row file-container'>
    <span className='fr-icon-file-line fr-mr-1w' aria-hidden='true' />

    <div className='file-infos fr-grid-row'>
      <div className='fr-mr-1w name'>{name}</div>
      <div className='size fr-text--sm fr-m-0'>{size}</div>
    </div>

    <style jsx>{`
      .file-container {
        cursor: pointer;
      }

      .name:hover {
        text-decoration: underline
      }

      .size {
        font-weight: 100;
        font-style: italic;
      }
    `}</style>
  </div>
)

File.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string
}

File.defaultProps = {
  name: null,
  size: null
}

// Tree component
const FolderTree = ({data, onItemSelect}) => {
  function getNodeSize(node) {
    // If the node is a directory, recursively calculate the total size of all its children (files and subdirectories) using flatMap.
    if (node.isDirectory) {
      return flatMap(node.children, child => getNodeSize(child))
    }

    // If the node is a file, return its size.
    return node.size
  }

  // Get all files size
  const treeTotalSize = sum(flatMap(data, item => getNodeSize(item)))

  // Create a folder tree of undetermined depth of nodes using recursion
  const renderTree = (items, depth = 0) => {
    const orderedTree = orderBy(items, [
      item => item.isDirectory, // Order by folder first...
      item => item.name.toLowerCase() // ... then order by alphabetic order
    ], ['desc', 'asc'])

    return orderedTree.map(item => {
      const fileSize = sizeFormat(item.size)
      const folderSize = item.isDirectory && sum(flatMap(item.children, child => getNodeSize(child)))

      return (
        <ul key={item.fullPath} style={{marginLeft: `${depth * 10}px`}}>
          {item.isDirectory ? (
            <li>
              <Folder
                name={item.name}
                isOpenByDefault={false}
                size={sizeFormat(folderSize)}
              >
                {item.children && renderTree(item.children, depth + 1)}
              </Folder>
            </li>
          ) : (
            <li onClick={() => onItemSelect(item)}>
              <File item={item} name={item.name} size={fileSize} />
            </li>
          )}
        </ul>
      )
    })
  }

  return (
    <Folder
      isOpenByDefault
      name='/'
      iconSize='large'
      size={sizeFormat(treeTotalSize)}
    >
      {renderTree(data)}
    </Folder>
  )
}

FolderTree.propTypes = {
  data: PropTypes.array.isRequired,
  onItemSelect: PropTypes.func.isRequired
}

export default FolderTree

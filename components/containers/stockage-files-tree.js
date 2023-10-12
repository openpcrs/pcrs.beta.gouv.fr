import {useState} from 'react'
import PropTypes from 'prop-types'

import {formatBytes} from '@/lib/utils/file.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'
import colors from '@/styles/colors.js'

import FolderTree from '@/components/ui/folder-tree.js'
import Badge from '@/components/badge.js'

const StockageFilesTree = ({data}) => {
  const [selectedFile, setSelectedFile] = useState()

  return (
    <div className='stockage-files-tree-container'>
      <div className='folder-tree-container'>
        <FolderTree data={data} onItemSelect={setSelectedFile} />
      </div>
      <div className='file-info-container'>
        {selectedFile && (
          <div className='card mb-4'>
            <div className='card-body'>
              <h2 className='card-title d-flex justify-content-between'>
                <div>
                  {selectedFile.name}
                  <span className='badge' style={{backgroundColor: PCRS_DATA_COLORS.livrablesNatures[selectedFile.dataFormat]}}>
                    {selectedFile.dataFormat}
                  </span>
                </div>
                <div className='ms-4'>
                  {formatBytes(selectedFile.size)}
                </div>
              </h2>
              <p className='card-subtitle mb-2 text-muted'>{selectedFile.parentDirectory}</p>
              <p><b>Dimensions en pixel</b>: {selectedFile.computedMetadata.size.width} x {selectedFile.computedMetadata.size.height}</p>
              <p><b>Projection</b>: {selectedFile.computedMetadata.projection.name}</p>
              <div className='bands'>
                <b>Bandes</b> :
                <Badge background='#f00'>
                  {selectedFile.computedMetadata.bands[0].dataType}
                </Badge>
                <Badge background='#0f0'>
                  {selectedFile.computedMetadata.bands[1].dataType}
                </Badge>
                <Badge background='#00f' textColor='#fff'>
                  {selectedFile.computedMetadata.bands[2].dataType}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .stockage-files-tree-container {
            display: flex;
            gap: 1em;
            flex-wrap: no-wrap;
            height: 100%;
        }

        .folder-tree-container {
            height: 500px;
            overflow: auto;
        }

        .file-info-container {
            padding: 1em;
            background-color: ${colors.grey900};
            flex: 1;
        }

        .bands {
            display: flex;
        }
        `}</style>
    </div>
  )
}

StockageFilesTree.propTypes = {
  data: PropTypes.object.isRequired
}

export default StockageFilesTree

import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {formatBytes} from '@/lib/utils/file.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import Button from '@/components/button.js'
import FolderTree from '@/components/ui/folder-tree.js'
import Badge from '@/components/badge.js'

const Desktop = ({data, handleSelectedFile, selectedFile}) => (
  <div className='explorer-container'>
    <div className={`fr-grid-row fr-grid-row--center fr-grid-row--middle fr-p-3w folder-tree-container ${selectedFile ? 'reduce' : ''}`}>
      <FolderTree data={data} onItemSelect={handleSelectedFile} />
    </div>

    {selectedFile && (
      <div className='stockage-files-tree-container fr-p-3w'>
        <div className='close-button-container fr-grid-row fr-grid-row--right'>
          <Button buttonStyle='tertiary-no-outline' onClick={() => handleSelectedFile(null)}>
            <span className='fr-icon-close-line' aria-hidden='true' />
          </Button>
        </div>

        <div>
          <h2>
            <div>
              {selectedFile.name}
              <span style={{backgroundColor: PCRS_DATA_COLORS.livrablesNatures[selectedFile.dataFormat]}}>
                {selectedFile.dataFormat}
              </span>
            </div>
            <div>
              {formatBytes(selectedFile.size)}
            </div>
          </h2>
          <p className='mb-2'>{selectedFile.parentDirectory}</p>
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

    <style jsx>{`
      .explorer-container {
        width: 100%;
        display: flex;
        gap: 1em;
        flex-wrap: no-wrap;
        height: 100%;
      }

      .folder-tree-container {
        background: ${colors.grey975};
        width: 100%;
        height: 500px;
        overflow: auto;
        transition: width 0.3s ease-out;
      }

      .reduce {
        width: 40%;
        transition: width 0.3s ease-in;
      }

      .stockage-files-tree-container {
        padding: 1em;
        background-color: ${colors.grey900};
        width: 70%;
        flex-wrap: no-wrap;
      }

      .bands {
        display: flex;
      }
    `}</style>
  </div>

)

Desktop.propTypes = {
  data: PropTypes.array.isRequired,
  handleSelectedFile: PropTypes.func.isRequired,
  selectedFile: PropTypes.object
}

Desktop.defaultProps = {
  selectedFile: null
}

export default Desktop

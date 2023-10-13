import PropTypes from 'prop-types'

import {formatBytes} from '@/lib/utils/file.js'
import colors from '@/styles/colors.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import Button from '@/components/button.js'
import Badge from '@/components/badge.js'
import FolderTree from '@/components/ui/folder-tree.js'

const Mobile = ({data, handleSelectedFile, selectedFile}) => (
  <div className='explorer-container'>
    {selectedFile ? (
      <div className='stockage-files-tree-container fr-p-3w'>
        <div className='close-button-container fr-grid-row fr-grid-row--right'>
          <Button
            label='Masquer les informations du fichier'
            buttonStyle='tertiary-no-outline'
            onClick={() => handleSelectedFile(null)}
          >
            <span className='fr-icon-close-line' aria-hidden='true' />
          </Button>
        </div>
        <div className='fr-grid-row fr-grid-row--center'>
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
      </div>
    ) : (
      <div className='fr-grid-row fr-grid-row--center fr-grid-row--middle fr-p-3w folder-tree-container'>
        <FolderTree data={data} onItemSelect={handleSelectedFile} />
      </div>
    )}

    <style jsx>{`
      .explorer-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .folder-tree-container {
        background: ${colors.grey975};
        width: 100%;
      }

      .stockage-files-tree-container {
        width: 100%;
      }
    `}</style>
  </div>
)

Mobile.propTypes = {
  data: PropTypes.array.isRequired,
  handleSelectedFile: PropTypes.func.isRequired,
  selectedFile: PropTypes.object
}

Mobile.defaultProps = {
  selectedFile: null
}

export default Mobile

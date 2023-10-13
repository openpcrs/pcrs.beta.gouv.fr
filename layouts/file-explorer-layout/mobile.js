import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import FolderTree from '@/components/ui/folder-tree.js'
import StockageFilePreview from '@/components/ui/stockage-file-preview.js'

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
          <StockageFilePreview {...selectedFile} />
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

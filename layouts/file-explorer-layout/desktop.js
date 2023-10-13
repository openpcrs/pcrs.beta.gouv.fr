import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import Button from '@/components/button.js'
import FolderTree from '@/components/ui/folder-tree.js'
import StockageFilePreview from '@/components/ui/stockage-file-preview.js'

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

        <StockageFilePreview {...selectedFile} />
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

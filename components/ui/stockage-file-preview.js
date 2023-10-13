import PropTypes from 'prop-types'

import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'
import {formatBytes} from '@/lib/utils/file.js'

import Badge from '@/components/badge.js'

const StockageFilePreview = ({name, dataFormat, size, parentDirectory, computedMetadata}) => (
  <div>
    <h2>
      <div>
        {name}
        <span style={{backgroundColor: PCRS_DATA_COLORS.livrablesNatures[dataFormat]}}>
          {dataFormat}
        </span>
      </div>
      <div>
        {formatBytes(size)}
      </div>
    </h2>
    <p className='mb-2'>{parentDirectory}</p>
    <p><b>Dimensions en pixel</b>: {computedMetadata.size.width} x {computedMetadata.size.height}</p>
    <p><b>Projection</b>: {computedMetadata.projection.name}</p>
    <div className='bands'>
      <b>Bandes</b> :
      <Badge background='#f00'>
        {computedMetadata.bands[0].dataType}
      </Badge>
      <Badge background='#0f0'>
        {computedMetadata.bands[1].dataType}
      </Badge>
      <Badge background='#00f' textColor='#fff'>
        {computedMetadata.bands[2].dataType}
      </Badge>
    </div>

    <style jsx>{`
      .bands {
        display: flex;
      }
    `}</style>
  </div>
)

StockageFilePreview.propTypes = {
  name: PropTypes.string.isRequired,
  dataFormat: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  parentDirectory: PropTypes.string.isRequired,
  computedMetadata: PropTypes.shape({
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired,
    projection: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    bands: PropTypes.array.isRequired
  }).isRequired
}

export default StockageFilePreview

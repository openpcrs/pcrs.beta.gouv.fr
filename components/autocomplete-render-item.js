import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

const AutocompleteRenderItem = ({children, isHighlighted}) => (
  <div className='item fr-px-1w fr-py-2w'>
    {children}

    <style jsx>{`
      .item {
        background: ${isHighlighted ? colors.blueHover : 'white'};
        color: ${isHighlighted ? 'white' : colors.darkgrey};
      }

      .item:hover {
        cursor : ${isHighlighted ? 'pointer' : 'auto'}
      }
    `}</style>
  </div>
)

AutocompleteRenderItem.propTypes = {
  children: PropTypes.node,
  isHighlighted: PropTypes.bool
}

AutocompleteRenderItem.defaultProps = {
  children: null,
  isHighlighted: false
}

export default AutocompleteRenderItem

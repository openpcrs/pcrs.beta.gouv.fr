import {useState} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash-es'

import {NATURES_LABELS} from '@/lib/utils/projet.js'

import {livrableRenderItem} from '@/components/projet/list-render-items.js'
import SelectInput from '@/components/select-input.js'

const LivrablesSection = ({livrables}) => {
  const [selectedLivrableIdx, setSelectedLivrableIdx] = useState(0)

  const orderLivrablesByPublication = sortBy(livrables, livrable =>
    livrable.date_livraison ? -new Date(livrable.date_livraison) : 0
  )

  const livrablesOptions = orderLivrablesByPublication.map((item, idx) => ({
    label: `${item.nom} - ${NATURES_LABELS[item.nature]}`,
    value: idx
  }))

  return (
    <>
      <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Livrables · {livrables.length}</h3>
      <div>
        <SelectInput
          value={selectedLivrableIdx.toString()}
          label='Sélectionner un livrable'
          options={livrablesOptions}
          isDisabled={livrables.length === 1}
          onValueChange={e => setSelectedLivrableIdx(e.target.value)}
        />

        <div>
          {livrableRenderItem(orderLivrablesByPublication[selectedLivrableIdx])}
        </div>
      </div>
    </>
  )
}

LivrablesSection.propTypes = {
  livrables: PropTypes.array.isRequired
}

export default LivrablesSection

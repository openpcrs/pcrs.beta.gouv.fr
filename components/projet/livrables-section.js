import {useState} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash-es'

import StockagePreview from './stockage-preview.js'
import {LIVRABLE_NATURES} from '@/lib/utils/projet.js'

import {livrableRenderItem} from '@/components/projet/list-render-items.js'
import SelectInput from '@/components/select-input.js'

const LivrablesSection = ({projectId, livrables}) => {
  const [selectedLivrableIdx, setSelectedLivrableIdx] = useState(0)

  const orderedLivrablesByPublication = sortBy(livrables, livrable =>
    livrable.date_livraison ? new Date(livrable.date_livraison) : 0
  )

  const livrablesOptions = orderedLivrablesByPublication.map((item, idx) => ({
    label: `${item.nom} - ${LIVRABLE_NATURES[item.nature].label}`,
    value: idx
  }))

  const livrable = orderedLivrablesByPublication[selectedLivrableIdx]

  return (
    <div>
      <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Livrables : {livrables.length}</h3>
      <div>
        <SelectInput
          value={livrable.stockage_id}
          label='Sélectionner un livrable'
          options={livrablesOptions}
          isDisabled={livrables.length === 1}
          onValueChange={e => setSelectedLivrableIdx(e.target.value)}
        />

        <div>
          {livrableRenderItem(orderedLivrablesByPublication[selectedLivrableIdx])}

          {livrable && (
            <div className='stockage-preview'>
              <StockagePreview
                projectId={projectId}
                stockageId={livrable.stockage_id}
                isStockagePublic={livrable.stockage_public}
                isDownloadable={livrable.stockage_telechargement}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .stockage-preview {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

LivrablesSection.propTypes = {
  projectId: PropTypes.string,
  livrables: PropTypes.array.isRequired
}

export default LivrablesSection

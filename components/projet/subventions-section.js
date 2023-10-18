import PropTypes from 'prop-types'
import {groupBy} from 'lodash-es'

import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import {subventionRenderItem} from '@/components/projet/list-render-items.js'

import {SUBVENTIONS_NATURES_LABELS} from '@/lib/utils/projet.js'

import Badge from '@/components/badge.js'
import ListSlicer from '@/components/list-slicer.js'

const {subventionsNatures} = PCRS_DATA_COLORS

const SubventionsSection = ({subventions}) => {
  const subventionsByNatures = groupBy(subventions, 'nature')
  return (
    <>
      <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Subventions {subventions ? `· ${subventions.length}` : ''}</h3>
      <div>
        {subventions ? (
          Object.keys(subventionsByNatures).map(nature => (
            <div key={nature}>
              <div><Badge background={subventionsNatures[nature]}>{SUBVENTIONS_NATURES_LABELS[nature]}</Badge></div>
              <ListSlicer list={subventionsByNatures[nature]} itemId='nom' renderListItem={item => subventionRenderItem(item)} />
            </div>
          ))
        ) : (
          <div className='empty-subvention'>Aucune subvention renseignée</div>
        )}
      </div>

      <style jsx>{`
        .empty-subvention {
          font-style: italic;
        }
      `}</style>
    </>
  )
}

SubventionsSection.propTypes = {
  subventions: PropTypes.array.isRequired
}

export default SubventionsSection

import PropTypes from 'prop-types'
import {groupBy} from 'lodash-es'

import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import {ACTORS_LABELS} from '@/components/suivi-form/utils/labels.js'

import {acteurRenderItem} from '@/components/projet/list-render-items.js'
import ListSlicer from '@/components/list-slicer.js'
import Badge from '@/components/badge.js'

const {actors} = PCRS_DATA_COLORS

const ActeursSection = ({acteurs}) => {
  const acteursByRoles = groupBy(acteurs, 'role')
  return (
    <>
      <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Acteurs · {acteurs.length}</h3>
      <div>
        {Object.keys(acteursByRoles).map(role => (
          <div key={role}>
            <div><Badge background={actors[role]}>{ACTORS_LABELS[role]}</Badge></div>
            <ListSlicer list={acteursByRoles[role]} itemId='siren' renderListItem={item => acteurRenderItem(item)} />
          </div>
        ))}
      </div>
    </>
  )
}

ActeursSection.propTypes = {
  acteurs: PropTypes.array.isRequired
}

export default ActeursSection

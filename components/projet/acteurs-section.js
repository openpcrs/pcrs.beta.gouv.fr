import PropTypes from 'prop-types'
import {groupBy} from 'lodash-es'

import {ACTORS} from '@/lib/utils/projet.js'

import {acteurRenderItem} from '@/components/projet/list-render-items.js'
import ListSlicer from '@/components/list-slicer.js'
import Badge from '@/components/badge.js'

const ActeursSection = ({acteurs}) => {
  const acteursByRoles = groupBy(acteurs, 'role')
  return (
    <>
      <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Acteurs : {acteurs.length}</h3>
      <div>
        {Object.keys(acteursByRoles).map(role => (
          <div key={role}>
            <div><Badge background={ACTORS[role].color}>{ACTORS[role].label}</Badge></div>
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

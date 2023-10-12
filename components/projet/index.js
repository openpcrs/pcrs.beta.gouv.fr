import PropTypes from 'prop-types'
import {groupBy} from 'lodash-es'

import {livrableRenderItem, acteurRenderItem} from '@/components/projet/list-render-items.js'
import colors from '@/styles/colors.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import ListSlicer from '@/components/list-slicer.js'
import Badge from '@/components/badge.js'
import GeneralInfos from '@/components/projet/general-infos.js'
import ListItem from '@/components/projet/list-item.js'
import Documents from '@/components/map-sidebar/documents.js'

const ProjetInfos = ({project}) => {
  const {
    territoires,
    etapes,
    source,
    documentation,
    contrat,
    nature,
    regime,
    livrables,
    acteurs
  } = project

  const livrablesByNatures = groupBy(livrables, 'nature')
  const acteursByRoles = groupBy(acteurs, 'role')

  const {livrablesNatures, actors} = PCRS_DATA_COLORS

  return (
    <div className='fr-grid-row fr-p-8w'>
      <div className='fr-col-9'>
        <div className='fr-col-12'>
          <h3 className='fr-text--lead fr-mt-3w fr-mb-1w'>Liste des territoires · {territoires.length}</h3>
          <ListSlicer
            list={territoires}
            end={5}
            renderListItem={item => <div className='territoires-list-item fr-text--sm fr-m-0'>{item.nom}</div>}
          />
        </div>

        <div className='fr-col-12 fr-mt-6w'>
          <h3 className='fr-text--lead fr-mt-3w fr-mb-1w'>Livrables · {livrables.length}</h3>
          <div>
            {Object.keys(livrablesByNatures).map(nature => (
              <div key={nature}>
                <div><Badge background={livrablesNatures[nature]}>{NATURES_LABELS[nature]}</Badge></div>
                <ListSlicer
                  list={livrablesByNatures[nature]}
                  start={0}
                  end={5}
                  renderListItem={item => livrableRenderItem(item)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='fr-col-12 fr-mt-6w'>
          <h3 className='fr-text--lead fr-mt-3w fr-mb-1w'>Acteurs · {acteurs.length}</h3>
          <div>
            {Object.keys(acteursByRoles).map(role => (
              <div key={role}>
                <div><Badge background={actors[role]}>{ACTORS_LABELS[role]}</Badge></div>
                <ListSlicer
                  list={acteursByRoles[role]}
                  start={0}
                  end={5}
                  renderListItem={item => acteurRenderItem(item)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='fr-col-12 fr-col-md-6 fr-mt-6w'>
          <h3 className='fr-text--lead fr-mt-3w fr-mb-1w'>Sources et documentations</h3>
          <Documents
            source={source}
            documentation={documentation || 'https://docs.pcrs.beta.gouv.fr'}
            contract={contrat}
          />
        </div>
      </div>
      <div className='fr-col-12 fr-col-lg-3 fr-p-3w general-infos'>
        <GeneralInfos
          etapes={etapes}
          regime={regime}
          nature={nature}
          porteur={acteurs.find(acteur => acteur.role === 'aplc' || 'porteur')}
        />
      </div>

      <style jsx>{`
        .general-infos {
          background: ${colors.grey975};
          border-radius: 5px;
          height: fit-content;
        }

        .empty-subvention {
          font-style: italic;
        }

        .territoires-list-item {
          font-weight: bold;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

ProjetInfos.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjetInfos

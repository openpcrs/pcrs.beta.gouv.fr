import PropTypes from 'prop-types'
import {groupBy} from 'lodash-es'

import {getRoles} from '@/components/suivi-form/acteurs/utils/select-options.js'
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
  const acteursByRole = groupBy(acteurs, 'role')

  const {livrablesNatures, actors} = PCRS_DATA_COLORS

  return (
    <div className='fr-grid-row fr-p-8w'>
      <div className='fr-col-9'>
        <div className='fr-col-12'>
          <h3 className='fr-text--lead fr-mt-3w'>Liste des territoires · {territoires.length}</h3>
          <ListSlicer
            list={territoires}
            end={5}
            renderListItem={item => <div>{item.nom}</div>}
          />
        </div>

        <div className='fr-col-12'>
          <h3 className='fr-text--lead fr-mt-3w'>Livrables · {livrables.length}</h3>
          <div>
            {Object.keys(livrablesByNatures).map(nature => (
              <div key={nature}>
                <div><Badge background={livrablesNatures[nature]}> {nature}</Badge></div>
                <ListSlicer
                  list={livrablesByNatures[nature]}
                  start={0}
                  end={5}
                  renderListItem={item => <ListItem title={item.nom}>content</ListItem>}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='fr-col-12'>
          <h3 className='fr-text--lead fr-mt-3w'>Acteurs · {livrables.length}</h3>
          <div>
            {Object.keys(acteursByRole).map(role => (
              <div key={nature}>
                <div><Badge background={actors[role]}>{getRoles()[role]}</Badge></div>
                <ListSlicer
                  list={acteursByRole[role]}
                  start={0}
                  end={5}
                  renderListItem={item => <ListItem title={item.nom}>content</ListItem>}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='fr-col-12 fr-col-md-6'>
          <h3 className='fr-text--lead fr-mt-3w'>Sources et documentations</h3>
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
      `}</style>
    </div>
  )
}

ProjetInfos.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjetInfos

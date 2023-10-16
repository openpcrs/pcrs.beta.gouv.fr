import {useState} from 'react'
import PropTypes from 'prop-types'
import {groupBy, sortBy} from 'lodash-es'

import {livrableRenderItem, subventionRenderItem, acteurRenderItem} from '@/components/projet/list-render-items.js'
import {ACTORS_LABELS, NATURES_LABELS, SUBVENTIONS_NATURES_LABELS} from '@/components/suivi-form/utils/labels.js'
import {findClosestEtape} from '@/shared/find-closest-etape.js'
import {formatDate} from '@/lib/date-utils.js'

import colors from '@/styles/colors.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import ListSlicer from '@/components/list-slicer.js'
import Badge from '@/components/badge.js'
import GeneralInfos from '@/components/projet/general-infos.js'
import Documents from '@/components/map-sidebar/documents.js'
import EditorActions from '@/components/projet/editor-actions.js'
import SelectInput from '@/components/select-input.js'
import Timeline from '@/components/map-sidebar/timeline.js'

const ProjetInfos = ({project}) => {
  const {
    nom,
    _id,
    territoires,
    etapes,
    source,
    documentation,
    contrat,
    nature,
    regime,
    livrables,
    subventions,
    acteurs,
    editorKey
  } = project

  const orderLivrablesByPublication = sortBy(livrables, livrable =>
    livrable.date_livraison ? -new Date(livrable.date_livraison) : 0
  )

  const [selectedLivrableIdx, setSelectedLivrableIdx] = useState(0)

  const acteursByRoles = groupBy(acteurs, 'role')
  const subventionsByNatures = groupBy(subventions, 'nature')

  const livrablesOptions = orderLivrablesByPublication.map((item, idx) => ({
    label: `${item.nom} - ${NATURES_LABELS[item.nature]}`,
    value: idx
  }))

  const {actors, subventionsNatures} = PCRS_DATA_COLORS
  const {statut} = etapes[etapes.length - 1]
  const isObsolete = statut === 'obsolete'
  const projectStartDate = formatDate(find(etapes, {statut: 'investigation'}).date_debut)

  const {status} = PCRS_DATA_COLORS
  const closestPostStep = findClosestEtape(etapes)

  return (
    <div className='fr-grid-row fr-p-8w'>
      {editorKey && (
        <div className='fr-col-12'>
          <EditorActions nom={nom} editorCode={editorKey} projectId={_id} />
        </div>
      )}
      <div className='main'>
        <div className='left-section'>
          <div className='fr-col-12 fr-col-lg-6'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>État d’avancement</h3>
            <div>
              <div className='actual-status fr-mb-3w'>
                <Badge
                  background={status[closestPostStep.statut]}
                  textColor={closestPostStep.statut === 'livre' || closestPostStep.statut === 'obsolete' ? 'white' : 'black'}
                >
                  {closestPostStep.statut === 'livre' ? 'livré' : closestPostStep.statut}
                </Badge>

                {projectStartDate && (
                  <div className='start-date fr-text--sm fr-m-0'>Lancement du projet le {projectStartDate}</div>
                )}
              </div>
              {!isObsolete && (
                <Timeline
                  stepsColors={status}
                  currentStatus={closestPostStep.statut}
                  steps={etapes}
                />
              )}
            </div>
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Liste des territoires · {territoires.length}</h3>
            <ListSlicer list={territoires} renderListItem={item => <div className='territoires-list-item fr-text--sm fr-m-0'>{item.nom}</div>} />
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Livrables · {livrables.length}</h3>
            <div>
              <SelectInput
                value={selectedLivrableIdx.toString()}
                label='Sélectionner un livrable'
                options={livrablesOptions}
                onValueChange={e => setSelectedLivrableIdx(e.target.value)}
              />

              <div>
                {livrableRenderItem(orderLivrablesByPublication[selectedLivrableIdx])}
              </div>
            </div>
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Acteurs · {acteurs.length}</h3>
            <div>
              {Object.keys(acteursByRoles).map(role => (
                <div key={role}>
                  <div><Badge background={actors[role]}>{ACTORS_LABELS[role]}</Badge></div>
                  <ListSlicer list={acteursByRoles[role]} renderListItem={item => acteurRenderItem(item)} />
                </div>
              ))}
            </div>
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Subventions {subventions ? `· ${subventions.length}` : ''}</h3>
            <div>
              {subventions ? (
                Object.keys(subventionsByNatures).map(nature => (
                  <div key={nature}>
                    <div><Badge background={subventionsNatures[nature]}>{SUBVENTIONS_NATURES_LABELS[nature]}</Badge></div>
                    <ListSlicer list={subventionsByNatures[nature]} renderListItem={item => subventionRenderItem(item)} />
                  </div>
                ))
              ) : (
                <div className='empty-subvention'>Aucune subvention renseignée</div>
              )}
            </div>
          </div>

          <div className='fr-col-12 fr-col-md-6 fr-mt-6w'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Sources et documentations</h3>
            <Documents
              source={source}
              documentation={documentation || 'https://docs.pcrs.beta.gouv.fr'}
              contract={contrat}
            />
          </div>
        </div>

        <div className='fr-p-3w general-infos'>
          <GeneralInfos
            regime={regime}
            nature={nature}
            porteur={acteurs.find(acteur => acteur.role === 'aplc' || 'porteur')}
          />
        </div>
      </div>

      <style jsx>{`
      .main {
        width: 100%;
        display: grid;
        grid-template-columns: 7fr 3fr; /* Deux colonnes, deux occupe 70% et trois 30% */
        gap: 4em;
      }

      .left-section {
        grid-column: span 1;
      }

      .general-infos {
        grid-column: span 1;
        min-width: 300px;
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

      @media (max-width: 991px) { /* match LG breakpoint on DSFR */
        .main {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .general-infos {
          grid-row: 1;
        }
      }
    `}</style>
    </div>
  )
}

ProjetInfos.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjetInfos

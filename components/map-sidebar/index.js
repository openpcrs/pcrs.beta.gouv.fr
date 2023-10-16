import PropTypes from 'prop-types'
import {find} from 'lodash'

import {formatDate} from '@/lib/date-utils.js'
import {findClosestEtape} from '@/shared/find-closest-etape.js'
import {STATUS} from '@/lib/utils/projet.js'

import Header from '@/components/map-sidebar/project-header.js'
import Badge from '@/components/badge.js'
import Timeline from '@/components/map-sidebar/timeline.js'
import PcrsInfos from '@/components/map-sidebar/pcrs-infos.js'
import Documents from '@/components/map-sidebar/documents.js'
import Contact from '@/components/map-sidebar/contact.js'

const MapSidebar = ({projet, onClose, onProjetChange, projets}) => {
  const {
    nom,
    territoires,
    _id,
    etapes,
    source,
    subventions,
    documentation,
    contrat,
    editorKey,
    nature,
    regime,
    livrables,
    licence,
    acteurs
  } = projet

  const contactAPLC = acteurs.find(acteur => acteur.role === 'aplc' || 'porteur')
  const {statut} = projet.etapes[projet.etapes.length - 1]
  const projectStartDate = formatDate(find(projet.etapes, {statut: 'investigation'}).date_debut)
  const isObsolete = statut === 'obsolete'

  const closestPostStep = findClosestEtape(etapes)
  const closestPostStepStatus = STATUS[closestPostStep.statut]

  return (
    <>
      <Header
        projets={projets}
        projectId={_id}
        codeEditor={editorKey}
        projectName={nom}
        territoires={territoires}
        onSidebarClose={onClose}
        onProjetChange={onProjetChange}
      />
      <div className='infos-container'>
        <h2 className='fr-text--lead fr-mb-1w'>État d’avancement</h2>
        <div className='actual-status fr-mb-3w'>
          <Badge
            background={closestPostStepStatus.color}
            textColor={closestPostStepStatus.textColor}
          >
            {closestPostStepStatus.label}
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

        <h2 className='fr-text--lead fr-my-0'>Détails du projet</h2>
        <PcrsInfos
          nature={nature}
          regime={regime}
          livrables={livrables}
          licence={licence}
          acteurs={acteurs}
          subventions={subventions || []}
        />

        <h2 className='fr-text--lead fr-mt-3w'>Sources et documentations</h2>
        <Documents
          source={source}
          documentation={documentation || 'https://docs.pcrs.beta.gouv.fr'}
          contract={contrat}
        />

        <h2 className='fr-text--lead fr-mt-3w'>Contact</h2>
        <Contact
          name={contactAPLC?.nom}
          phone={contactAPLC?.telephone}
          mail={contactAPLC?.mail}
        />
      </div>

      <style jsx>{`
        .infos-container {
          padding: 1em;
          background-color: #ffffff;
        }
        .actual-status {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .start-date {
          font-style: italic;
        }
      `}</style>
    </>
  )
}

MapSidebar.defaultProps = {
  projets: null,
  onProjetChange: null
}

MapSidebar.propTypes = {
  projet: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  projets: PropTypes.array,
  onProjetChange: PropTypes.func
}

export default MapSidebar


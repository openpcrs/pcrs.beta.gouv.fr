import PropTypes from 'prop-types'
import {find} from 'lodash'

import {formatDate} from '@/lib/utils'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors'

import Header from '@/components/map-sidebar/project-header.js'
import Badge from '@/components/badge'
import Timeline from '@/components/map-sidebar/timeline'
import PcrsInfos from '@/components/map-sidebar/pcrs-infos'
import Documents from '@/components/map-sidebar/documents'
import Contact from '@/components/map-sidebar/contact'

const MapSidebar = ({project}) => {
  const {status} = PCRS_DATA_COLORS
  const {nom, perimetre, statut, steps, source, documentation, contrat, acteurs} = project

  const projectStartDate = formatDate(find(project.steps, {statut: 'investigation'}).date_debut)
  const isObsolete = project.statut === 'obsolète'

  return (
    <>
      <Header projectName={nom} territoires={perimetre.territoires} />
      <div className='infos-container'>
        <h2 className='fr-text--lead fr-mb-1w'>État d’avancement du PCRS</h2>
        <div className='actual-status fr-mb-3w'>
          <Badge
            background={status[statut]}
            textColor={statut === 'livré' || statut === 'obsolete' ? 'white' : 'black'}
          >
            {project.statut}
          </Badge>

          <div className='start-date fr-text--sm fr-m-0'>Lancement du projet le {projectStartDate}</div>
        </div>
        {!isObsolete && (
          <Timeline
            stepsColors={status}
            currentStatus={statut}
            steps={steps}
            isObsolete={isObsolete}
          />
        )}

        <h2 className='fr-text--lead fr-my-0'>Détails du projet</h2>
        <PcrsInfos {...project} />

        <h2 className='fr-text--lead fr-mt-3w'>Sources et documentations</h2>
        <Documents
          source={source}
          documentation={documentation}
          contract={contrat}
        />

        <h2 className='fr-text--lead fr-mt-3w'>Contact</h2>
        <Contact
          name={acteurs.aplc.interlocuteur.nom}
          phone={acteurs.aplc.interlocuteur.telephone}
          mail={acteurs.aplc.interlocuteur.mail}
        />
      </div>

      <style jsx>{`
        .infos-container {
          padding: 1em;
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

MapSidebar.propTypes = {
  project: PropTypes.object.isRequired
}

export default MapSidebar


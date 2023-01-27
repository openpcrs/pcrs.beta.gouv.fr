import PropTypes from 'prop-types'
import {find} from 'lodash'

import {formatDate} from '@/lib/date-utils.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import Header from '@/components/map-sidebar/project-header.js'
import Badge from '@/components/badge.js'
import Timeline from '@/components/map-sidebar/timeline.js'
import PcrsInfos from '@/components/map-sidebar/pcrs-infos.js'
import Documents from '@/components/map-sidebar/documents.js'
import Contact from '@/components/map-sidebar/contact.js'

const MapSidebar = ({projet}) => {
  const {status} = PCRS_DATA_COLORS
  const {nom, territoires, statut, etapes, source, documentation, contrat, acteurs} = projet
  const contactAPLC = acteurs.find(acteur => acteur.role === 'aplc')

  const projectStartDate = formatDate(find(projet.etapes, {statut: 'investigation'})?.date_debut) || null
  const isObsolete = projet.statut === 'obsolète'

  return (
    <>
      <Header projectName={nom} territoires={territoires} />
      <div className='infos-container'>
        <h2 className='fr-text--lead fr-mb-1w'>État d’avancement du PCRS</h2>
        <div className='actual-status fr-mb-3w'>
          <Badge
            background={status[statut]}
            textColor={statut === 'livré' || statut === 'obsolete' ? 'white' : 'black'}
          >
            {projet.statut}
          </Badge>

          {projectStartDate && (
            <div className='start-date fr-text--sm fr-m-0'>Lancement du projet le {projectStartDate}</div>
          )}
        </div>
        {!isObsolete && (
          <Timeline
            stepsColors={status}
            currentStatus={statut}
            steps={etapes}
            isObsolete={isObsolete}
          />
        )}

        <h2 className='fr-text--lead fr-my-0'>Détails du projet</h2>
        <PcrsInfos {...projet} />

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
  projet: PropTypes.object.isRequired
}

export default MapSidebar


import PropTypes from 'prop-types'

import {findClosestEtape} from '@/shared/find-closest-etape.js'
import {formatDate} from '@/lib/date-utils.js'

import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'
import colors from '@/styles/colors.js'

import Timeline from '@/components/map-sidebar/timeline.js'
import Badge from '@/components/badge.js'

import Contact from '@/components/map-sidebar/contact.js'

const GeneralInfos = ({etapes, nature, regime, porteur}) => {
  const {statut} = etapes[etapes.length - 1] // Statut de l'état d'avancement
  const isObsolete = statut === 'obsolete'
  const projectStartDate = formatDate(find(etapes, {statut: 'investigation'}).date_debut)

  const {status} = PCRS_DATA_COLORS // Couleur du statut actuel
  const closestPostStep = findClosestEtape(etapes)

  return (
    <div className='fr-grid-row fr-grid-row--gutters'>
      <div className='fr-col-12 fr-px-4w'>
        <h3 className='fr-text--lg fr-m-0 title fr-mb-1w'>Porteur de project</h3>
        <div>{porteur.nom}</div>
      </div>

      <div className='fr-col-12 fr-px-4w'>
        <h3 className='fr-text--lg fr-m-0 title fr-mb-1w'>État d’avancement</h3>
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

      <div className='fr-grid-row fr-col-12 fr-px-4w'>
        <div className='fr-col-6'>
          <h3 className='fr-text--lg fr-m-0 title fr-mb-1w'>Format</h3>
          <div>{nature}</div>
        </div>
        <div className='fr-col-6'>
          <h3 className='fr-text--lg fr-m-0 title'>Régime</h3>
          <div>{regime}</div>
        </div>
      </div>

      <div className='fr-col-12'>
        <h3 className='fr-text--lg fr-m-0 title fr-pl-3w fr-mb-1w'>Contact</h3>
        <Contact
          name={porteur.nom}
          phone={porteur.telephone}
          mail={porteur.mail}
        />
      </div>

      <style jsx>{`
        .title {
          color: ${colors.info425};
        }
      `}</style>
    </div>
  )
}

GeneralInfos.propTypes = {
  nature: PropTypes.string.isRequired,
  regime: PropTypes.string.isRequired,
  etapes: PropTypes.array.isRequired,
  porteur: PropTypes.object.isRequired
}

export default GeneralInfos

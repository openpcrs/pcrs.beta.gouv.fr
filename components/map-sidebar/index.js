import PropTypes from 'prop-types'
import {find} from 'lodash'

import {formatDate} from '@/lib/date-utils.js'

import Header from '@/components/map-sidebar/project-header.js'
import Badge from '@/components/badge.js'
import Timeline from '@/components/map-sidebar/timeline.js'
import PcrsInfos from '@/components/map-sidebar/pcrs-infos.js'
import Documents from '@/components/map-sidebar/documents.js'
import Contact from '@/components/map-sidebar/contact.js'

const TIMELINE = [
  {step: 1, label: 'Investigation', color: '#6b5200', background: '#ffe386', isProgressingStep: true},
  {step: 2, label: 'Production', color: '#114900', background: '#a7f192', isProgressingStep: true},
  {step: 3, label: 'Produit', color: '#06314f', background: '#87c1ea'},
  {step: 4, label: 'Livré', color: '#ffffff', background: '#175c8b'}
]

const MapSidebar = ({project}) => {
  const projectStartDate = formatDate(find(project.steps, {statut: 'investigation'}).date_debut)
  const isObsolete = project.statut === 'obsolète'
  const currentStep = find(TIMELINE, step => step.label.toLowerCase() === project.statut)

  return (
    <>
      <Header projectName={project.nom} territoires={project.perimetre.territoires} />
      <div className='infos-container'>
        <h2 className='fr-text--lead fr-mb-1w'>État d’avancement du PCRS</h2>
        <div className='actual-status fr-mb-3w'>
          {isObsolete ? (
            <Badge background='#7c7c7c' textColor='white'>{project.statut}</Badge>
          ) : (
            <Badge
              background={currentStep.background}
              textColor={currentStep.color}
            >
              {project.statut}
            </Badge>
          )}

          <div className='start-date fr-text--sm fr-m-0'>Lancement du projet le {projectStartDate}</div>
        </div>
        {!isObsolete && (
          <Timeline
            timeline={TIMELINE}
            currentStatus={project.statut}
            currentStep={currentStep}
            steps={project.steps}
            isObsolete={isObsolete}
          />
        )}

        <h2 className='fr-text--lead fr-my-0'>Détails du projet</h2>
        <PcrsInfos {...project} />

        <h2 className='fr-text--lead fr-mt-3w'>Sources et documentations</h2>
        <Documents
          source={project.source}
          documentation={project.documentation}
          contract={project.contrat}
        />

        <h2 className='fr-text--lead fr-mt-3w'>Contact</h2>
        <Contact
          name={project.acteurs.aplc.interlocuteur.nom}
          phone={project.acteurs.aplc.interlocuteur.telephone}
          mail={project.acteurs.aplc.interlocuteur.mail}
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

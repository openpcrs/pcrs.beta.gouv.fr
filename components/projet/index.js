import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'

import ListSlicer from '@/components/list-slicer.js'
import GeneralInfos from '@/components/projet/general-infos.js'
import Documents from '@/components/map-sidebar/documents.js'
import EditorActions from '@/components/projet/editor-actions.js'
import Progression from '@/components/map-sidebar/progression.js'
import Livrables from '@/components/projet/livrables-section.js'
import Acteurs from '@/components/projet/acteurs-section.js'
import Subventions from '@/components/projet/subventions-section.js'

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

  return (
    <div className='fr-grid-row fr-p-8w'>
      {editorKey && (
        <div className='fr-col-12'>
          <EditorActions nom={nom} editorCode={editorKey} projectId={_id} />
        </div>
      )}
      <div className='main'>
        <div className='left-section'>
          <div className='fr-col-12'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>État d’avancement</h3>
            <Progression etapes={etapes} />
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <h3 className='fr-text--lead fr-mt-5w fr-mb-3w'>Liste des territoires · {territoires.length}</h3>
            <ListSlicer list={territoires} itemId='code' renderListItem={item => <div className='territoires-list-item fr-text--sm fr-m-0'>{item.nom}</div>} />
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <Livrables livrables={livrables} />
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <Acteurs acteurs={acteurs} />
          </div>

          <div className='fr-col-12 fr-mt-6w'>
            <Subventions subventions={subventions} />
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
          grid-template-columns: 2fr 1fr;
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

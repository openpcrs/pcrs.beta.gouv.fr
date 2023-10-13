import {formatDate} from '@/lib/date-utils.js'
import {LICENCES_LABELS, NATURES_LABELS, PUBLICATIONS_LABELS, DIFFUSIONS_LABELS, SUBVENTIONS_NATURES_LABELS} from '@/components/suivi-form/utils/labels.js'

import colors from '@/styles/colors.js'
import ListItem from '@/components/projet/list-item.js'

export const livrableRenderItem = livrable => (
  <ListItem title={livrable.nom}>
    <div className='content-wrapper fr-p-2w'>
      <div className='fr-grid-row'><div className='title fr-mr-1w'>Nature : </div> <span>{NATURES_LABELS[livrable.nature]}</span></div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Licence :</div><span>{LICENCES_LABELS[livrable.licence]}</span></div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Diffusion :</div> <span>{DIFFUSIONS_LABELS[livrable.diffusion]}</span></div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Type de publication :</div><span>{livrable.publication ? PUBLICATIONS_LABELS[livrable.publication] : 'Non renseigné'}</span></div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'> Livraison :</div> <span>{livrable.date_livraison ? `le ${formatDate(livrable.date_livraison)}` : 'Non renseigné'}</span></div>

      <style jsx>{`
        .content-wrapper {
          background: white;
          text-align: left;
          gap: 5px;
        }

        .title {
          color: ${colors.info425};
          font-weight: bold;
        }

        .content-wrapper span {
          font-weight: normal;
        }
    `}</style>
    </div>
  </ListItem>
)

export const acteurRenderItem = acteur => (
  <ListItem title={acteur.nom}>
    <div className='content-wrapper fr-p-2w'>
      <div className='fr-grid-row'><div className='title fr-mr-1w'>SIREN :</div> {acteur.siren}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>mail :</div> {acteur.mail || 'Non renseigné'}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Téléphone :</div> {acteur.mail || 'Non renseigné'}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Part de financement :</div> {acteur.finance_part_perc || 'Non renseigné'}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Montant du financement :</div> {acteur.finance_part_euro || 'Non renseigné'}</div>

      <style jsx>{`
        .content-wrapper {
          background: white;
          text-align: left;
          gap: 5px;
        }

        .title {
          color: ${colors.info425};
          font-weight: bold;
        }

        .content-wrapper span {
          font-weight: normal;
        }
      `}</style>
    </div>
  </ListItem>
)

export const subventionRenderItem = subvention => (
  <ListItem title={subvention.nom}>
    <div className='content-wrapper fr-p-2w'>
      <div className='fr-grid-row'><div className='title fr-mr-1w'>Nature :</div> {SUBVENTIONS_NATURES_LABELS[subvention.nature]}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Montant :</div> <span>{`${subvention.montant ? `${subvention.montant}€` : 'Non renseigné'}`}</span></div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Échance :</div> {formatDate(subvention.echeance) || 'Non renseigné'}</div>

      <style jsx>{`
        .content-wrapper {
          background: white;
          text-align: left;
          gap: 5px;
        }

        .title {
          color: ${colors.info425};
          font-weight: bold;
        }

        .content-wrapper span {
          font-weight: normal;
        }
      `}</style>
    </div>
  </ListItem>
)

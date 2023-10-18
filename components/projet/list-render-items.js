import {formatDate} from '@/lib/date-utils.js'
import {SUBVENTIONS_NATURES, LICENCES, DIFFUSIONS, LIVRABLE_NATURES} from '@/lib/utils/projet.js'

import colors from '@/styles/colors.js'
import ListItem from '@/components/projet/list-item.js'

export const livrableRenderItem = livrable => (
  <div className='content-wrapper fr-p-2w'>
    <div className='fr-grid-row'><div className='title fr-mr-1w'>Nature : </div> <span>{LIVRABLE_NATURES[livrable.nature].label || 'Non renseignée'}</span></div>
    <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Licence :</div><span>{LICENCES[livrable.licence].label || 'Non renseignée'}</span></div>
    <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Diffusion :</div> <span>{DIFFUSIONS[livrable.diffusion].label || 'Non renseignée'}</span></div>
    <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'> Livraison :</div> <span>{livrable.date_livraison ? `le ${formatDate(livrable.date_livraison)}` : 'Non renseignée'}</span></div>

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
)

export const acteurRenderItem = acteur => (
  <ListItem title={acteur.nom}>
    <div className='content-wrapper fr-p-2w'>
      <div className='fr-grid-row'><div className='title fr-mr-1w'>SIREN :</div> {acteur.siren || 'Non renseigné'}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Mail :</div> {acteur.mail || 'Non renseigné'}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Téléphone :</div> {acteur.mail || 'Non renseigné'}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Part de financement :</div> {acteur.finance_part_perc || 'Non renseignée'}</div>
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
      <div className='fr-grid-row'><div className='title fr-mr-1w'>Nature :</div> {SUBVENTIONS_NATURES[subvention.nature].label || 'Non renseignée'}</div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Montant :</div> <span>{`${subvention.montant ? `${subvention.montant}€` : 'Non renseigné'}`}</span></div>
      <div className='fr-mt-1w fr-grid-row'><div className='title fr-mr-1w'>Échance :</div> {formatDate(subvention.echeance) || 'Non renseignée'}</div>

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

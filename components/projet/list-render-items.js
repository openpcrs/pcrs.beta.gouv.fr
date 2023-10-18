import {formatDate} from '@/lib/date-utils.js'
import {SUBVENTIONS_NATURES, LICENCES, LIVRABLE_NATURES} from '@/lib/utils/projet.js'
import colors from '@/styles/colors.js'
import ListItem from '@/components/projet/list-item.js'

const renderRowItem = (title, value, defaultText = 'Non renseigné') => (
  <div key={title} className='fr-grid-row'>
    <div className='title fr-mr-1w'>{title} :</div>
    <span>{value || defaultText}</span>
  </div>
)

const renderItem = rows => (
  <div className='content-wrapper fr-p-2w'>
    {rows.map(row => renderRowItem(row.title, row.value))}
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

export const livrableRenderItem = livrable => {
  const rows = [
    {title: 'Nature', value: LIVRABLE_NATURES[livrable.nature].label, defaultText: 'Non renseignée'},
    {title: 'Licence', value: LICENCES[livrable.licence].label, defaultText: 'Non renseignée'},
    {title: 'Stockage', value: livrable.stockage},
    {title: 'Livraison', value: livrable.date_livraison ? `le ${formatDate(livrable.date_livraison)}` : null, defaultText: 'Non renseignée'}
  ]
  return renderItem(rows)
}

export const acteurRenderItem = acteur => {
  const rows = [
    {title: 'SIREN', value: acteur.siren},
    {title: 'Mail', value: acteur.mail, defaultText: 'Non renseignée'},
    {title: 'Téléphone', value: acteur.telephone},
    {title: 'Part de financement', value: acteur.finance_part_perc, defaultText: 'Non renseignée'},
    {title: 'Montant du financement', value: acteur.finance_part_euro}
  ]
  return (
    <ListItem title={acteur.nom}>
      {renderItem(rows)}
    </ListItem>
  )
}

export const subventionRenderItem = subvention => {
  const rows = [
    {title: 'Nature', value: SUBVENTIONS_NATURES[subvention.nature], defaultText: 'Non renseignée'},
    {title: 'Montant', value: subvention.montant ? `${subvention.montant}€` : null},
    {title: 'Échance', value: formatDate(subvention.echeance), defaultText: 'Non renseignée'}
  ]
  return (
    <ListItem title={subvention.nom}>
      {renderItem(rows)}
    </ListItem>
  )
}

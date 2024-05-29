import {useState} from 'react'
import PropTypes from 'prop-types'

import {LICENCES, ACTORS, REGIMES, LIVRABLE_NATURES, SUBVENTIONS_NATURES, NATURES} from '@/lib/utils/projet.js'

import {formatDate} from '@/lib/date-utils.js'

import colors from '@/styles/colors.js'

import Tooltip from '@/components/tooltip.js'
import Badge from '@/components/badge.js'
import HiddenInfos from '@/components/hidden-infos.js'
import LabeledWrapper from '@/components/labeled-wrapper.js'

const PcrsInfos = ({nature, regime, livrables, licence, acteurs, subventions, reutilisations}) => {
  const [isActorsShow, setIsActorsShow] = useState(false)

  const nomAPLC = acteurs.find(acteur => acteur.role === 'aplc')?.nom

  function uniq(items) {
    return [...new Set(items)]
  }

  const rolesActeurs = uniq(acteurs.map(acteur => acteur.role))

  const livrableTooltip = livrable => (
    <div className='tooltip-container'>
      <div>Nature : <br /><span>{LIVRABLE_NATURES[livrable.nature].label}</span></div>
      <div>Licence : <br /><span>{LICENCES[livrable.licence].label}</span></div>
      <div>Stockage : <br /><span>{livrable.stockage || 'N/A'}</span></div>
      <div>Livraison : <br /><span>{livrable.date_livraison ? `le ${formatDate(livrable.date_livraison)}` : 'N/A'}</span></div>

      <style jsx>{`
        .tooltip-container {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .tooltip-container div {
          font-weight: bold
        }

        .tooltip-container span {
          font-weight: normal;
        }
      `}</style>
    </div>
  )

  const subventionTooltip = subvention => (
    <div className='tooltip-container'>
      <div>Nature : <br />{SUBVENTIONS_NATURES[subvention.nature].label}</div>
      <div>Montant : <br /><span>{`${subvention.montant ? `${subvention.montant}€` : 'N/A'}`}</span></div>
      <div>Échance : <br />{formatDate(subvention.echeance) || 'N/A'}</div>

      <style jsx>{`
        .tooltip-container {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .tooltip-container div {
          font-weight: bold
        }

        .tooltip-container span {
          font-weight: normal;
        }
      `}</style>
    </div>
  )

  return (
    <div>
      <div className='infos-block fr-my-1w'>
        <div className='format-regime-container fr-grid-row'>
          {nature && (
            <div className='fr-col-6'>
              <LabeledWrapper label='Format'>
                <Badge background={NATURES[nature].color}>
                  {nature}
                </Badge>
              </LabeledWrapper>
            </div>
          )}

          {regime && (
            <div className='fr-col-6'>
              <LabeledWrapper label='Régime'>
                <Badge background={REGIMES[regime].color}>
                  {regime}
                </Badge>
              </LabeledWrapper>
            </div>
          )}
        </div>

        <div className='livrable-container'>
          <LabeledWrapper label='Livrables'>
            <div className='livrables-badges'>
              {livrables.map(livrable => (
                <Tooltip key={livrable.nom} tooltipContent={() => livrableTooltip(livrable)}>
                  <Badge size='small' background={LIVRABLE_NATURES[livrable.nature].color}>{livrable.nom}</Badge>
                </Tooltip>
              ))}
            </div>
          </LabeledWrapper>
        </div>

        {licence && (
          <LabeledWrapper label='Licence'>
            <Badge background={LICENCES[licence].color} >
              {LICENCES[licence].label}
            </Badge>
          </LabeledWrapper>

        )}

        {nomAPLC && (
          <LabeledWrapper label='Porteur de projet'>
            <Badge background={ACTORS.aplc.color}>
              {nomAPLC}
            </Badge>
          </LabeledWrapper>
        )}

        <div className='fr-my-2w'>
          <LabeledWrapper label='Acteurs'>
            <div className='fr-grid-row'>
              {rolesActeurs.map(role => (
                <Badge
                  key={role}
                  background={ACTORS[role].color}
                  size='small'
                >
                  {ACTORS[role].label}
                </Badge>
              ))}
              <button
                type='button'
                className='fr-btn--tertiary-no-outline'
                style={{
                  visibility: isActorsShow ? 'hidden' : 'visible'
                }}
                onClick={() => setIsActorsShow(true)}
              >
                ...afficher la liste des acteurs
              </button>
            </div>
          </LabeledWrapper>

          {isActorsShow && (
            <HiddenInfos onClose={() => setIsActorsShow(false)}>
              {acteurs.map((acteur, idx) => (
                acteur.nom && (
                  <span key={acteur.nom} className='fr-text--sm'>
                    {acteur.nom} {idx === acteurs.length - 1 ? '' : ' - '}
                  </span>
                )
              ))}
            </HiddenInfos>
          )}
        </div>

        <div>
          <LabeledWrapper label='Subventions'>
            {subventions.length > 0 ? (
              <div className='fr-grid-row'>
                {subventions.map(subvention => (
                  <Tooltip key={subvention.nom} tooltipContent={() => subventionTooltip(subvention)}>
                    <Badge size='small' background={SUBVENTIONS_NATURES[subvention.nature].color}>{subvention.nom}</Badge>
                  </Tooltip>
                ))}
              </div>
            ) : (
              <i className='fr-text--sm'>Aucune subvention renseignée</i>
            )}
          </LabeledWrapper>
        </div>
      </div>

      <div>
        <LabeledWrapper label='Réutilisations'>
          {reutilisations.length > 0 ? (
            <div className='reutilisations fr-text--sm'>
              {reutilisations.map(reutilisation => (
                <div key={reutilisation.lien} className='fr-p-1v'>
                  <a href={reutilisation.lien} target='_blank' rel='noreferrer'>
                    {reutilisation.titre}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <i className='fr-text--sm'>Aucune réutilisation des données renseignée</i>
          )}
        </LabeledWrapper>
      </div>

      <style jsx>{`
        .infos-block {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2em 2em;
        }

        .livrable-container, .format-regime-container {
          width: 100%;
        }

        .reutilisations {
          padding-top: 1em;
          color: ${colors.blueFranceSun113};
        }

        .fr-btn--tertiary-no-outline {
          color: ${colors.grey50};
          font-style: italic;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

PcrsInfos.propTypes = {
  nature: PropTypes.string.isRequired,
  regime: PropTypes.string.isRequired,
  livrables: PropTypes.array.isRequired,
  licence: PropTypes.string,
  acteurs: PropTypes.array.isRequired,
  subventions: PropTypes.array.isRequired,
  reutilisations: PropTypes.array.isRequired
}

export default PcrsInfos

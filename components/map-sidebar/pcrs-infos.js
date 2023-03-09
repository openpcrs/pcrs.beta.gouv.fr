/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors.js'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

import Badge from '@/components/badge.js'
import HiddenInfos from '@/components/hidden-infos.js'
import LabeledWrapper from '@/components/labeled-wrapper.js'

const LICENCESLABELS = {
  ouvert_lo: 'Ouverte',
  ouvert_odbl: 'Ouverte sous licence ODbL',
  ferme: 'Fermée'
}

const ACTORSLABELS = {
  financeur: 'Financeurs',
  diffuseur: 'Diffuseurs',
  presta_vol: 'Prestataires de vol',
  presta_lidar: 'Prestataires Lidar',
  controleur: 'Controleurs',
  aplc: 'Autorité Publique Locale Compétente'
}

const PcrsInfos = ({nature, regime, livrable, diffusion, licence, acteurs}) => {
  const [isActorsShow, setIsActorsShow] = useState(false)
  const nomAPLC = acteurs.find(acteur => acteur.role === 'aplc').nom
  const {natures: naturesColors, regimes: regimesColors, licences: licencesColors, diffusions: diffusionsColors, livrables: livrablesColors, actors: actorsColors} = PCRS_DATA_COLORS

  function uniq(items) {
    return [...new Set(items)]
  }

  const rolesActeurs = uniq(acteurs.map(acteur => acteur.role))

  return (
    <div>
      <div className='infos-block fr-my-1w'>
        {nature && (
          <LabeledWrapper label='Format'>
            <Badge background={naturesColors[nature]}>
              {nature}
            </Badge>
          </LabeledWrapper>
        )}

        {regime && (
          <LabeledWrapper label='Régime'>
            <Badge background={regimesColors[regime]}>
              {regime}
            </Badge>
          </LabeledWrapper>
        )}

        {livrable && (
          <LabeledWrapper label='Livrable'>
            <Badge background={livrablesColors[livrable]}>
              {livrable}
            </Badge>
          </LabeledWrapper>
        )}

        {diffusion && (
          <LabeledWrapper label='Diffusion'>
            <Badge background={diffusionsColors[diffusion]}>
              {diffusion}
            </Badge>
          </LabeledWrapper>
        )}

        {licence && (
          <LabeledWrapper label='Licence'>
            <Badge background={licencesColors[licence]} >
              {LICENCESLABELS[licence]}
            </Badge>
          </LabeledWrapper>

        )}

        {nomAPLC && (
          <LabeledWrapper label='Porteur de projet'>
            <Badge background={actorsColors.aplc}>
              {nomAPLC}
            </Badge>
          </LabeledWrapper>
        )}

        <div className='fr-my-2w'>
          <LabeledWrapper label='Acteurs'>
            <div className='actors-badges'>
              {rolesActeurs.map(role => (
                <Badge
                  key={role}
                  background={actorsColors[role]}
                  size='small'
                >
                  {ACTORSLABELS[role]}
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
      </div>

      <style jsx>{`
        .infos-block {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2em 2em;
        }
        .actors-badges {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
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
  nature: PropTypes.string,
  regime: PropTypes.string,
  livrable: PropTypes.string,
  diffusion: PropTypes.string,
  licence: PropTypes.string,
  acteurs: PropTypes.array.isRequired
}

export default PcrsInfos


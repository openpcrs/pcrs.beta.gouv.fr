/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'
import {concat} from 'lodash'

import colors from '@/styles/colors'
import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors'

import Badge from '@/components/badge'
import HiddenInfos from '@/components/hidden-infos.js'
import LabeledWrapper from '@/components/labeled-wrapper.js'

const LICENCESLABELS = {
  ouvert_lo: 'Ouverte',
  ouvert_odbl: 'Ouverte sous licence ODbL',
  ferme: 'Fermée'
}

const ACTORSLABELS = {
  financeurs: 'Financeurs',
  diffuseurs: 'Diffuseurs',
  presta_vol: 'Prestataire de vol',
  presta_lidar: 'Prestataire Lidar',
  controleurs: 'Controleurs'
}

const PcrsInfos = ({nature, regime, livrable, diffusion, licence, acteurs}) => {
  const [isActorsShow, setIsActorsShow] = useState(false)

  const {natures, regimes, licences, diffusions, livrables, actors} = PCRS_DATA_COLORS

  const actorsTypes = Object.keys(acteurs)
  const allActors = concat(
    acteurs.financeurs,
    acteurs.diffuseurs,
    acteurs.presta_vol,
    acteurs.presta_lidar,
    acteurs.controleurs
  )

  return (
    <div>
      <div className='infos-block fr-my-1w'>
        {nature && (
          <LabeledWrapper label='Format'>
            <Badge background={natures[nature]}>
              {nature}
            </Badge>
          </LabeledWrapper>
        )}

        {regime && (
          <LabeledWrapper label='Régime'>
            <Badge background={regimes[regime]}>
              {regime}
            </Badge>
          </LabeledWrapper>
        )}

        {livrable && (
          <LabeledWrapper label='Livrable'>
            <Badge background={livrables[livrable]}>
              {livrable}
            </Badge>
          </LabeledWrapper>
        )}

        {diffusion && (
          <LabeledWrapper label='Diffusion'>
            <Badge background={diffusions[diffusion]}>
              {diffusion}
            </Badge>
          </LabeledWrapper>
        )}

        {licence && (
          <LabeledWrapper label='Licence'>
            <Badge background={licences[licence]} >
              {LICENCESLABELS[licence]}
            </Badge>
          </LabeledWrapper>

        )}

        {acteurs.aplc.nom && (
          <LabeledWrapper label='Porteur de projet'>
            <Badge background={actors.aplc}>
              {acteurs.aplc.nom}
            </Badge>
          </LabeledWrapper>
        )}

        <div className='fr-my-2w'>
          <LabeledWrapper label='Acteurs'>
            <div className='actors-badges'>
              {actorsTypes.slice(1, actorsTypes.length).map(actor => (
                <Badge
                  key={actor}
                  background={actors[actor]}
                  size='small'
                >
                  {ACTORSLABELS[actor]}
                </Badge>
              )
              )}
              <button onClick={() => setIsActorsShow(true)} type='button' className='fr-btn--tertiary-no-outline'>...afficher la liste des acteurs</button>
            </div>
          </LabeledWrapper>

          {isActorsShow && (
            <HiddenInfos onClose={() => setIsActorsShow(false)}>
              {allActors.map((actor, idx) => (
                <span key={actor.nom} className='fr-text--sm'>{actor.nom} {idx === allActors.length - 1 ? '' : ' - '}</span>
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
  acteurs: PropTypes.object.isRequired
}

export default PcrsInfos


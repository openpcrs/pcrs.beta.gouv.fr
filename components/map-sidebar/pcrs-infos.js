/* eslint-disable camelcase */
import {useState} from 'react'
import PropTypes from 'prop-types'
import {concat} from 'lodash'

import colors from '@/styles/colors.js'

import Badge from '@/components/badge.js'
import HiddenInfos from '@/components/hidden-infos.js'

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

const NATURES = {
  raster: {background: '#fc916f'},
  vecteur: {background: '#86b6d8'},
  mixte: {background: '#cf7bb9'}
}

const PcrsInfos = ({nature, regime, livrable, diffusion, licence, acteurs}) => {
  const [isActorsShow, setIsActorsShow] = useState(false)

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
      <div className='infos-block fr-my-0'>
        {nature && (
          <Badge
            label='Format'
            background={NATURES[nature].background}
            color='white'
          >
            {nature}
          </Badge>
        )}

        {regime && (
          <Badge
            isColorRandom
            label='Régime'
            hue='orange'
          >
            {regime}
          </Badge>
        )}

        {livrable && (
          <Badge
            isColorRandom
            label='Livrable'
            hue='purple'
          >
            {livrable}
          </Badge>
        )}

        {diffusion && (
          <Badge
            isColorRandom
            label='Diffusion'
            hue='green'
          >{diffusion}
          </Badge>
        )}

        {licence && (
          <Badge
            isColorRandom
            label='Licence'
            hue='pink'
          >
            {LICENCESLABELS[licence]}
          </Badge>
        )}

        {acteurs.aplc.nom && (
          <Badge
            isColorRandom
            label='Porteur de projet'
            hue='yellow'
          >
            {acteurs.aplc.nom}
          </Badge>
        )}
      </div>

      <div className='fr-my-2w'>
        <div className='label'>Acteurs</div>
        <div className='actors-badges'>
          {actorsTypes.slice(1, actorsTypes.length).map(actor => (
            <Badge key={actor} isColorRandom size='small'>
              {ACTORSLABELS[actor]}
            </Badge>
          ))}
          <button
            type='button'
            className='fr-btn--tertiary-no-outline'
            onClick={() => setIsActorsShow(true)}
          >
            ...afficher la liste des acteurs
          </button>
        </div>

        {isActorsShow && (
          <HiddenInfos onClose={() => setIsActorsShow(false)}>
            {allActors.map((actor, idx) => (
              <span key={actor.nom} className='fr-text--sm'>{actor.nom} {idx === allActors.length - 1 ? '' : ' - '}</span>
            ))}
          </HiddenInfos>
        )}
      </div>

      <style jsx>{`
        .infos-block {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2em 2em;
        }

        .label {
          font-weight: bold;
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

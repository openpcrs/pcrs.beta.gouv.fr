import PropTypes from 'prop-types'

import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'

const REGIMES = [
  {label: 'Production initiale', value: 'production'},
  {label: 'Mise à jour', value: 'maj'}
]

const NATURES = [
  {label: 'PCRS vecteur', value: 'vecteur'},
  {label: 'PCRS raster', value: 'raster'},
  {label: 'PCRS mixte (vecteur + raster)', value: 'mixte'}
]

const GeneralInfos = ({inputValues, handleName, handleRegime, handleNature}) => {
  const {nom, regime, nature} = inputValues

  return (
    <div>
      <div className='fr-grid-row'>
        <div className='fr-col-6'>
          <TextInput
            isRequired
            label='Nom du PCRS *'
            ariaLabel='nom du projet pcrs'
            value={nom}
            placeholder='Nom du projet'
            onValueChange={handleName}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-mt-5w'>
        <div className='fr-col-12 fr-col-md-6'>
          <SelectInput
            isRequired
            label='Régime *'
            value={regime}
            description='Régime du projet'
            ariaLabel='régime du projet pcrs'
            options={REGIMES}
            onValueChange={handleRegime}
          />
        </div>

        <div className='fr-col-12 fr-mt-3w fr-mt-md-0 fr-col-md-6 fr-pl-md-3w'>
          <SelectInput
            isRequired
            label='Nature *'
            value={nature}
            description='Nature du projet'
            ariaLabel='nature du projet pcrs'
            options={NATURES}
            onValueChange={handleNature}
          />
        </div>
      </div>
    </div>
  )
}

GeneralInfos.propTypes = {
  inputValues: PropTypes.object.isRequired,
  handleName: PropTypes.func.isRequired,
  handleNature: PropTypes.func.isRequired,
  handleRegime: PropTypes.func.isRequired
}

export default GeneralInfos

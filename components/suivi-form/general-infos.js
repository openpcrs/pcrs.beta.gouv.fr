import PropTypes from 'prop-types'

import TextInput from '@/components/text-input.js'
import SelectInput from '@/components/select-input.js'

import {natureOptions, regimeOptions} from '@/components/suivi-form/utils/general-select-options.js'

const GeneralInfos = ({inputValues, handleValues}) => {
  const {nom, regime, nature} = inputValues

  return (
    <div>
      <div className='fr-grid-row'>
        <div className='fr-col-12 fr-col-md-6'>
          <TextInput
            isRequired
            label='Nom du PCRS'
            ariaLabel='nom du projet pcrs'
            value={nom}
            placeholder='Nom du projet'
            onValueChange={e => {
              handleValues({
                ...inputValues,
                nom: e.target.value
              })
            }}
          />
        </div>
      </div>

      <div className='fr-grid-row fr-mt-5w'>
        <div className='fr-col-12 fr-col-md-6'>
          <SelectInput
            isRequired
            label='Régime'
            value={regime}
            description='Régime du projet'
            ariaLabel='régime du projet pcrs'
            options={regimeOptions}
            onValueChange={e => {
              handleValues({
                ...inputValues,
                regime: e.target.value
              })
            }}
          />
        </div>

        <div className='fr-col-12 fr-mt-3w fr-mt-md-0 fr-col-md-6 fr-pl-md-3w'>
          <SelectInput
            isRequired
            label='Nature'
            value={nature}
            description='Nature du projet'
            ariaLabel='nature du projet pcrs'
            options={natureOptions}
            onValueChange={e => {
              handleValues({
                ...inputValues,
                nature: e.target.value
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

GeneralInfos.propTypes = {
  inputValues: PropTypes.object.isRequired,
  handleValues: PropTypes.func.isRequired
}

export default GeneralInfos

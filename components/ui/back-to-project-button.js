import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import Button from '@/components/button.js'

const BackToProjectButton = ({projetId}) => {
  const router = useRouter()
  return (
    <Button
      label={projetId ? 'Retour au projet' : 'Retour à la carte de suivi'}
      iconSide='left'
      buttonStyle='secondary'
      icon='arrow-left-line'
      type='button'
      size='sm'
      onClick={() => router.push(projetId ? `/projet/${projetId}` : '/suivi-pcrs')}
    >
      {`Retourner à la ${projetId ? 'page du projet' : 'carte de suivi'}`}
    </Button>
  )
}

BackToProjectButton.propTypes = {
  projetId: PropTypes.string
}

export default BackToProjectButton

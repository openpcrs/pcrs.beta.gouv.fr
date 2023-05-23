import {useState} from 'react'
import PropTypes from 'prop-types'
import ShareModal from '@/components/suivi-form/share-modal'

const Test = () => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <ShareModal projectId='sdkjfksdjfkdsf' editCode='ajdhf' handleModal={() => setIsOpen(false)} />
  )
}

Test.propTypes = {}
export default Test

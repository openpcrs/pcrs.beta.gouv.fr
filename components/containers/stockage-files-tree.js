import {useState, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'

import DeviceContext from '@/contexts/device.js'

import Desktop from '@/layouts/file-explorer-layout/desktop.js'
import Mobile from '@/layouts/file-explorer-layout/mobile.js'

const StockageFilesTree = ({data}) => {
  const {isMobileDevice} = useContext(DeviceContext)
  const [selectedFile, setSelectedFile] = useState()

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])

  return (
    <Layout
      data={data}
      handleSelectedFile={setSelectedFile}
      selectedFile={selectedFile}
    />
  )
}

StockageFilesTree.propTypes = {
  data: PropTypes.object.isRequired
}

export default StockageFilesTree

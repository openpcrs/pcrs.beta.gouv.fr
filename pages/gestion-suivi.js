import {useState, useContext, useEffect} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/router'

import AuthentificationContext from '@/contexts/authentification-token.js'

import Page from '@/layouts/main.js'

import AdminAuthentificationModal from '@/components/suivi-form/authentification/admin-authentification-modal.js'
import Porteurs from '@/components/gestion-admin/porteurs.js'
import Changes from '@/components/gestion-admin/changes.js'
import Administrateurs from '@/components/gestion-admin/administrateurs.js'
import Tab from '@/components/ui/tab.js'

const Admin = () => {
  const router = useRouter()
  const {userRole, token, isTokenRecovering} = useContext(AuthentificationContext)

  const [activeTab, setActiveTab] = useState('porteurs')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isAuthentified = Boolean(token && userRole === 'admin')

  useEffect(() => {
    if (!isTokenRecovering && !isAuthentified) {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
  }, [isAuthentified, isTokenRecovering])

  return (
    <Page>
      {isModalOpen && (
        <AdminAuthentificationModal
          handleIsModalOpen={setIsModalOpen}
          onModalClose={() => isAuthentified ? setIsModalOpen(false) : router.push('/suivi-pcrs')}
        />
      )}

      <div className='page-header fr-my-5w'>
        <Image
          src='/images/illustrations/admin-illustration.svg'
          height={200}
          width={200}
          alt=''
          aria-hidden='true'
        />
        <h2 className='fr-mt-5w fr-mb-0'>Gestion des suivis</h2>
      </div>
      <div className='fr-px-md-1w'>
        <h3 className='fr-h6 fr-mb-6w'><span className='fr-icon-file-text-line' aria-hidden='true' /> Liste des administrateurs et porteurs de projets</h3>

        <Tab
          handleActiveTab={setActiveTab}
          activeTab={activeTab}
          tabs={[
            {value: 'porteurs', label: 'Porteur de projets'},
            {value: 'admin', label: 'Administrateurs'},
            {value: 'changes', label: 'Projets édités récemment'}
          ]}
        >
          <>
            {activeTab === 'porteurs' && <Porteurs />}
            {activeTab === 'admin' && <Administrateurs />}
            {activeTab === 'changes' && <Changes token={token} />}
          </>
        </Tab>
      </div>

      <style jsx>{`
        .page-header {
          text-align: center;
        }
      `}</style>
    </Page>
  )
}

export default Admin

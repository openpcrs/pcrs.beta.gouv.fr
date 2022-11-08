import {useState} from 'react'

import Section from '@/components/section'

const PcrsIframeMap = () => {
  const [selectedTab, setSelectedTab] = useState('avancement')

  return (
    <Section
      title={selectedTab === 'avancement' ? (
        'Carte d’avancement des PCRS'
      ) : (
        'Carte des types de PCRS'
      )}
      background='dark'
    >
      <div className='fr-tabs'>
        <ul
          className='fr-tabs__list'
          role='tablist'
          aria-label='Cartes PCRS'
        >
          <li role='presentation'>
            <button
              type='button'
              className='fr-tabs__tab fr-icon-checkbox-line fr-tabs__tab--icon-left'
              tabIndex='0'
              role='tab'
              aria-selected={selectedTab === 'avancement'}
              onClick={() => setSelectedTab('avancement')}
            >
              Avancement
            </button>
          </li>
          <li role='presentation'>
            <button
              type='button'
              className='fr-tabs__tab fr-icon-checkbox-line fr-tabs__tab--icon-left'
              tabIndex='-1'
              role='tab'
              aria-selected={selectedTab === 'types'}
              onClick={() => setSelectedTab('types')}
            >
              Types
            </button>
          </li>
        </ul>

        <div
          className={`
            iframe-container
            fr-tabs__panel
            ${selectedTab === 'avancement' ? 'fr-tabs__panel--selected' : ''}
          `}
          role='tabpanel'
          aria-labelledby='tabpanel-404'
          tabIndex='0'
        >
          <iframe
            sandbox
            src='https://macarte.ign.fr/carte-narrative/voir/onglet/30a17e7e0f03f8db2189793b390e870a/Carte%20d'
            title='Carte d’avancement des PCRS'
            className='iframe'
          />
        </div>
        <div
          className={`
            iframe-container
            fr-tabs__panel
            ${selectedTab === 'types' ? 'fr-tabs__panel--selected' : ''}
          `}
          role='tabpanel'
          aria-labelledby='tabpanel-405'
          tabIndex='0'
        >
          <iframe
            sandbox
            src='https://macarte.ign.fr/carte-narrative/voir/onglet/ee60257d0ea224572eba04b4a8b2b4ae/Carte%20des%20types%20de%20PCRS'
            title='Carte d’avancement des PCRS'
            className='iframe'
          />
        </div>
        <style jsx>{`
          .iframe-container {
            position: relative;
            overflow: hidden;
            width: 100%;
            padding-top: 55%;
          }

          .iframe {
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </Section>
  )
}

export default PcrsIframeMap


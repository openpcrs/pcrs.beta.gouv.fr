import {useState, useEffect, useRef, useCallback} from 'react'

import {debounce} from 'lodash-es'
import Page from '@/layouts/main.js'

import Section from '@/components/section.js'
import SelectInput from '@/components/select-input.js'
import AutocompleteInput from '@/components/autocomplete-input.js'
import {getCommuneByCode, getPerimetersByName} from '@/lib/decoupage-administratif-api.js'

const API_BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://pcrs.beta.gouv.fr'

function formatNumber(number, maximumFractionDigits = 0) {
  return number.toLocaleString('fr', {maximumFractionDigits})
}

const Calculatrice = () => {
  const [showCalculator, setShowCalculator] = useState()
  const [foundPerimetres, setFoundPerimetres] = useState([])
  const [searchValue, setSearchValue] = useState()
  const [territoryType, setTerritoryType] = useState()
  const [areas, setAreas] = useState([])
  const [totalSurface, setTotalSurface] = useState()
  const [sizeInGigas, setSizeInGigas] = useState()
  const [compression, setCompression] = useState('GeoTIFF/Non-compressé')
  const [marge, setMarge] = useState('10%')
  const [margeValue, setMargeValue] = useState(0.1)
  const [pixelDensity, setPixelDensity] = useState(5)

  function getMargeValue(label) {
    const margeValues = [
      {label: '10%', value: 0.1},
      {label: '15%', value: 0.15},
      {label: '20%', value: 0.2}
    ]

    return margeValues.find(v => v.label === label).value
  }

  const fetchPerimetres = useRef(debounce(async (nom, type, signal) => {
    const inputToNumber = Number.parseInt(nom, 10)
    const isInputNumber = !Number.isNaN(inputToNumber)

    try {
      if (isInputNumber && type === 'commune') {
        const perimetre = await getCommuneByCode(nom, signal)
        setFoundPerimetres([perimetre])
      } else {
        const perimetres = await getPerimetersByName(nom, type, signal)
        // Get a collection
        setFoundPerimetres(perimetres)
      }
    } catch {
      if (!signal.aborted) {
        setFoundPerimetres([])
      }
    }
  }, 300))

  const handleCalculatorChange = tab => {
    setShowCalculator(tab)
    setSizeInGigas()
    setAreas([])
  }

  const handleSelect = debounce(async ({code}) => {
    const foundPerimetreName = foundPerimetres.find(result => result.code === code).nom

    try {
      const response = await fetch(`${API_BASE_URL}/calculator/territory-area/${territoryType}s:${code}`)
      const area = await response.json()

      if (!areas.some(area => area.code === code)) {
        setAreas([...areas, {surface: area.surface, nom: foundPerimetreName, code}])
      }
    } catch (error) {
      throw new Error(error)
    }

    setSearchValue('')
  }, 300)

  const handleRemoveTerritory = useCallback(territoryName => {
    const updatedArray = areas.filter(a => a.nom !== territoryName)

    setAreas(updatedArray)

    if (updatedArray.length === 0) {
      setSizeInGigas(null)
      setTotalSurface(null)
    }
  }, [areas])

  const handleSurfaceToSize = useCallback(async totalSurface => {
    const formatCompression = [
      {label: 'GeoTIFF/Non-compressé', value: 1},
      {label: 'GeoTIFF/LZW ', value: 0.6},
      {label: 'GeoTIFF/Deflate', value: 0.55},
      {label: 'JPEG2000/Lossless', value: 0.55},
      {label: 'JPEG2000/Lossy', value: 0.25}
    ]

    try {
      const response = await fetch(`${API_BASE_URL}/calculator/area`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          area: totalSurface,
          compression: formatCompression.find(f => f.label === compression).value,
          marge: margeValue,
          resolution: Number.parseInt(pixelDensity, 10)
        })
      })

      const areaToGigas = await response.json()

      setSizeInGigas(areaToGigas)
    } catch (error) {
      throw new Error(error)
    }
  }, [compression, pixelDensity, margeValue])

  useEffect(() => {
    if (totalSurface) {
      handleSurfaceToSize(totalSurface)
    }
  }, [totalSurface, handleSurfaceToSize])

  useEffect(() => {
    if (!searchValue || searchValue.length < 2) {
      setFoundPerimetres([])
      return
    }

    const ac = new AbortController()
    fetchPerimetres.current(searchValue, territoryType, ac.signal)

    return () => {
      ac.abort()
    }
  }, [searchValue, territoryType, fetchPerimetres])

  useEffect(() => {
    if (areas.length > 0) {
      let result = 0

      for (const area of areas) {
        result += Number.parseFloat(area.surface)
      }

      setTotalSurface(result)
    }
  }, [areas])

  return (
    <Page title='Calculateur de coups' description='Calculez les coups d’hébergement de votre livrable'>
      <h1 className='fr-m-4w'>Calculateur de frais d’hébergement des données</h1>
      <Section>
        <div className='fr-m-3v fr-grid-row--left'>
          <span className='fr-col-lg-3 fr-col-12 fr-m-1v'>Estimation à partir : </span>
          <button
            type='button'
            className={`fr-btn fr-btn${showCalculator === 'file' && '--secondary'} fr-btn--sm fr-m-1v fr-col-lg-3 fr-col-12`}
            onClick={() => handleCalculatorChange('territory')}
          >
            d’un territoire
          </button>
          <button
            type='button'
            className={`fr-btn fr-btn${showCalculator === 'territory' && '--secondary'} fr-btn--sm fr-m-1v fr-col-lg-3 fr-col-12`}
            onClick={() => handleCalculatorChange('file')}
          >
            de la taille d’un fichier
          </button>
        </div>
        <div
          className='fr-container--fluid'
          style={{
            border: '1px solid grey',
            borderRadius: '10px',
            minHeight: '500px'
          }}
        >

          {showCalculator === 'territory' && (
            <div className='fr-grid-row'>
              <div className='fr-col-lg-6 fr-col-12 fr-p-3w'>
                <SelectInput
                  label='Type'
                  value={territoryType}
                  description='Le type de territoire à ajouter'
                  options={[
                    {label: 'EPCI', value: 'epci'},
                    {label: 'Commune', value: 'commune'},
                    {label: 'Département', value: 'departement'}
                  ]}
                  onValueChange={e => setTerritoryType(e.target.value)}
                />
              </div>
              <div className='fr-col-lg-6 fr-col-12 fr-p-3w'>
                {territoryType && (
                  <AutocompleteInput
                    isRequired
                    label={`Nom ${territoryType === 'commune' ? 'ou code' : ''}`}
                    value={searchValue}
                    description={`Recherche par nom ${territoryType === 'commune' ? ' ou code INSEE' : ''} du territoire`}
                    ariaLabel={`Rechercher par nom ${territoryType === 'commune' ? 'ou code INSEE' : ''} du territoire`}
                    results={foundPerimetres}
                    renderItem={({nom, code}) => `${nom} - ${code}`}
                    onInputChange={setSearchValue}
                    onSelectValue={item => {
                      handleSelect(item)
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {showCalculator === 'file' && (
            <div className='fr-col-12 fr-p-3w'>
              <i>Ce calculateur arrivera prochainement</i>
            </div>
          )}

          <div>
            {areas.length > 0 && (
              <div
                className='fr-grid-row'
                style={{
                  display: 'flex',
                  justifyContent: 'space-around'
                }}
              >
                <div className='fr-col-lg-6 fr-col-12 fr-p-6v'>
                  <div className='fr-pb-3v'>
                    <b>Liste des territoires :</b>
                  </div>
                  {areas.map(area => (
                    <li
                      key={area.code}
                      className='fr-grid-row fr-pb-2v'
                    >
                      <div className='fr-col-lg-6 fr-col-12'>
                        <span>{area.nom} ({area.code})</span>
                      </div>
                      <div className='fr-col-lg-6 fr-col-12' style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span> → </span>
                        <span>Surface: <b>{formatNumber(area.surface)}</b> km2</span>
                        <button
                          type='button'
                          className='fr-btn fr-btn--sm fr-btn--secondary fr-icon-delete-line fr-mx-2w'
                          onClick={() => handleRemoveTerritory(area.nom)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </div>
                {sizeInGigas && (
                  <div className='fr-col-lg-6 fr-col-12 fr-p-6v'>
                    <div className='fr-pb-3v'>
                      <b>Résumé:</b>
                    </div>
                    <div>
                      <small>
                        <i>
                          <div>Superficie totale: {formatNumber(totalSurface)} km2</div>
                          <div>Marge de construction du tuilage: {marge}</div>
                          <div>Nombre de pixels: {formatNumber(sizeInGigas.numberOfPixels / 1_000_000)} millions</div>
                          <div>Nombre de pixels en incluant la marge: {formatNumber(sizeInGigas.numberOfPixelsWithMarge / 1_000_000)} millions</div>
                          <div>Format sélectionné: {compression}</div>
                          <div>Résultat: {formatNumber(sizeInGigas.sizeCompressed * 0.01)} € HT / mois</div>
                        </i>
                      </small>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='fr-p-5v'>
            {totalSurface && sizeInGigas && (
              <>
                <hr />
                <p>
                  <i className='fr-px-2v' style={{backgroundColor: '#cacafb', borderRadius: '3px'}}>
                    <small>(Les champs sur fond bleu sont éditables)</small>
                  </i>
                </p>
                <p>
                  <span>Les territoires renseignés ont une superficie totale de <b>{formatNumber(totalSurface)} km2</b>.</span>
                </p>
                <p>
                  <span>En intégrant une marge de </span>
                  <select
                    className='editable-text'
                    onChange={e => {
                      setMarge(e.target.value)
                      setMargeValue(getMargeValue(e.target.value))
                    }}
                  >
                    <option value='10%'>10%</option>
                    <option value='15%'>15%</option>
                    <option value='20%'>20%</option>
                  </select>
                  <span> (liée au dallage des prises de vue), une orthophotographie de résolution </span>
                  <select
                    className='editable-text'
                    onChange={e => setPixelDensity(e.target.value)}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                  <span>cm comportera environ <b>{formatNumber(sizeInGigas.numberOfPixelsWithMarge / 1_000_000)}</b> millions de pixels.</span>
                </p>
                <p>
                  <b>{formatNumber(sizeInGigas.numberOfPixelsWithMarge / 1_000_000)}</b> millions de pixels non compressés sur 3 canaux de couleurs 8 bits ont un poids total de <b>{formatNumber(sizeInGigas.sizeUncompressed)} Go</b>
                </p>
                <p>
                  <span>En appliquant une compression </span>
                  <select
                    className='editable-text'
                    onChange={e => setCompression(e.target.value)}
                  >
                    <option value='GeoTIFF/Non-compressé'>GeoTIFF/Non-compressé</option>
                    <option value='JPEG2000/Lossy'>JPEG2000/Lossy</option>
                    <option value='JPEG2000/Lossless'>JPEG2000/Lossless</option>
                    <option value='GeoTIFF/LZW'>GeoTIFF/LZW</option>
                    <option value='GeoTIFF/Deflate'>GeoTIFF/Deflate</option>
                  </select>
                  <span>, on obtient des fichiers d’un poids total de <b>{formatNumber(sizeInGigas.sizeCompressed)} Go</b>.</span>
                </p>
                <p>L’hébergement de ce volume de fichier chez un hébergeur moyen (0,01€/Go/mois) revient à <b>{formatNumber(sizeInGigas.sizeCompressed * 0.01)}</b> euros HT par mois.</p>
                <div>
                  <i><small><a href='https://it.nc.gov/documents/files/understanding-compression-geospatial-raster-imagery/download?attachment'>Source des taux de compression</a></small></i>
                </div>
              </>
            )}
          </div>
        </div>

      </Section>
      <style jsx>{`
        .editable-text {
          background-color: #cacafb;
          text-align: center;
          padding: 0 5px;
          margin: 0 5px;
          border-radius: 3px;
        }
      `}</style>
    </Page>
  )
}

export default Calculatrice
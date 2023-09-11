function computePixelDensityPerKm2(resolutionInCm) {
  const numPixelsPerKm = 100_000 / resolutionInCm
  return numPixelsPerKm * numPixelsPerKm
}

export function areaToPixels(areaInMm, pixelDensity) {
  const areaInKm2 = areaInMm / 1_000_000

  return pixelDensity * areaInKm2
}

export function pixelToGigaOctets(numberOfPixels) {
  // Number of pixels * 3 colors divided to get gigas
  return (numberOfPixels * 3) / 1_000_000_000
}

function addPercent(value, percent) {
  return value + (value * percent)
}

export function areaWeigthInGigas(area, compression, resolution, marge) {
  const pxDensity = computePixelDensityPerKm2(resolution)
  const nbPixels = areaToPixels(area, pxDensity)
  const nbPixelsWithMarge = addPercent(nbPixels, marge)
  const sizeInGigas = pixelToGigaOctets(nbPixelsWithMarge)
  const compressedSize = sizeInGigas * (compression || 1)

  return {
    numberOfPixels: nbPixels,
    numberOfPixelsWithMarge: nbPixelsWithMarge,
    sizeUncompressed: sizeInGigas,
    sizeCompressed: compressedSize
  }
}


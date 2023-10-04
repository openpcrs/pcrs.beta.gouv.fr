function computePixelDensityPerKm2(resolutionInCm) {
  const numberOfPixelsPerKm = 100_000 / resolutionInCm
  return numberOfPixelsPerKm * numberOfPixelsPerKm
}

function areaToPixels(area, pixelDensity) {
  return pixelDensity * area
}

function pixelsToGigaOctets(numberOfPixels) {
  // Number of pixels * 3 colors divided to get gigas
  return (numberOfPixels * 3) / 1_000_000_000
}

function addPercent(value, percent) {
  return value + (value * percent)
}

export function areaSizeToGigas(area, compression, resolution, margin) {
  const pixelDensity = computePixelDensityPerKm2(resolution)
  const numberOfPixels = areaToPixels(area, pixelDensity)
  const numberOfPixelsWithMargin = addPercent(numberOfPixels, margin)
  const sizeUncompressed = pixelsToGigaOctets(numberOfPixelsWithMargin)
  const sizeCompressed = sizeUncompressed * (compression || 1)

  return {
    numberOfPixels,
    numberOfPixelsWithMargin,
    sizeUncompressed,
    sizeCompressed
  }
}


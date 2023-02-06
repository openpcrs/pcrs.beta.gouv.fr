import process from 'node:process'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = []

if (process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE) {
  imagesDomains.push(process.env.NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE)
}

export default withBundleAnalyzer({
  images: {
    domains: imagesDomains
  }
})

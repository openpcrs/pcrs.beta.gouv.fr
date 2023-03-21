import process from 'node:process'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = []

if (process.env.NEXT_PUBLIC_GHOST_URL) {
  const url = new URL(process.env.NEXT_PUBLIC_GHOST_URL)
  imagesDomains.push(url.hostname)
}

export default withBundleAnalyzer({
  images: {
    domains: imagesDomains
  }
})

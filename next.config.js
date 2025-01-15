import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const imagesDomains = []

if (process.env.NEXT_PUBLIC_IMAGES_DOMAIN) {
  const url = new URL(process.env.NEXT_PUBLIC_IMAGES_DOMAIN)
  imagesDomains.push(url.hostname)
}

export default withBundleAnalyzer({
  images: {
    domains: imagesDomains
  }
})

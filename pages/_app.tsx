import '../styles/index.css'
import '@reach/dialog/styles.css'
import { Layout } from 'components/Layout'

function MyApp({ Component, pageProps }) {
  const mapPos = {
    lat: 41.65391,
    lng: -71.2433,
  }

  return (
    <Layout mapPos={mapPos}>
      <Component mapPos={mapPos} {...pageProps} />
    </Layout>
  )
}

export default MyApp

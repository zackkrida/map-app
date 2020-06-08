import '../styles/index.css'
import '@reach/dialog/styles.css'
import { Layout } from 'components/Layout'

function MyApp({ Component, pageProps }) {
  const mapPos = {
    lat: 41.67391,
    lng: -70.9033,
  }

  return (
    <Layout mapPos={mapPos}>
      <Component mapPos={mapPos} {...pageProps} />
    </Layout>
  )
}

export default MyApp

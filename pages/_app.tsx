import '../styles/index.css'
import '@reach/dialog/styles.css'
import '@reach/combobox/styles.css'
import '@reach/menu-button/styles.css'

import { Layout } from 'components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp

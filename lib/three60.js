// Connect to ImproveIt360 (whitelabeled Salesforce for Home Remodelers)
import jsforce from 'jsforce'

/**
 * Connect to Salesforce Bulk API (aka ImproveIt360).
 */
export async function connectTo360() {
  const sf = new jsforce.Connection({ loginUrl: config.url })
  await sf.login(config.email, config.pass + config.token)

  return sf
}

const config = {
  url: process.env['360_URL'],
  email: process.env['360_EMAIL'],
  pass: process.env['360_PASS'],
  token: process.env['360_SECURITY_TOKEN'],
}

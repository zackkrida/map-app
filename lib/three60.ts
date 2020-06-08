import jsforce from 'jsforce'

/**
 * Connect to Salesforce Bulk API (aka ImproveIt360).
 * @docs API Reference: https://improveit360-3562.cloudforce.com/01I1I000001rrvm?setupid=CustomObjects
 */
export async function connectTo360() {
  const sf = new jsforce.Connection({ loginUrl: config.url })
  await sf.login(config.email, config.pass + config.token)

  return sf
}

const config = {
  url: process.env.THREE_SIXTY_URL,
  email: process.env.THREE_SIXTY_EMAIL,
  pass: process.env.THREE_SIXTY_PASS,
  token: process.env.THREE_SIXTY_SECURITY_TOKEN,
}

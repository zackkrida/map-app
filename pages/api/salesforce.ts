import jsforce from 'jsforce'

export default async function Salesforce(_, res) {
  try {
    const sf = new jsforce.Connection({
      loginUrl: 'https://improveit360-3562.cloudforce.com/',
    })
    const userInfo = await sf.login(
      process.env['360_EMAIL'],
      process.env['360_PASS'] + process.env['360_SECURITY_TOKEN']
    )
    // https://improveit360-3562.cloudforce.com/01I1I000001rrvm?setupid=CustomObjects
    const queryRes = await sf.query(
      'SELECT Name, i360__Image__c, Roofing_Product_Color__c, i360__Prospect__c FROM i360__Project__c'
    )
    res.json({ userInfo, queryRes })
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

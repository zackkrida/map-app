import { connectTo360 } from 'lib/three60'

export default async function Salesforce(_, res) {
  try {
    const t60 = await connectTo360()
    // https://improveit360-3562.cloudforce.com/01I1I000001rrvm?setupid=CustomObjects

    // prettier-ignore
    const projects = await t60
      .sobject('i360__Project__c')
      .select(['*'])
      .limit(200)

    res.json(projects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

import { connectTo360 } from 'lib/three60'

/**
 * 1. Pull down all Jobs in 360 without lat, lng attributes
 * 2. Get the coordinates using the Google geolocation API
 * 3. Push them back into 360
 */
export default async function Geocode(_, res) {
  try {
    const t60 = await connectTo360()
    // https://improveit360-3562.cloudforce.com/01I1I000001rrvm?setupid=CustomObjects

    // prettier-ignore
    const projects = await t60
      .sobject('i360__Project__c')
      .select(['*'])
      .where({Latitude__c: null, Long__c: null})
      .limit(1)

    res.json(projects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

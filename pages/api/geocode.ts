import { connectTo360 } from 'lib/three60'
import { Client, Status } from '@googlemaps/google-maps-services-js'
import { config } from 'process'

/**
 * 1. Pull down all Jobs in 360 without lat, lng attributes
 * 2. Get the coordinates using the Google geolocation API
 * 3. Push them back into 360
 */
export default async function Geocode(_, res) {
  try {
    // https://improveit360-3562.cloudforce.com/01I1I000001rrvm?setupid=CustomObjects
    const mapClient = new Client({})
    const geolocate = address =>
      mapClient.geocode({
        data: {},
        params: { key: process.env.GOOGLE_GEOCODING_API_KEY, address },
      })
    const t60 = await connectTo360()

    // prettier-ignore
    const projects = await t60
      .sobject('i360__Project__c')
      .select(['*'])
      .where({Latitude__c: null, Long__c: null})
      .limit(1)

    // const geo = await geolocate(buildAddressString(projects[0]))
    // const result = geo.data.results[0].geometry.location

    res.json({ projects })
  } catch (error) {
    console.error(error.message)
    res.json({ error: true, message: error.message })
  }
}

const buildAddressString = project =>
  `${project.i360__Customer_Street__c}${project.i360__Customer_City__c}, ${project.i360__Customer_State__c} ${project.i360__Customer_Zip__c}`

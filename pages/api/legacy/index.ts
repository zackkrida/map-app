import { connectTo360 } from 'lib/three60'
const { SfDate } = require('jsforce')

export default async function Jobs(req, res) {
  try {
    const t60 = await connectTo360()
    const legacyProjects = await t60
      .sobject('i360__Prospect__c')
      .select([
        // '*',
        'Id',
        'i360__Correspondence_Name__c',
        'i360__Longitude__c',
        'i360__Latitude__c',
        'Legacy_Sold_On_Date__c',
        // 'i360__Appointment_Address__c',
        // 'i360__Appointment_City__c',
        // 'i360__Appointment_State__c',
        // 'i360__Appointment_Zip__c',
        // 'i360__Completed_On__c',
        // 'i360__Job_Type__c',
        // 'Long__c',
        // 'Latitude__c',
      ])
      .where({ Legacy_Sold_On_Date__c: { $ne: null } })
      .execute({ autoFetch: true })
      .then(res =>
        res.map(i => {
          ;(i as any).legacy = true
          return i
        })
      )

    res.json(legacyProjects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

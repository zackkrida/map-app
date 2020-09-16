import { connectTo360 } from 'lib/three60'
const { SfDate } = require('jsforce')

export default async function Jobs(req, res) {
  // const filters: any = {}
  // const {
  //   q = '',
  //   type = 'zip',
  //   year = 'any',
  //   status = 'any',
  //   jobType = 'any',
  // } = req.body

  // console.info({ type })

  // if (type === 'zip') {
  //   filters.i360__Appointment_Zip__c = { $eq: q }
  // }
  // if (type === 'name') {
  //   filters.Name = { $like: `%${q}%` }
  // }
  // if (type === 'city') {
  //   filters.i360__Customer_City__c = { $like: `%${q}%` }
  // }
  // if (type === 'streetAddress') {
  //   filters.i360__Customer_Street__c = { $like: `%${q}%` }
  // }
  // if (year !== 'any') {
  //   let createdDate = SfDate.toDateTimeLiteral(new Date(year))
  //   filters.CreatedDate = {
  //     $gt: createdDate,
  //   }
  // }
  // if (status !== 'any') {
  //   if (status === 'in-progress') {
  //     filters.i360__Completed_On__c = { $eq: null }
  //   } else {
  //     filters.i360__Completed_On__c = { $ne: null }
  //   }
  // }

  // if (jobType !== 'any') {
  //   filters.i360__Job_Type_formatted__c = { $like: `%${jobType}%` }
  // }

  try {
    // console.info(filters)

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
    // .execute({ autoFetch: true })

    res.json(legacyProjects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

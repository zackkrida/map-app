import { connectTo360 } from 'lib/three60'
const { SfDate } = require('jsforce')

export default async function Projects(req, res) {
  const filters: any = {}
  const legacyFilters: any = {}
  const {
    q = '',
    type = 'zip',
    year = 'any',
    status = 'any',
    jobType = 'any',
    productColor = 'any',
  } = req.body
  let includeLegacy: boolean = status === 'any' || status === 'legacy'

  if (q) {
    if (type === 'zip') {
      filters.i360__Appointment_Zip__c = { $eq: q }
      includeLegacy = false
    }
    if (type === 'name') {
      filters.Name = { $like: `%${q}%` }
      legacyFilters.i360__Correspondence_Name__c = { $like: `%${q}%` }
    }
    if (type === 'city') {
      filters.i360__Customer_City__c = { $like: `%${q}%` }
      includeLegacy = false
    }
    if (type === 'streetAddress') {
      filters.i360__Customer_Street__c = { $like: `%${q}%` }
      includeLegacy = false
    }
  }

  if (has(year)) {
    let createdDate = SfDate.toDateTimeLiteral(new Date(year))
    filters.CreatedDate = { $gt: createdDate }
    legacyFilters.Legacy_Sold_On_Date__c = { $gt: createdDate }
  } else {
    legacyFilters.Legacy_Sold_On_Date__c = { $ne: null }
  }

  if (has(status)) {
    if (status === 'in-progress') {
      includeLegacy = false
      filters.i360__Completed_On__c = { $eq: null }
    } else {
      filters.i360__Completed_On__c = { $ne: null }
    }
  }

  if (has(jobType)) {
    filters.i360__Job_Type_formatted__c = { $like: `%${jobType}%` }
    includeLegacy = false
  }

  if (has(productColor)) {
    filters.$or = [
      { Roofing_Product_Color__c: { $like: `%${productColor}%` } },
      { Siding_Product_Color__c: { $like: `%${productColor}%` } },
      { Trim_Color__c: { $like: `%${productColor}%` } },
    ]
    includeLegacy = false
  }

  filters.i360__Appointment_State__c = { $in: ['RI', 'MA', 'CT'] }
  filters.i360__Appointment_Latitude__c = { $gt: 40, $lt: 43 }
  filters.i360__Appointment_Longitude__c = { $lt: -69, $gt: -72 }

  legacyFilters.i360__Latitude__c = { $gt: 40, $lt: 43 }
  legacyFilters.i360__Longitude__c = { $lt: -69, $gt: -72 }

  try {
    const t60 = await connectTo360()
    let projects: Partial<Project>[] = []
    let legacyProjects: Partial<LegacyProject>[] = []

    if (status !== 'legacy') {
      projects = await t60
        .sobject<Project>('i360__Project__c')
        .select([
          'Id',
          'i360__Correspondence_Name__c',
          'i360__Appointment_Address__c',
          'i360__Appointment_City__c',
          'i360__Appointment_State__c',
          'i360__Appointment_Zip__c',
          'i360__Appointment_Latitude__c',
          'i360__Appointment_Longitude__c',
          'i360__Completed_On__c',
          'i360__Job_Type__c',
          'Long__c',
          'Latitude__c',
        ])
        .where(filters)
        .execute({ autoFetch: true })
        .then(res =>
          res.map(i => {
            i.legacy = false
            return i
          })
        )
    }

    if (includeLegacy) {
      legacyProjects = await t60
        .sobject<LegacyProject>('i360__Prospect__c')
        .select([
          'Id',
          'i360__Home_Address__c',
          'i360__Home_City__c',
          'i360__Home_State__c',
          'i360__Home_Zip_Postal_Code__c',
          'i360__Correspondence_Name__c',
          'i360__Longitude__c',
          'i360__Latitude__c',
          'Legacy_Sold_On_Date__c',
        ])
        .where(legacyFilters)
        .execute({ autoFetch: true })
        .then(res =>
          res.map(i => {
            i.legacy = true
            return i
          })
        )
    }

    console.log(legacyProjects[0])

    res.json([...projects, ...legacyProjects])
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

const has = value => value !== 'any'

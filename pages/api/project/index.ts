import { connectTo360 } from 'lib/three60'
import { withAuth } from 'lib/session'
const { SfDate } = require('jsforce')

async function Projects(req, res) {
  if (!req.session.get('user')) {
    res.json({ error: true, message: 'User is not authenticated' })
    return
  }

  const filters: Partial<{ [key in keyof ExtendedProject | '$or']: {} }> = {}
  const legacyFilters: Partial<
    { [key in keyof ExtendedLegacyProject]: {} }
  > = {}
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
      legacyFilters.i360__Home_Zip_Postal_Code__c = { $eq: q }
    }
    if (type === 'name') {
      filters.i360__Correspondence_Name__c = { $like: `%${q}%` }
      legacyFilters.i360__Correspondence_Name__c = { $like: `%${q}%` }
    }
    if (type === 'city') {
      filters.i360__Appointment_City__c = { $like: `%${q}%` }
      legacyFilters.i360__Home_City__c = { $like: `%${q}%` }
    }
    if (type === 'streetAddress') {
      filters.i360__Appointment_Address__c = { $like: `%${q}%` }
      legacyFilters.i360__Home_Address__c = { $like: `%${q}%` }
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

  filters.i360__Status__c = { $ne: 'Canceled' }
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
          ProjectFields.id,
          ProjectFields.correspondenceName,
          ProjectFields.appointmentAddress,
          ProjectFields.appointmentCity,
          ProjectFields.appointmentState,
          ProjectFields.appointmentZip,
          ProjectFields.customLatitude,
          ProjectFields.customLongitude,
          ProjectFields.completedOn,
          ProjectFields.jobType,
          ProjectFields.appointmentLatitude,
          ProjectFields.appointmentLongitude,
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
          ProjectFields.id,
          ProjectFields.homeAddress,
          ProjectFields.homeCity,
          ProjectFields.homeState,
          ProjectFields.homeZipPostalCode,
          ProjectFields.correspondenceName,
          ProjectFields.latitude,
          ProjectFields.longitude,
          ProjectFields.legacySoldOnDate,
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

    res.json([...projects, ...legacyProjects])
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

const has = value => value !== 'any'

export default withAuth(Projects)

import { withAuth } from 'lib/session'
import { connectTo360 } from 'lib/three60'
import { ExtendedProject, Project, ProjectFields } from 'types/types'

const { SfDate } = require('jsforce')

async function Projects(req, res) {
  if (!req.session.get('user')) {
    res.json({ error: true, message: 'User is not authenticated' })
    return
  }

  const filters: Partial<{ [key in keyof ExtendedProject | '$or']: {} }> = {}
  const {
    q = '',
    type = 'zip',
    year = 'any',
    status = 'any',
    jobType = 'any',
    productColor = 'any',
  } = req.body

  if (q) {
    if (type === 'zip') {
      filters.i360__Appointment_Zip__c = { $eq: q }
    }
    if (type === 'name') {
      filters.i360__Correspondence_Name__c = { $like: `%${q}%` }
    }
    if (type === 'city') {
      filters.i360__Appointment_City__c = { $like: `%${q}%` }
    }
    if (type === 'streetAddress') {
      filters.i360__Appointment_Address__c = { $like: `%${q}%` }
    }
  }

  if (has(year)) {
    let createdDate = SfDate.toDateTimeLiteral(new Date(year))
    filters.CreatedDate = { $gt: createdDate }
  } else {
  }

  if (has(status)) {
    if (status === 'in-progress') {
      filters.i360__Completed_On__c = { $eq: null }
    } else {
      filters.i360__Completed_On__c = { $ne: null }
    }
  }

  if (has(jobType)) {
    filters.i360__Job_Type_formatted__c = { $like: `%${jobType}%` }
  }

  if (has(productColor)) {
    filters.$or = [
      { Roofing_Product_Color__c: { $like: `%${productColor}%` } },
      { Siding_Product_Color__c: { $like: `%${productColor}%` } },
      { Trim_Color__c: { $like: `%${productColor}%` } },
    ]
  }

  filters.i360__Status__c = { $ne: 'Canceled' }
  filters.i360__Appointment_State__c = { $in: ['RI', 'MA', 'CT'] }
  filters.i360__Appointment_Latitude__c = { $gt: 40, $lt: 43 }
  filters.i360__Appointment_Longitude__c = { $lt: -69, $gt: -72 }

  try {
    const t60 = await connectTo360()
    let projects: Partial<Project>[] = []

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

    res.json(projects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

const has = value => value !== 'any'

export default withAuth(Projects)

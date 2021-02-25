import { API_RESULTS_LIMIT, connectTo360 } from 'lib/three60'
import { withAuth } from 'lib/session'
import {
  ExtendedProject,
  ExtendedLegacyProject,
  Project,
  LegacyProject,
  ProjectFields,
} from 'types/types'
const { SfDate } = require('jsforce')

async function LegacyProjects(req, res) {
  if (!req.session.get('user')) {
    res.json({ error: true, message: 'User is not authenticated' })
    return
  }

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
      legacyFilters.i360__Home_Zip_Postal_Code__c = { $eq: q }
    }
    if (type === 'name') {
      legacyFilters.i360__Correspondence_Name__c = { $like: `%${q}%` }
    }
    if (type === 'city') {
      legacyFilters.i360__Home_City__c = { $like: `%${q}%` }
    }
    if (type === 'streetAddress') {
      legacyFilters.i360__Home_Address__c = { $like: `%${q}%` }
    }
  }

  if (has(year)) {
    let createdDate = SfDate.toDateTimeLiteral(new Date(year))
    legacyFilters.Legacy_Sold_On_Date__c = { $gt: createdDate }
  } else {
    legacyFilters.Legacy_Sold_On_Date__c = { $ne: null }
  }

  if (has(jobType)) {
    includeLegacy = false
  }

  if (has(productColor)) {
    includeLegacy = false
  }

  legacyFilters.i360__Latitude__c = { $gt: 40, $lt: 43 }
  legacyFilters.i360__Longitude__c = { $lt: -69, $gt: -72 }

  try {
    const t60 = await connectTo360()
    let legacyProjects: Partial<LegacyProject>[] = []

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
          ProjectFields.legacyInterestedIn,
        ])
        .where(legacyFilters)
        .limit(7000)
        .execute({ autoFetch: true })
        .then(res =>
          res.map(i => {
            i.legacy = true
            return i
          })
        )
    }

    res.json(legacyProjects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

const has = value => value !== 'any'

export default withAuth(LegacyProjects)

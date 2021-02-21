import { withAuth } from 'lib/session'
import { API_RESULTS_LIMIT, connectTo360 } from 'lib/three60'
import {
  ThreeSixty,
  LeadSource,
  LeadSourceFields,
  LegacyProject,
  ProjectFields,
} from 'types/types'

/**
 * Populate a new legacy_interested_in field from
 * the Lead Source interested_in field of each legacy project
 * (which is actually a prospect in 360)
 */
const syncLegacyJobs = async (req, res) => {
  if (!req.session.get('user')) {
    res.json({ error: true, message: 'User is not authenticated' })
    return
  }

  try {
    const t60 = await connectTo360()

    const legacyProjects = await t60
      .sobject<LegacyProject>(ThreeSixty.LegacyProject)
      .select([
        ProjectFields.id,
        ProjectFields.correspondenceName,
        ProjectFields.longitude,
        ProjectFields.latitude,
        ProjectFields.legacySoldOnDate,
        ProjectFields.legacyInterestedIn,
      ])
      .where({
        [ProjectFields.legacySoldOnDate]: { $ne: null },
        [ProjectFields.legacyInterestedIn]: { $eq: null },
      })
      .limit(API_RESULTS_LIMIT)
      .execute({ autoFetch: true })

    const leadSources = await t60
      .sobject<LeadSource>(ThreeSixty.LeadSource)
      .select([
        LeadSourceFields.id,
        LeadSourceFields.prospectId,
        LeadSourceFields.interestedIn,
      ])
      .limit(API_RESULTS_LIMIT)
      .where({
        [LeadSourceFields.prospectId]: {
          $in: legacyProjects.map(i => i[ProjectFields.id]),
        },
      })
      .execute({ autoFetch: true })

    const leadSourcesLookup = leadSources.reduce((obj, lead) => {
      obj[lead[LeadSourceFields.prospectId]] = lead
      return obj
    }, {})

    const toUpdate = []
    for (const project of legacyProjects) {
      let match = leadSourcesLookup[project[ProjectFields.id]]
      if (match) {
        toUpdate.push({
          [ProjectFields.id]: project[ProjectFields.id],
          [ProjectFields.legacyInterestedIn]:
            match[LeadSourceFields.interestedIn],
        })
      }
    }

    let updateRes = await t60.update(ThreeSixty.LegacyProject, toUpdate)

    console.log(updateRes)

    res.json(toUpdate)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

export default withAuth(syncLegacyJobs)

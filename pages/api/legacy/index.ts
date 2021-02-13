import { withAuth } from 'lib/session'
import { connectTo360 } from 'lib/three60'
import { setAllLegacy } from 'lib/utils'
import { LegacyProject, ProjectFields, ThreeSixty } from 'types/types'

async function Jobs(req, res) {
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
      ])
      .where({ [ProjectFields.legacySoldOnDate]: { $ne: null } })
      .execute({ autoFetch: true })
      .then(setAllLegacy(true))

    res.json(legacyProjects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

export default withAuth(Jobs)

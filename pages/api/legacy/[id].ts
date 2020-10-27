import { connectTo360 } from 'lib/three60'
import { ExtendedLegacyProject } from 'types/types'

export default async function Project(req, res) {
  const { id } = req.query

  try {
    const t60 = await connectTo360()
    const project: ExtendedLegacyProject = await t60
      .sobject('i360__Prospect__c')
      .findOne({ Id: id })
    project.legacy = true

    res.json(project)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

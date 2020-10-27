import { connectTo360 } from 'lib/three60'

export default async function Project(req, res) {
  const { id } = req.query

  try {
    const t60 = await connectTo360()
    const project: Project = await t60
      .sobject('i360__Project__c')
      .findOne({ Id: id })
    project.legacy = false

    res.json(project)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

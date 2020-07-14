import { connectTo360 } from 'lib/three60'
import { onlyUnique } from 'lib/utils'

export default async function Project(req, res) {
  const { type } = req.body
  let key

  if (type === 'Roofing') key = 'Roofing_Product_Color__c'
  if (type === 'Siding') key = 'Siding_Product_Color__c'
  if (type === 'Windows') key = 'Trim_Color__c'

  if (!key) {
    res.json([])
    return
  }

  try {
    const t60 = await connectTo360()
    const projects = await t60
      .sobject('i360__Project__c')
      .select([key])
      .where({ [key]: { $ne: null } })

    res.json(
      projects
        .map(i => (i as any)[key].trim())
        .filter(onlyUnique)
        .sort()
    )
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

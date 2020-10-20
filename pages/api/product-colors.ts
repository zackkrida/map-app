import { connectTo360 } from 'lib/three60'
import { onlyUnique } from 'lib/utils'

export default async function Project(req, res) {
  const { type } = req.body

  try {
    const t60 = await connectTo360()
    const projects = await t60
      .sobject('i360__Project__c')
      .select([
        'Roofing_Product_Color__c',
        'Siding_Product_Color__c',
        'Trim_Color__c',
      ])
      .execute({ autoFetch: true })

    const productColors = []

    for (const project of projects) {
      const p: any = project as any // TODO

      if (p.Roofing_Product_Color__c) {
        productColors.push({
          type: 'roofing',
          name: p.Roofing_Product_Color__c,
        })
      }
      if (p.Siding_Product_Color__c) {
        productColors.push({
          type: 'siding',
          name: p.Siding_Product_Color__c,
        })
      }
      if (p.Trim_Color__c) {
        productColors.push({ type: 'trim', name: p.Trim_Color__c })
      }
    }

    res.json(productColors)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

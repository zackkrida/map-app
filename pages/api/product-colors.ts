import { withAuth } from 'lib/session'
import { connectTo360 } from 'lib/three60'
import { ExtendedProject, ProjectFields } from 'types/types'

enum ProductTypes {
  Roofing_Product_Color__c = 'roofing',
  Siding_Product_Color__c = 'siding',
  Trim_Color__c = 'windows',
}

async function ProductColors(_, res) {
  try {
    const t60 = await connectTo360()
    const projects = await t60
      .sobject<ExtendedProject>('i360__Project__c')
      .select([
        ProjectFields.roofingProductColor,
        ProjectFields.sidingProductColor,
        ProjectFields.trimColor,
      ])
      .execute({ autoFetch: true })

    const productColors = []

    for (const project of projects) {
      Object.entries(ProductTypes).map(([key, value]) => {
        if (project[key]) {
          productColors.push({ type: value, name: project[key] })
        }
      })
    }

    res.json(productColors)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

export default withAuth(ProductColors)

import { withAuth } from 'lib/session'
import { connectTo360 } from 'lib/three60'

async function Jobs(req, res) {
  if (!req.session.get('user')) {
    res.json({ error: true, message: 'User is not authenticated' })
    return
  }

  try {
    const t60 = await connectTo360()
    const legacyProjects = await t60
      .sobject('i360__Prospect__c')
      .select([
        'Id',
        'i360__Correspondence_Name__c',
        'i360__Longitude__c',
        'i360__Latitude__c',
        'Legacy_Sold_On_Date__c',
      ])
      .where({ Legacy_Sold_On_Date__c: { $ne: null } })
      .execute({ autoFetch: true })
      .then(res =>
        res.map(i => {
          ;(i as any).legacy = true
          return i
        })
      )

    res.json(legacyProjects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

export default withAuth(Jobs)

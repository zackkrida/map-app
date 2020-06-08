import { connectTo360 } from 'lib/three60'

export default async function Jobs(req, res) {
  const { searchTerm = '', type = 'zip' } = JSON.parse(req.body)

  try {
    const t60 = await connectTo360()
    const projects = await t60
      .sobject('i360__Project__c')
      .select(['*'])
      .where({
        i360__Appointment_Zip__c: { $eq: searchTerm },
      })

    console.info(projects.length)

    res.json(projects.slice(0, 200))
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

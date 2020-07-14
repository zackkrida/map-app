import { connectTo360 } from 'lib/three60'
const { SfDate } = require('jsforce')

export default async function Jobs(req, res) {
  const filters: any = {}
  const {
    searchTerm = '',
    type = 'zip',
    year = 'any',
    status = 'any',
    jobType = 'any',
  } = req.body

  console.info({ type })

  if (type === 'zip') {
    filters.i360__Appointment_Zip__c = { $eq: searchTerm }
  }
  if (type === 'name') {
    filters.Name = { $like: `%${searchTerm}%` }
  }
  if (type === 'city') {
    filters.i360__Customer_City__c = { $like: `%${searchTerm}%` }
  }
  if (type === 'streetAddress') {
    filters.i360__Customer_Street__c = { $like: `%${searchTerm}%` }
  }
  if (year !== 'any') {
    let createdDate = SfDate.toDateTimeLiteral(new Date(year))
    filters.CreatedDate = {
      $gt: createdDate,
    }
  }
  if (status !== 'any') {
    if (status === 'in-progress') {
      filters.i360__Completed_On__c = { $eq: null }
    } else {
      filters.i360__Completed_On__c = { $ne: null }
    }
  }

  if (jobType !== 'any') {
    filters.i360__Job_Type_formatted__c = { $like: `%${jobType}%` }
  }

  try {
    console.info(filters)

    const t60 = await connectTo360()
    const projects = await t60
      .sobject('i360__Project__c')
      .select(['*'])
      .where(filters)

    res.json(projects)
  } catch (error) {
    console.error(error)
    res.json({ error: true, message: error.message })
  }
}

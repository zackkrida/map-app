interface LayoutProps {
  children?: React.ReactNode
}

interface LocationCoordinates {
  lat: number
  lng: number
}

interface BaseMarkerProps {
  lat: number
  lng: number
  children: JSX.Element
}

interface CustomMarkerProps extends BaseMarkerProps {
  active: boolean
  color: string
  onClick: React.MouseEventHandler
}

/**
 * Our avaliable data types in 360
 */
enum ThreeSixty {
  LegacyProject = 'i360__Prospect__c',
  Project = 'i360__Project__c',
}

enum ProjectFields {
  correspondenceName = 'i360__Correspondence_Name__c',
  createdDate = 'CreatedDate',
  homeAddress = 'i360__Home_Address__c',
  homeCity = 'i360__Home_City__c',
  homeState = 'i360__Home_State__c',
  homeZipPostalCode = 'i360__Home_Zip_Postal_Code__c',
  id = 'Id',
  jobTypeFormatted = 'i360__Job_Type_formatted__c',
  latitude = 'i360__Latitude__c',
  legacy = 'legacy',
  legacySoldOnDate = 'Legacy_Sold_On_Date__c',
  longitude = 'i360__Longitude__c',
  roofingProductColor = 'Roofing_Product_Color__c',
  saleRep = 'i360__Sale_Rep__c',
  sidingProductColor = 'Siding_Product_Color__c',
  status = 'i360__Status__c',
  trimColor = 'Trim_Color__c',
  customLongitude = 'Long__c',
  customLatitude = 'Latitude__c',
  completedOn = 'i360__Completed_On__c',
  appointmentAddress = 'i360__Appointment_Address__c',
  appointmentCity = 'i360__Appointment_City__c',
  appointmentState = 'i360__Appointment_State__c',
  appointmentZip = 'i360__Appointment_Zip__c',
  appointmentLatitude = 'i360__Appointment_Latitude__c',
  appointmentLongitude = 'i360__Appointment_Longitude__c',
  jobType = 'i360__Job_Type__c',
  createdDate = 'CreatedDate',
  salesRep = 'Sales_Rep__c',
}

interface Project {
  [ProjectFields.id]: string
  [ProjectFields.legacy]: false
  [ProjectFields.correspondenceName]: string
  [ProjectFields.completedOn]: string
  [ProjectFields.appointmentAddress]: string
  [ProjectFields.appointmentCity]: string
  [ProjectFields.appointmentState]: string
  [ProjectFields.appointmentZip]: string
  [ProjectFields.appointmentLatitude]: number
  [ProjectFields.appointmentLongitude]: number
  [ProjectFields.jobType]: string
  [ProjectFields.customLatitude]: string
  [ProjectFields.customLongitude]: string
}

interface ExtendedProject extends Project {
  [ProjectFields.createdDate]: Date
  [ProjectFields.roofingProductColor]: string
  [ProjectFields.sidingProductColor]: string
  [ProjectFields.trimColor]: string
  [ProjectFields.saleRep]: string
  [ProjectFields.jobTypeFormatted]: string
  [ProjectFields.status]: string
}

interface LegacyProject {
  [ProjectFields.id]: string
  [ProjectFields.legacy]: true
  [ProjectFields.correspondenceName]: string
  [ProjectFields.longitude]: number
  [ProjectFields.latitude]: number
  [ProjectFields.homeAddress]: string
  [ProjectFields.homeAddress]: string
  [ProjectFields.homeCity]: string
  [ProjectFields.homeState]: string
  [ProjectFields.homeZipPostalCode]: string
  [ProjectFields.legacySoldOnDate]: string
}
interface ExtendedLegacyProject extends LegacyProject {
  [ProjectFields.createdDate]: Date
  [ProjectFields.salesRep]: string
}

type ProjectResult = Partial<Project> | Partial<LegacyProject>
type ProjectResultList = ProjectResult[]

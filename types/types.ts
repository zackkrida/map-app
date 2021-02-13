export interface LayoutProps {
  children?: React.ReactNode
}

export interface LocationCoordinates {
  lat: number
  lng: number
}

export interface BaseMarkerProps {
  lat: number
  lng: number
  children: JSX.Element
}

export interface CustomMarkerProps extends BaseMarkerProps {
  active: boolean
  color: string
  onClick: React.MouseEventHandler
}

/**
 * Our avaliable data types in 360
 */
export enum ThreeSixty {
  LegacyProject = 'i360__Prospect__c',
  Project = 'i360__Project__c',
}

export enum ProjectFields {
  appointmentAddress = 'i360__Appointment_Address__c',
  appointmentCity = 'i360__Appointment_City__c',
  appointmentLatitude = 'i360__Appointment_Latitude__c',
  appointmentLongitude = 'i360__Appointment_Longitude__c',
  appointmentState = 'i360__Appointment_State__c',
  appointmentZip = 'i360__Appointment_Zip__c',
  completedOn = 'i360__Completed_On__c',
  correspondenceName = 'i360__Correspondence_Name__c',
  createdDate = 'CreatedDate',
  customLatitude = 'Latitude__c',
  customLongitude = 'Long__c',
  homeAddress = 'i360__Home_Address__c',
  homeCity = 'i360__Home_City__c',
  homeState = 'i360__Home_State__c',
  homeZipPostalCode = 'i360__Home_Zip_Postal_Code__c',
  id = 'Id',
  jobType = 'i360__Job_Type__c',
  jobTypeFormatted = 'i360__Job_Type_formatted__c',
  latitude = 'i360__Latitude__c',
  legacy = 'legacy',
  legacySoldOnDate = 'Legacy_Sold_On_Date__c',
  longitude = 'i360__Longitude__c',
  roofingProductColor = 'Roofing_Product_Color__c',
  saleRep = 'i360__Sale_Rep__c',
  salesRep = 'Sales_Rep__c',
  sidingProductColor = 'Siding_Product_Color__c',
  status = 'i360__Status__c',
  trimColor = 'Trim_Color__c',
}

export interface Project {
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

export interface ExtendedProject extends Project {
  [ProjectFields.createdDate]: Date
  [ProjectFields.roofingProductColor]: string
  [ProjectFields.sidingProductColor]: string
  [ProjectFields.trimColor]: string
  [ProjectFields.saleRep]: string
  [ProjectFields.jobTypeFormatted]: string
  [ProjectFields.status]: string
}

export interface LegacyProject {
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
export interface ExtendedLegacyProject extends LegacyProject {
  [ProjectFields.createdDate]: Date
  [ProjectFields.salesRep]: string
}

export type ProjectResult = Partial<Project> | Partial<LegacyProject>
export type ProjectResultList = ProjectResult[]

export type ExtendedProjectResult =
  | Partial<ExtendedProject>
  | Partial<ExtendedLegacyProject>
export type ExtendedProjectResultList = ExtendedProjectResult[]

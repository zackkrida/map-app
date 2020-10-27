interface LayoutProps {
  children?: React.ReactNode
}

interface LocationCoordinates {
  lat: number
  lng: number
}

interface Project {
  Id: string
  legacy: false
  i360__Completed_On__c: string
  i360__Correspondence_Name__c: string
  i360__Appointment_Address__c: string
  i360__Appointment_City__c: string
  i360__Appointment_State__c: string
  i360__Appointment_Zip__c: string
  i360__Appointment_Latitude__c: number
  i360__Appointment_Longitude__c: number
  i360__Job_Type__c: string
  Long__c: string
  Latitude__c: string
}

interface ExtendedProject extends Project {
  Roofing_Product_Color__c: string
  Siding_Product_Color__c: string
  Trim_Color__c: string
  i360__Sale_Rep__c: string
}

interface LegacyProject {
  legacy: true
  Id: string
  i360__Correspondence_Name__c: string
  i360__Longitude__c: number
  i360__Latitude__c: number
  i360__Home_Address__c: string
  i360__Home_Address__c: string
  i360__Home_City__c: string
  i360__Home_State__c: string
  i360__Home_Zip_Postal_Code__c: string
  Legacy_Sold_On_Date__c: string
}

interface ExtendedLegacyProject extends LegacyProject {
  Sales_Rep__c: string
}

interface BaseMarkerProps {
  lat: number
  lng: number
  children: JSX.Element
}

type ProjectResultList = (Project | LegacyProject)[]

interface CustomMarkerProps extends BaseMarkerProps {
  active: boolean
  color: string
  onClick: React.MouseEventHandler
}

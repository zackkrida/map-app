interface LayoutProps {
  children?: React.ReactNode
}

interface LocationCoordinates {
  lat: number
  lng: number
}

interface Project {
  Id: string
  legacy?: boolean
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

interface LegacyProject extends Omit<Project, 'Long__c', 'Latitude__c'> {}

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

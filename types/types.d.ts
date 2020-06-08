interface LayoutProps {
  children?: React.ReactNode
  mapChildren?: React.ReactNode
  mapPos: LocationCoordinates
}

interface LocationCoordinates {
  lat: number
  lng: number
}

interface ProjectProps {
  Id: string
  i360__Completed_On__c: string
  i360__Correspondence_Name__c: string
  i360__Appointment_Address__c: string
  i360__Appointment_City__c: string
  i360__Appointment_State__c: string
  i360__Appointment_Zip__c: string
  i360__Job_Type__c: string
}

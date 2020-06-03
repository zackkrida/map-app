import 'react'

declare module 'react' {
  interface HTMLAttributes<T> extends HTMLAttributes<T> {
    /** The latitude of a Map Marker */
    lat?: number
    /** The longitude of a Map Marker */
    lng?: number
  }
}

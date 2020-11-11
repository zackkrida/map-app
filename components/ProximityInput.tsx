import React, { useEffect, useRef } from 'react'

/**
 *
 * @todo Rename, cleanup, add prop types
 */
export function ProximityInput({
  mapsRef,
  value,
  setValue,
  placeholder,
  className,
}) {
  const autoCompleteInstanceRef = useRef(null)
  const autoCompleteRef = useRef(null)

  async function handlePlaceSelect(updateQuery) {
    if (!autoCompleteInstanceRef.current) return

    const addressObject = autoCompleteInstanceRef.current.getPlace()
    const query = addressObject.formatted_address
    updateQuery(query)
    console.log(addressObject)
  }

  useEffect(() => {
    if (!mapsRef.current) return
    let autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      { types: [], componentRestrictions: { country: 'us' } }
    )
    autoComplete.setFields(['address_components', 'formatted_address'])
    autoComplete.addListener('place_changed', () => handlePlaceSelect(setValue))

    autoCompleteInstanceRef.current = autoComplete
  }, [mapsRef])

  return (
    <input
      ref={autoCompleteRef}
      className={className}
      type="text"
      onChange={event => setValue(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  )
}

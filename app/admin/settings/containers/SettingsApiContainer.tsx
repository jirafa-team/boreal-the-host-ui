'use client'

import { useState } from 'react'
import { SettingsView } from '../components/SettingsView'
import { useSettingsApi } from '@/hooks/use-settings-taxonomy'

export function SettingsApiContainer() {

  const {
    departments,
    amenities,
    roomTypes,
    eventTypes,
    staffTypes,
    filterItems
  } = useSettingsApi()

  const [selectedCard, setSelectedCard] = useState('Departamentos')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('all')

  const filteredDepartments = filterItems(departments, searchTerm, searchStatus)
  const filteredAmenities = filterItems(amenities, searchTerm, searchStatus)
  const filteredRoomTypes = filterItems(roomTypes, searchTerm, searchStatus)
  const filteredEventTypes = filterItems(eventTypes, searchTerm, searchStatus)
  const filteredStaffTypes = filterItems(staffTypes, searchTerm, searchStatus)

  return (
    <SettingsView
      selectedCard={selectedCard}
      setSelectedCard={setSelectedCard}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      searchStatus={searchStatus}
      setSearchStatus={setSearchStatus}
      filteredDepartments={filteredDepartments}
      filteredAmenities={filteredAmenities}
      filteredRoomTypes={filteredRoomTypes}
      filteredEventTypes={filteredEventTypes}
      filteredStaffTypes={filteredStaffTypes}
      departments={departments}
      amenities={amenities}
      roomTypes={roomTypes}
      eventTypes={eventTypes}
      staffTypes={staffTypes}
    />
  )
}
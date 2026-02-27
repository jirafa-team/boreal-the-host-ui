'use client'

import { useState } from 'react'
import { SettingsView } from '../components/SettingsView'

export function SettingsMockContainer() {
  const [selectedCard, setSelectedCard] = useState('Departamentos')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStatus, setSearchStatus] = useState('all')
  const [isCreating, setIsCreating] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isCreatingAmenity, setIsCreatingAmenity] = useState(false)
  const [newAmenityName, setNewAmenityName] = useState('')
  const [editingAmenityId, setEditingAmenityId] = useState<number | null>(null)
  const [editingAmenityName, setEditingAmenityName] = useState('')
  const [deletingAmenityId, setDeletingAmenityId] = useState<number | null>(null)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null)
  const [editingRoomName, setEditingRoomName] = useState('')
  const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null)
  const [habitacionesTab, setHabitacionesTab] = useState<'tipos' | 'pisos'>('tipos')
  const [isCreatingFloor, setIsCreatingFloor] = useState(false)
  const [newFloorName, setNewFloorName] = useState('')
  const [editingFloorId, setEditingFloorId] = useState<number | null>(null)
  const [editingFloorName, setEditingFloorName] = useState('')
  const [deletingFloorId, setDeletingFloorId] = useState<number | null>(null)
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Limpieza', description: 'Departamento de limpieza y mantenimiento de espacios', status: 'Activo', active: true },
    { id: 2, name: 'Mantenimiento', description: 'Departamento de reparación y mantenimiento técnico', status: 'Activo', active: true },
    { id: 3, name: 'Seguridad', description: 'Departamento de seguridad y vigilancia', status: 'Inactivo', active: false },
    { id: 4, name: 'Recepción', description: 'Departamento de recepción y administración', status: 'Activo', active: true },
    { id: 5, name: 'Servicio', description: 'Departamento de servicios al huésped', status: 'Activo', active: true },
  ])

  const [amenities, setAmenities] = useState([
    { id: 1, name: 'Fitness', description: 'Centro de fitness y ejercicio', status: 'Activo', active: true },
    { id: 2, name: 'Recreación', description: 'Áreas de recreación y entretenimiento', status: 'Activo', active: true },
    { id: 3, name: 'Bienestar', description: 'Servicios de spa y bienestar', status: 'Activo', active: true },
    { id: 4, name: 'Negocios', description: 'Centro de negocios y salas de reuniones', status: 'Inactivo', active: false },
    { id: 5, name: 'Gastronomía', description: 'Restaurantes y bares', status: 'Activo', active: true },
  ])

  const [roomTypes, setRoomTypes] = useState([
    { id: 1, name: 'Individual', description: 'Habitación para una persona', status: 'Activo', active: true },
    { id: 2, name: 'Doble', description: 'Habitación para dos personas', status: 'Activo', active: true },
    { id: 3, name: 'Suite', description: 'Suite con sala y dormitorio', status: 'Activo', active: true },
    { id: 4, name: 'Deluxe', description: 'Habitación deluxe con amenities premium', status: 'Activo', active: true },
    { id: 5, name: 'Presidencial', description: 'Suite presidencial de lujo', status: 'Activo', active: true },
  ])

  const [floors, setFloors] = useState([
    { id: 1, name: 'Piso 1', description: 'Planta baja', status: 'Activo', active: true },
    { id: 2, name: 'Piso 2', description: 'Segundo piso', status: 'Activo', active: true },
    { id: 3, name: 'Piso 3', description: 'Tercer piso', status: 'Activo', active: true },
    { id: 4, name: 'Piso 4', description: 'Cuarto piso', status: 'Activo', active: true },
    { id: 5, name: 'Sector Cabañas', description: 'Sector de cabañas', status: 'Activo', active: true },
  ])

  const [shifts, setShifts] = useState([
    { id: 1, name: 'Mañana', description: '07:00 AM - 03:00 PM', status: 'Activo', active: true },
    { id: 2, name: 'Tarde', description: '11:00 AM - 07:00 PM', status: 'Activo', active: true },
    { id: 3, name: 'Noche', description: '03:00 PM - 11:00 PM', status: 'Activo', active: true },
  ])

  const [isCreatingShift, setIsCreatingShift] = useState(false)
  const [newShiftName, setNewShiftName] = useState('')
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null)
  const [editingShiftName, setEditingShiftName] = useState('')
  const [deletingShiftId, setDeletingShiftId] = useState<number | null>(null)

  const [eventTypes, setEventTypes] = useState([
    { id: 1, name: 'Conferencia', description: 'Evento de conferencia', status: 'Activo', active: true },
    { id: 2, name: 'Workshop', description: 'Taller interactivo', status: 'Activo', active: true },
    { id: 3, name: 'Social', description: 'Evento social', status: 'Activo', active: true },
    { id: 4, name: 'Gastronomía', description: 'Evento gastronómico', status: 'Activo', active: true },
  ])

  const [eventSpaces, setEventSpaces] = useState([
    { id: 1, name: 'Salón Principal', description: 'Salón principal del hotel', status: 'Activo', active: true },
    { id: 2, name: 'Salón Azul', description: 'Salón azul', status: 'Activo', active: true },
    { id: 3, name: 'Sala de Conferencias 1', description: 'Primera sala de conferencias', status: 'Activo', active: true },
    { id: 4, name: 'Bar de PB', description: 'Bar de planta baja', status: 'Activo', active: true },
  ])

  const [eventosTab, setEventosTab] = useState<'tipos' | 'espacios'>('tipos')
  const [isCreatingEventType, setIsCreatingEventType] = useState(false)
  const [newEventTypeName, setNewEventTypeName] = useState('')
  const [editingEventTypeId, setEditingEventTypeId] = useState<number | null>(null)
  const [editingEventTypeName, setEditingEventTypeName] = useState('')
  const [deletingEventTypeId, setDeletingEventTypeId] = useState<number | null>(null)

  const [isCreatingEventSpace, setIsCreatingEventSpace] = useState(false)
  const [newEventSpaceName, setNewEventSpaceName] = useState('')
  const [editingEventSpaceId, setEditingEventSpaceId] = useState<number | null>(null)
  const [editingEventSpaceName, setEditingEventSpaceName] = useState('')
  const [deletingEventSpaceId, setDeletingEventSpaceId] = useState<number | null>(null)

  const [recommendationCategories, setRecommendationCategories] = useState([
    { id: 1, name: 'Cultura', description: 'Actividades culturales', status: 'Activo', active: true },
    { id: 2, name: 'Deporte', description: 'Actividades deportivas', status: 'Activo', active: true },
    { id: 3, name: 'Gastronomía', description: 'Experiencias gastronómicas', status: 'Activo', active: true },
    { id: 4, name: 'Naturaleza', description: 'Actividades en la naturaleza', status: 'Activo', active: true },
  ])

  const [clientCategories, setClientCategories] = useState([
    { id: 1, name: 'Basic', description: 'Cliente básico', status: 'Activo', active: true },
    { id: 2, name: 'Preferred', description: 'Cliente preferente', status: 'Activo', active: true },
    { id: 3, name: 'Elite', description: 'Cliente elite', status: 'Activo', active: true },
    { id: 4, name: 'VIP', description: 'Cliente VIP', status: 'Activo', active: true },
  ])

  const [isCreatingClientCategory, setIsCreatingClientCategory] = useState(false)
  const [newClientCategoryName, setNewClientCategoryName] = useState('')
  const [editingClientCategoryId, setEditingClientCategoryId] = useState<number | null>(null)
  const [editingClientCategoryName, setEditingClientCategoryName] = useState('')
  const [deletingClientCategoryId, setDeletingClientCategoryId] = useState<number | null>(null)

  const [isCreatingRecommendation, setIsCreatingRecommendation] = useState(false)
  const [newRecommendationName, setNewRecommendationName] = useState('')
  const [editingRecommendationId, setEditingRecommendationId] = useState<number | null>(null)
  const [editingRecommendationName, setEditingRecommendationName] = useState('')
  const [deletingRecommendationId, setDeletingRecommendationId] = useState<number | null>(null)

  const toggleDepartment = (id: number) => {
    setDepartments(departments.map(dept =>
      dept.id === id ? { ...dept, active: !dept.active, status: !dept.active ? 'Activo' : 'Inactivo' } : dept
    ))
  }

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id))
    setDeletingId(null)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingId(id)
  }

  const handleSaveNewDepartment = () => {
    if (newDeptName.trim()) {
      const newId = Math.max(...departments.map(d => d.id), 0) + 1
      setDepartments([{
        id: newId,
        name: newDeptName,
        description: 'Descripción del nuevo departamento',
        status: 'Activo',
        active: true
      }, ...departments])
      setNewDeptName('')
      setIsCreating(false)
    }
  }

  const handleEditStart = (id: number, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleSaveEdit = () => {
    if (editingName.trim() && editingId !== null) {
      setDepartments(departments.map(dept =>
        dept.id === editingId ? { ...dept, name: editingName } : dept
      ))
      setEditingId(null)
      setEditingName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const toggleAmenity = (id: number) => {
    setAmenities(amenities.map(amenity =>
      amenity.id === id ? { ...amenity, active: !amenity.active, status: !amenity.active ? 'Activo' : 'Inactivo' } : amenity
    ))
  }

  const deleteAmenity = (id: number) => {
    setAmenities(amenities.filter(amenity => amenity.id !== id))
    setDeletingAmenityId(null)
  }

  const handleDeleteAmenityClick = (id: number) => {
    setDeletingAmenityId(id)
  }

  const handleSaveNewAmenity = () => {
    if (newAmenityName.trim()) {
      const newId = Math.max(...amenities.map(a => a.id), 0) + 1
      setAmenities([{
        id: newId,
        name: newAmenityName,
        description: 'Descripción del nuevo amenity',
        status: 'Activo',
        active: true
      }, ...amenities])
      setNewAmenityName('')
      setIsCreatingAmenity(false)
    }
  }

  const handleEditAmenityStart = (id: number, name: string) => {
    setEditingAmenityId(id)
    setEditingAmenityName(name)
  }

  const handleSaveAmenityEdit = () => {
    if (editingAmenityName.trim() && editingAmenityId !== null) {
      setAmenities(amenities.map(amenity =>
        amenity.id === editingAmenityId ? { ...amenity, name: editingAmenityName } : amenity
      ))
      setEditingAmenityId(null)
      setEditingAmenityName('')
    }
  }

  const handleCancelAmenityEdit = () => {
    setEditingAmenityId(null)
    setEditingAmenityName('')
  }

  const toggleRoomType = (id: number) => {
    setRoomTypes(roomTypes.map(room =>
      room.id === id ? { ...room, active: !room.active, status: !room.active ? 'Activo' : 'Inactivo' } : room
    ))
  }

  const deleteRoomType = (id: number) => {
    setRoomTypes(roomTypes.filter(room => room.id !== id))
    setDeletingRoomId(null)
  }

  const handleDeleteRoomClick = (id: number) => {
    setDeletingRoomId(id)
  }

  const handleSaveNewRoomType = () => {
    if (newRoomName.trim()) {
      const newId = Math.max(...roomTypes.map(r => r.id), 0) + 1
      setRoomTypes([{
        id: newId,
        name: newRoomName,
        description: 'Descripción del nuevo tipo de habitación',
        status: 'Activo',
        active: true
      }, ...roomTypes])
      setNewRoomName('')
      setIsCreatingRoom(false)
    }
  }

  const handleEditRoomStart = (id: number, name: string) => {
    setEditingRoomId(id)
    setEditingRoomName(name)
  }

  const handleSaveRoomEdit = () => {
    if (editingRoomName.trim() && editingRoomId !== null) {
      setRoomTypes(roomTypes.map(room =>
        room.id === editingRoomId ? { ...room, name: editingRoomName } : room
      ))
      setEditingRoomId(null)
      setEditingRoomName('')
    }
  }

  const handleCancelRoomEdit = () => {
    setEditingRoomId(null)
    setEditingRoomName('')
  }

  const toggleFloor = (id: number) => {
    setFloors(floors.map(floor =>
      floor.id === id ? { ...floor, active: !floor.active, status: !floor.active ? 'Activo' : 'Inactivo' } : floor
    ))
  }

  const deleteFloor = (id: number) => {
    setFloors(floors.filter(floor => floor.id !== id))
    setDeletingFloorId(null)
  }

  const handleDeleteFloorClick = (id: number) => {
    setDeletingFloorId(id)
  }

  const handleSaveNewFloor = () => {
    if (newFloorName.trim()) {
      const newId = Math.max(...floors.map(f => f.id), 0) + 1
      setFloors([{
        id: newId,
        name: newFloorName,
        description: 'Descripción del nuevo piso/sector',
        status: 'Activo',
        active: true
      }, ...floors])
      setNewFloorName('')
      setIsCreatingFloor(false)
    }
  }

  const handleEditFloorStart = (id: number, name: string) => {
    setEditingFloorId(id)
    setEditingFloorName(name)
  }

  const handleSaveFloorEdit = () => {
    if (editingFloorName.trim() && editingFloorId !== null) {
      setFloors(floors.map(floor =>
        floor.id === editingFloorId ? { ...floor, name: editingFloorName } : floor
      ))
      setEditingFloorId(null)
      setEditingFloorName('')
    }
  }

  const handleCancelFloorEdit = () => {
    setEditingFloorId(null)
    setEditingFloorName('')
  }

  const toggleShift = (id: number) => {
    setShifts(shifts.map(shift =>
      shift.id === id ? { ...shift, active: !shift.active, status: !shift.active ? 'Activo' : 'Inactivo' } : shift
    ))
  }

  const deleteShift = (id: number) => {
    setShifts(shifts.filter(shift => shift.id !== id))
    setDeletingShiftId(null)
  }

  const handleDeleteShiftClick = (id: number) => {
    setDeletingShiftId(id)
  }

  const handleSaveNewShift = () => {
    if (newShiftName.trim()) {
      const newId = Math.max(...shifts.map(s => s.id), 0) + 1
      setShifts([{
        id: newId,
        name: newShiftName,
        description: 'Descripción del nuevo turno',
        status: 'Activo',
        active: true
      }, ...shifts])
      setNewShiftName('')
      setIsCreatingShift(false)
    }
  }

  const handleEditShiftStart = (id: number, name: string) => {
    setEditingShiftId(id)
    setEditingShiftName(name)
  }

  const handleSaveShiftEdit = () => {
    if (editingShiftName.trim() && editingShiftId !== null) {
      setShifts(shifts.map(shift =>
        shift.id === editingShiftId ? { ...shift, name: editingShiftName } : shift
      ))
      setEditingShiftId(null)
      setEditingShiftName('')
    }
  }

  const handleCancelShiftEdit = () => {
    setEditingShiftId(null)
    setEditingShiftName('')
  }

  const toggleEventType = (id: number) => {
    setEventTypes(eventTypes.map(eventType =>
      eventType.id === id ? { ...eventType, active: !eventType.active, status: !eventType.active ? 'Activo' : 'Inactivo' } : eventType
    ))
  }

  const deleteEventType = (id: number) => {
    setEventTypes(eventTypes.filter(eventType => eventType.id !== id))
    setDeletingEventTypeId(null)
  }

  const handleDeleteEventTypeClick = (id: number) => {
    setDeletingEventTypeId(id)
  }

  const handleSaveNewEventType = () => {
    if (newEventTypeName.trim()) {
      const newId = Math.max(...eventTypes.map(e => e.id), 0) + 1
      setEventTypes([{
        id: newId,
        name: newEventTypeName,
        description: 'Descripción del nuevo tipo de evento',
        status: 'Activo',
        active: true
      }, ...eventTypes])
      setNewEventTypeName('')
      setIsCreatingEventType(false)
    }
  }

  const handleEditEventTypeStart = (id: number, name: string) => {
    setEditingEventTypeId(id)
    setEditingEventTypeName(name)
  }

  const handleSaveEventTypeEdit = () => {
    if (editingEventTypeName.trim() && editingEventTypeId !== null) {
      setEventTypes(eventTypes.map(eventType =>
        eventType.id === editingEventTypeId ? { ...eventType, name: editingEventTypeName } : eventType
      ))
      setEditingEventTypeId(null)
      setEditingEventTypeName('')
    }
  }

  const handleCancelEventTypeEdit = () => {
    setEditingEventTypeId(null)
    setEditingEventTypeName('')
  }

  const toggleEventSpace = (id: number) => {
    setEventSpaces(eventSpaces.map(eventSpace =>
      eventSpace.id === id ? { ...eventSpace, active: !eventSpace.active, status: !eventSpace.active ? 'Activo' : 'Inactivo' } : eventSpace
    ))
  }

  const deleteEventSpace = (id: number) => {
    setEventSpaces(eventSpaces.filter(eventSpace => eventSpace.id !== id))
    setDeletingEventSpaceId(null)
  }

  const handleDeleteEventSpaceClick = (id: number) => {
    setDeletingEventSpaceId(id)
  }

  const handleSaveNewEventSpace = () => {
    if (newEventSpaceName.trim()) {
      const newId = Math.max(...eventSpaces.map(e => e.id), 0) + 1
      setEventSpaces([{
        id: newId,
        name: newEventSpaceName,
        description: 'Descripción del nuevo espacio',
        status: 'Activo',
        active: true
      }, ...eventSpaces])
      setNewEventSpaceName('')
      setIsCreatingEventSpace(false)
    }
  }

  const handleEditEventSpaceStart = (id: number, name: string) => {
    setEditingEventSpaceId(id)
    setEditingEventSpaceName(name)
  }

  const handleSaveEventSpaceEdit = () => {
    if (editingEventSpaceName.trim() && editingEventSpaceId !== null) {
      setEventSpaces(eventSpaces.map(eventSpace =>
        eventSpace.id === editingEventSpaceId ? { ...eventSpace, name: editingEventSpaceName } : eventSpace
      ))
      setEditingEventSpaceId(null)
      setEditingEventSpaceName('')
    }
  }

  const handleCancelEventSpaceEdit = () => {
    setEditingEventSpaceId(null)
    setEditingEventSpaceName('')
  }

  const toggleRecommendation = (id: number) => {
    setRecommendationCategories(recommendationCategories.map(rec =>
      rec.id === id ? { ...rec, active: !rec.active, status: !rec.active ? 'Activo' : 'Inactivo' } : rec
    ))
  }

  const deleteRecommendation = (id: number) => {
    setRecommendationCategories(recommendationCategories.filter(rec => rec.id !== id))
    setDeletingRecommendationId(null)
  }

  const handleDeleteRecommendationClick = (id: number) => {
    setDeletingRecommendationId(id)
  }

  const handleSaveNewRecommendation = () => {
    if (newRecommendationName.trim()) {
      const newId = Math.max(...recommendationCategories.map(r => r.id), 0) + 1
      setRecommendationCategories([{
        id: newId,
        name: newRecommendationName,
        description: 'Descripción de la nueva categoría',
        status: 'Activo',
        active: true
      }, ...recommendationCategories])
      setNewRecommendationName('')
      setIsCreatingRecommendation(false)
    }
  }

  const handleEditRecommendationStart = (id: number, name: string) => {
    setEditingRecommendationId(id)
    setEditingRecommendationName(name)
  }

  const handleSaveRecommendationEdit = () => {
    if (editingRecommendationName.trim() && editingRecommendationId !== null) {
      setRecommendationCategories(recommendationCategories.map(rec =>
        rec.id === editingRecommendationId ? { ...rec, name: editingRecommendationName } : rec
      ))
      setEditingRecommendationId(null)
      setEditingRecommendationName('')
    }
  }

  const handleCancelRecommendationEdit = () => {
    setEditingRecommendationId(null)
    setEditingRecommendationName('')
  }

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? dept.active : !dept.active)
    return matchesSearch && matchesStatus
  })

  const filteredAmenities = amenities.filter(amenity => {
    const matchesSearch = amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? amenity.active : !amenity.active)
    return matchesSearch && matchesStatus
  })

  const filteredRoomTypes = roomTypes.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? room.active : !room.active)
    return matchesSearch && matchesStatus
  })

  const filteredFloors = floors.filter(floor => {
    const matchesSearch = floor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? floor.active : !floor.active)
    return matchesSearch && matchesStatus
  })

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? shift.active : !shift.active)
    return matchesSearch && matchesStatus
  })

  const filteredEventTypes = eventTypes.filter(eventType => {
    const matchesSearch = eventType.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? eventType.active : !eventType.active)
    return matchesSearch && matchesStatus
  })

  const filteredEventSpaces = eventSpaces.filter(eventSpace => {
    const matchesSearch = eventSpace.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? eventSpace.active : !eventSpace.active)
    return matchesSearch && matchesStatus
  })

  const filteredRecommendations = recommendationCategories.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? rec.active : !rec.active)
    return matchesSearch && matchesStatus
  })

  const filteredClientCategories = clientCategories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = searchStatus === 'all' || (searchStatus === 'activo' ? cat.active : !cat.active)
    return matchesSearch && matchesStatus
  })

  const toggleClientCategory = (id: number) => {
    setClientCategories(clientCategories.map(cat =>
      cat.id === id ? { ...cat, active: !cat.active, status: !cat.active ? 'Activo' : 'Inactivo' } : cat
    ))
  }

  const deleteClientCategory = (id: number) => {
    setClientCategories(clientCategories.filter(cat => cat.id !== id))
    setDeletingClientCategoryId(null)
  }

  const handleDeleteClientCategoryClick = (id: number) => {
    setDeletingClientCategoryId(id)
  }

  const handleSaveNewClientCategory = () => {
    if (newClientCategoryName.trim()) {
      const newId = Math.max(...clientCategories.map(c => c.id), 0) + 1
      setClientCategories([{
        id: newId,
        name: newClientCategoryName,
        description: 'Descripción de la categoría',
        status: 'Activo',
        active: true
      }, ...clientCategories])
      setNewClientCategoryName('')
      setIsCreatingClientCategory(false)
    }
  }

  const handleEditClientCategoryStart = (id: number, name: string) => {
    setEditingClientCategoryId(id)
    setEditingClientCategoryName(name)
  }

  const handleSaveClientCategoryEdit = () => {
    if (editingClientCategoryName.trim() && editingClientCategoryId !== null) {
      setClientCategories(clientCategories.map(cat =>
        cat.id === editingClientCategoryId ? { ...cat, name: editingClientCategoryName } : cat
      ))
      setEditingClientCategoryId(null)
      setEditingClientCategoryName('')
    }
  }

  const handleCancelClientCategoryEdit = () => {
    setEditingClientCategoryId(null)
    setEditingClientCategoryName('')
    return (
      <SettingsView
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchStatus={searchStatus}
        setSearchStatus={setSearchStatus}
        habitacionesTab={habitacionesTab}
        setHabitacionesTab={setHabitacionesTab}
        eventosTab={eventosTab}
        setEventosTab={setEventosTab}
        filteredDepartments={filteredDepartments}
        departments={departments}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        newDeptName={newDeptName}
        setNewDeptName={setNewDeptName}
        editingId={editingId}
        editingName={editingName}
        setEditingName={setEditingName}
        deletingId={deletingId}
        toggleDepartment={toggleDepartment}
        deleteDepartment={deleteDepartment}
        handleDeleteClick={handleDeleteClick}
        handleSaveNewDepartment={handleSaveNewDepartment}
        handleEditStart={handleEditStart}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        setDeletingId={setDeletingId}
        filteredAmenities={filteredAmenities}
        amenities={amenities}
        isCreatingAmenity={isCreatingAmenity}
        setIsCreatingAmenity={setIsCreatingAmenity}
        newAmenityName={newAmenityName}
        setNewAmenityName={setNewAmenityName}
        editingAmenityId={editingAmenityId}
        editingAmenityName={editingAmenityName}
        setEditingAmenityName={setEditingAmenityName}
        deletingAmenityId={deletingAmenityId}
        toggleAmenity={toggleAmenity}
        deleteAmenity={deleteAmenity}
        handleDeleteAmenityClick={handleDeleteAmenityClick}
        handleSaveNewAmenity={handleSaveNewAmenity}
        handleEditAmenityStart={handleEditAmenityStart}
        handleSaveAmenityEdit={handleSaveAmenityEdit}
        handleCancelAmenityEdit={handleCancelAmenityEdit}
        setDeletingAmenityId={setDeletingAmenityId}
        filteredRoomTypes={filteredRoomTypes}
        roomTypes={roomTypes}
        isCreatingRoom={isCreatingRoom}
        setIsCreatingRoom={setIsCreatingRoom}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        editingRoomId={editingRoomId}
        editingRoomName={editingRoomName}
        setEditingRoomName={setEditingRoomName}
        deletingRoomId={deletingRoomId}
        toggleRoomType={toggleRoomType}
        deleteRoomType={deleteRoomType}
        handleDeleteRoomClick={handleDeleteRoomClick}
        handleSaveNewRoomType={handleSaveNewRoomType}
        handleEditRoomStart={handleEditRoomStart}
        handleSaveRoomEdit={handleSaveRoomEdit}
        handleCancelRoomEdit={handleCancelRoomEdit}
        setDeletingRoomId={setDeletingRoomId}
        filteredFloors={filteredFloors}
        floors={floors}
        isCreatingFloor={isCreatingFloor}
        setIsCreatingFloor={setIsCreatingFloor}
        newFloorName={newFloorName}
        setNewFloorName={setNewFloorName}
        editingFloorId={editingFloorId}
        editingFloorName={editingFloorName}
        setEditingFloorName={setEditingFloorName}
        deletingFloorId={deletingFloorId}
        toggleFloor={toggleFloor}
        deleteFloor={deleteFloor}
        handleDeleteFloorClick={handleDeleteFloorClick}
        handleSaveNewFloor={handleSaveNewFloor}
        handleEditFloorStart={handleEditFloorStart}
        handleSaveFloorEdit={handleSaveFloorEdit}
        handleCancelFloorEdit={handleCancelFloorEdit}
        setDeletingFloorId={setDeletingFloorId}
        filteredShifts={filteredShifts}
        shifts={shifts}
        isCreatingShift={isCreatingShift}
        setIsCreatingShift={setIsCreatingShift}
        newShiftName={newShiftName}
        setNewShiftName={setNewShiftName}
        editingShiftId={editingShiftId}
        editingShiftName={editingShiftName}
        setEditingShiftName={setEditingShiftName}
        deletingShiftId={deletingShiftId}
        toggleShift={toggleShift}
        deleteShift={deleteShift}
        handleDeleteShiftClick={handleDeleteShiftClick}
        handleSaveNewShift={handleSaveNewShift}
        handleEditShiftStart={handleEditShiftStart}
        handleSaveShiftEdit={handleSaveShiftEdit}
        handleCancelShiftEdit={handleCancelShiftEdit}
        setDeletingShiftId={setDeletingShiftId}
        filteredEventTypes={filteredEventTypes}
        eventTypes={eventTypes}
        isCreatingEventType={isCreatingEventType}
        setIsCreatingEventType={setIsCreatingEventType}
        newEventTypeName={newEventTypeName}
        setNewEventTypeName={setNewEventTypeName}
        editingEventTypeId={editingEventTypeId}
        editingEventTypeName={editingEventTypeName}
        setEditingEventTypeName={setEditingEventTypeName}
        deletingEventTypeId={deletingEventTypeId}
        toggleEventType={toggleEventType}
        deleteEventType={deleteEventType}
        handleDeleteEventTypeClick={handleDeleteEventTypeClick}
        handleSaveNewEventType={handleSaveNewEventType}
        handleEditEventTypeStart={handleEditEventTypeStart}
        handleSaveEventTypeEdit={handleSaveEventTypeEdit}
        handleCancelEventTypeEdit={handleCancelEventTypeEdit}
        setDeletingEventTypeId={setDeletingEventTypeId}
        filteredEventSpaces={filteredEventSpaces}
        eventSpaces={eventSpaces}
        isCreatingEventSpace={isCreatingEventSpace}
        setIsCreatingEventSpace={setIsCreatingEventSpace}
        newEventSpaceName={newEventSpaceName}
        setNewEventSpaceName={setNewEventSpaceName}
        editingEventSpaceId={editingEventSpaceId}
        editingEventSpaceName={editingEventSpaceName}
        setEditingEventSpaceName={setEditingEventSpaceName}
        deletingEventSpaceId={deletingEventSpaceId}
        toggleEventSpace={toggleEventSpace}
        deleteEventSpace={deleteEventSpace}
        handleDeleteEventSpaceClick={handleDeleteEventSpaceClick}
        handleSaveNewEventSpace={handleSaveNewEventSpace}
        handleEditEventSpaceStart={handleEditEventSpaceStart}
        handleSaveEventSpaceEdit={handleSaveEventSpaceEdit}
        handleCancelEventSpaceEdit={handleCancelEventSpaceEdit}
        setDeletingEventSpaceId={setDeletingEventSpaceId}
        filteredRecommendations={filteredRecommendations}
        recommendationCategories={recommendationCategories}
        isCreatingRecommendation={isCreatingRecommendation}
        setIsCreatingRecommendation={setIsCreatingRecommendation}
        newRecommendationName={newRecommendationName}
        setNewRecommendationName={setNewRecommendationName}
        editingRecommendationId={editingRecommendationId}
        editingRecommendationName={editingRecommendationName}
        setEditingRecommendationName={setEditingRecommendationName}
        deletingRecommendationId={deletingRecommendationId}
        toggleRecommendation={toggleRecommendation}
        deleteRecommendation={deleteRecommendation}
        handleDeleteRecommendationClick={handleDeleteRecommendationClick}
        handleSaveNewRecommendation={handleSaveNewRecommendation}
        handleEditRecommendationStart={handleEditRecommendationStart}
        handleSaveRecommendationEdit={handleSaveRecommendationEdit}
        handleCancelRecommendationEdit={handleCancelRecommendationEdit}
        setDeletingRecommendationId={setDeletingRecommendationId}
        filteredClientCategories={filteredClientCategories}
        clientCategories={clientCategories}
        isCreatingClientCategory={isCreatingClientCategory}
        setIsCreatingClientCategory={setIsCreatingClientCategory}
        newClientCategoryName={newClientCategoryName}
        setNewClientCategoryName={setNewClientCategoryName}
        editingClientCategoryId={editingClientCategoryId}
        editingClientCategoryName={editingClientCategoryName}
        setEditingClientCategoryName={setEditingClientCategoryName}
        deletingClientCategoryId={deletingClientCategoryId}
        toggleClientCategory={toggleClientCategory}
        deleteClientCategory={deleteClientCategory}
        handleDeleteClientCategoryClick={handleDeleteClientCategoryClick}
        handleSaveNewClientCategory={handleSaveNewClientCategory}
        handleEditClientCategoryStart={handleEditClientCategoryStart}
        handleSaveClientCategoryEdit={handleSaveClientCategoryEdit}
        handleCancelClientCategoryEdit={handleCancelClientCategoryEdit}
        setDeletingClientCategoryId={setDeletingClientCategoryId}
      />
    )
  }
}

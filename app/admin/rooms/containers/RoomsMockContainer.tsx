"use client"

import { useLanguage } from "@/lib/i18n-context"
import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { loadMockRooms, setRooms } from "@/app/admin/rooms/slice/roomSlice"
import { useToast } from "@/hooks/use-toast"
import { RoomsView } from "../components/RoomsView"
import type { Room, RoomStatus, NewRoomForm, RoomStats, DateColumn } from "../components/types"

const initialNewRoom: NewRoomForm = { number: "", type: "Individual", floor: 1 }
const ROOM_TYPES_EDIT = ["Individual", "Doble", "Suite", "Familiar"]

function getStatusColor(status: RoomStatus): string {
  const colors: Record<RoomStatus, string> = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    maintenance: "bg-orange-500",
    reserved: "bg-yellow-500",
  }
  return colors[status]
}

export function RoomsMockContainer() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const dispatch = useDispatch()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const roomsFromSlice = useSelector((state: RootState) => state.room.rooms)

  useEffect(() => {
    if (dataSource === "mock") dispatch(loadMockRooms())
  }, [dataSource, dispatch])

  const rooms: Room[] = roomsFromSlice as Room[]

  const [layoutMode, setLayoutMode] = React.useState<"grid" | "kanban">("grid")
  const [timelineMode, setTimelineMode] = React.useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split("T")[0])
  const [selectedMonth, setSelectedMonth] = React.useState({ year: new Date().getFullYear(), month: new Date().getMonth() })
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<RoomStatus | null>(null)
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null)
  const [newRoom, setNewRoom] = React.useState<NewRoomForm>(initialNewRoom)

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesStatus = statusFilter === null || room.status === statusFilter
      const matchesSearch =
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.guest?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      if (layoutMode === "grid") {
        const selectedDateObj = new Date(selectedDate)
        selectedDateObj.setHours(0, 0, 0, 0)
        if (room.status === "maintenance") return matchesStatus && matchesSearch
        if (room.checkIn && room.checkOut) {
          const checkIn = new Date(room.checkIn)
          const checkOut = new Date(room.checkOut)
          checkIn.setHours(0, 0, 0, 0)
          checkOut.setHours(0, 0, 0, 0)
          if (selectedDateObj >= checkIn && selectedDateObj <= checkOut) return matchesStatus && matchesSearch
        }
        if (!room.checkIn || !room.checkOut) return matchesStatus && matchesSearch
        return false
      }
      return matchesStatus && matchesSearch
    })
  }, [rooms, statusFilter, searchTerm, layoutMode, selectedDate])

  const stats: RoomStats = useMemo(
    () => ({
      total: rooms.length,
      available: rooms.filter((r) => r.status === "available").length,
      occupied: rooms.filter((r) => r.status === "occupied").length,
      maintenance: rooms.filter((r) => r.status === "maintenance").length,
      reserved: rooms.filter((r) => r.status === "reserved").length,
    }),
    [rooms]
  )

  const dateColumns: DateColumn[] = useMemo(() => {
    const columns: DateColumn[] = []
    if (timelineMode === "week") {
      const startDate = new Date(currentDate)
      startDate.setDate(startDate.getDate() - startDate.getDay())
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        columns.push({
          label: date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }),
          date: new Date(date),
        })
      }
    } else {
      const { year, month } = selectedMonth
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i)
        columns.push({ label: i.toString(), date: new Date(date) })
      }
    }
    return columns
  }, [timelineMode, currentDate, selectedMonth])

  const getRoomStatusForDate = React.useCallback((room: Room, date: Date): RoomStatus => {
    if (room.status === "maintenance") return "maintenance"
    if (room.checkIn && room.checkOut) {
      const checkIn = new Date(room.checkIn)
      const checkOut = new Date(room.checkOut)
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)
      checkIn.setHours(0, 0, 0, 0)
      checkOut.setHours(0, 0, 0, 0)
      if (targetDate >= checkIn && targetDate <= checkOut) return room.status
    }
    return "available"
  }, [])

  const getStatusLabel = React.useCallback(
    (status: RoomStatus) => {
      const labels: Record<RoomStatus, string> = {
        available: t("admin.available"),
        occupied: t("admin.occupied"),
        maintenance: t("admin.maintenance"),
        reserved: t("admin.reserved"),
      }
      return labels[status]
    },
    [t]
  )

  const convertISOToLocaleFormat = React.useCallback(
    (isoDate: string): string => {
      const [year, month, day] = isoDate.split("-")
      if (language === "es" || language === "pt") return `${day}/${month}/${year}`
      return `${month}/${day}/${year}`
    },
    [language]
  )

  const navigateDate = React.useCallback(
    (direction: "prev" | "next") => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
        return newDate
      })
    },
    []
  )

  const handleCreateRoom = React.useCallback(() => {
    if (!newRoom.number.trim()) return
    const roomExists = rooms.some((r) => r.number.toLowerCase() === newRoom.number.toLowerCase())
    if (roomExists) {
      toast({ title: "Error", description: `La habitación número ${newRoom.number} ya existe.`, variant: "destructive" })
      return
    }
    const newId = (Math.max(...rooms.map((r) => parseInt(r.id, 10) || 0), 0) + 1).toString()
    dispatch(
      setRooms([
        ...rooms,
        {
          id: newId,
          number: newRoom.number,
          type: newRoom.type,
          floor: newRoom.floor,
          status: "available",
        },
      ])
    )
    setNewRoom(initialNewRoom)
    setShowCreateModal(false)
    toast({ title: "Éxito", description: `Habitación ${newRoom.number} creada correctamente.` })
  }, [newRoom, rooms, dispatch, toast])

  const handleUpdateRoom = React.useCallback(() => {
    if (!selectedRoom) return
    const roomExists = rooms.some(
      (r) => r.id !== selectedRoom.id && r.number.toLowerCase() === selectedRoom.number.toLowerCase()
    )
    if (roomExists) {
      toast({
        title: "Error",
        description: `La habitación número ${selectedRoom.number} ya existe.`,
        variant: "destructive",
      })
      return
    }
    dispatch(setRooms(rooms.map((r) => (r.id === selectedRoom.id ? selectedRoom : r))))
    setShowEditModal(false)
    setSelectedRoom(null)
    toast({ title: "Éxito", description: `Habitación ${selectedRoom.number} actualizada correctamente.` })
  }, [selectedRoom, rooms, dispatch, toast])

  const handleDeleteRoom = React.useCallback(() => {
    if (!selectedRoom) return
    dispatch(setRooms(rooms.filter((r) => r.id !== selectedRoom.id)))
    setShowEditModal(false)
    setSelectedRoom(null)
    toast({ title: "Éxito", description: "Habitación eliminada correctamente." })
  }, [selectedRoom, rooms, dispatch, toast])

  return (
    <RoomsView
      layoutMode={layoutMode}
      setLayoutMode={setLayoutMode}
      filteredRooms={filteredRooms}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      currentDate={currentDate}
      onCurrentDateChange={setCurrentDate}
      selectedMonth={selectedMonth}
      onSelectedMonthChange={setSelectedMonth}
      timelineMode={timelineMode}
      setTimelineMode={setTimelineMode}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      stats={stats}
      dateColumns={dateColumns}
      showCreateModal={showCreateModal}
      setShowCreateModal={setShowCreateModal}
      showEditModal={showEditModal}
      setShowEditModal={setShowEditModal}
      selectedRoom={selectedRoom}
      setSelectedRoom={setSelectedRoom}
      newRoom={newRoom}
      setNewRoom={setNewRoom}
      onCreateRoom={handleCreateRoom}
      onUpdateRoom={handleUpdateRoom}
      onDeleteRoom={handleDeleteRoom}
      getStatusColor={getStatusColor}
      getStatusLabel={getStatusLabel}
      getRoomStatusForDate={getRoomStatusForDate}
      navigateDate={navigateDate}
      convertISOToLocaleFormat={convertISOToLocaleFormat}
      language={language}
      t={t}
      roomTypes={ROOM_TYPES_EDIT.map((type) => ({ id: type, name: type }))}
    />
  )
}

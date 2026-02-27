"use client"

import { useLanguage } from "@/lib/i18n-context"
import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "@/app/admin/rooms/slice/roomSlice"
import { useGetRoomTypesQuery } from "@/features/taxonomy-room-type/slices/taxonomyRoomTypeSlice"
import { useToast } from "@/hooks/use-toast"
import { RoomsView } from "../components/RoomsView"
import type { Room, RoomStatus, NewRoomForm, RoomStats, DateColumn } from "../components/types"

const initialNewRoom: NewRoomForm = { number: "", roomTypeId: "", floor: 1 }

function getStatusColor(status: RoomStatus): string {
  const colors: Record<RoomStatus, string> = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    maintenance: "bg-orange-500",
    reserved: "bg-yellow-500",
  }
  return colors[status]
}

export function RoomsApiContainer() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const skip = dataSource !== "api"

  const { data: apiData, isLoading, error } = useGetRoomsQuery(undefined, { skip })
  const { data: roomTypesData } = useGetRoomTypesQuery(undefined, { skip })
  const [createRoom] = useCreateRoomMutation()
  const [updateRoom] = useUpdateRoomMutation()
  const [deleteRoom] = useDeleteRoomMutation()

  const roomTypes = roomTypesData?.data ?? []

  const rooms: Room[] = useMemo(() => {
    const raw = apiData?.data?.objects ?? []
    return raw.map((r: Room & { roomType?: { id: string; name: string } }) => ({
      ...r,
      type: r.roomType?.name ?? r.type ?? "",
      roomTypeId: r.roomType?.id ?? r.roomTypeId,
    }))
  }, [apiData?.data?.objects])

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

  const navigateDate = React.useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
      return newDate
    })
  }, [])

  const handleCreateRoom = React.useCallback(async () => {
    if (!newRoom.number.trim()) return
    console.log('newRoom', newRoom)
    try {
      await createRoom({
        number: newRoom.number,
        roomTypeId: newRoom.roomTypeId,
        floor: newRoom.floor,
      }).unwrap()
      setNewRoom(initialNewRoom)
      setShowCreateModal(false)
      toast({ title: "Éxito", description: `Habitación ${newRoom.number} creada correctamente.` })
    } catch {
      toast({ title: "Error", description: "No se pudo crear la habitación.", variant: "destructive" })
    }
  }, [newRoom, createRoom, toast])

  const handleUpdateRoom = React.useCallback(async () => {
    if (!selectedRoom) return
    try {
      await updateRoom({
        id: selectedRoom.id,
        payload: {
          number: selectedRoom.number,
          roomTypeId: selectedRoom.roomTypeId,
          floor: selectedRoom.floor,
          status: selectedRoom.status,
          guest: selectedRoom.guest,
          checkIn: selectedRoom.checkIn,
          checkOut: selectedRoom.checkOut,
        },
      }).unwrap()
      setShowEditModal(false)
      setSelectedRoom(null)
      toast({ title: "Éxito", description: `Habitación ${selectedRoom.number} actualizada correctamente.` })
    } catch {
      toast({ title: "Error", description: "No se pudo actualizar la habitación.", variant: "destructive" })
    }
  }, [selectedRoom, updateRoom, toast])

  const handleDeleteRoom = React.useCallback(async () => {
    if (!selectedRoom) return
    try {
      await deleteRoom(selectedRoom.id).unwrap()
      setShowEditModal(false)
      setSelectedRoom(null)
      toast({ title: "Éxito", description: "Habitación eliminada correctamente." })
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar la habitación.", variant: "destructive" })
    }
  }, [selectedRoom, deleteRoom, toast])

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
      isLoading={isLoading}
      error={error}
      roomTypes={roomTypes}
    />
  )
}

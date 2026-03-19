"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { useLanguage } from "@/lib/i18n-context"
import moment from "moment-timezone"
import { useUserTimeZone } from "@/hooks/useUserTimeZone"
import {
  Dumbbell,
  Waves,
  Sparkles,
  Video,
  Coffee,
  LayoutGrid,
} from "lucide-react"
import { useGetRoomsQuery } from "@/app/admin/rooms/slice/roomSlice"
import { useGetStaffQuery } from "@/app/admin/staff/slice/staffSlice"
import { useGetFacilitiesQuery, facilityApi } from "@/app/admin/facilities/slice/facilitySlice"
import type { FacilitySlotResponse } from "@/interfaces/facility-slot/facility-slot-response"
import { useGetReservationFacilityBookingsQuery } from "@/features/reservation-facility-booking/slices/reservationFacilityBookingSlice"
import { useGetClientsQuery, mapClientApiToClient } from "@/app/admin/clients/slice/clientSlice"
import {
  useCreateReservationMutation,
  useGetReservationsQuery,
  useGetTodayCheckoutsQuery,
  useCompleteCheckoutMutation,
} from "@/features/reservation/slices/reservationSlice"
import { useCreateStaffTaskMutation, useGetStaffTasksQuery } from "@/features/staff-task/slices/staffTaskSlice"
import type { StaffTask } from "@/interfaces/staff-task/StaffTask"
import { useToast } from "@/hooks/use-toast"
import type { Facility as ApiFacility } from "@/interfaces/facility/Facility"
import type { StaffMemberDisplay } from "@/interfaces/staff/StaffMemberDisplay"
import type { ReservationFacilityBooking } from "@/interfaces/reservation-facility-booking/ReservationFacilityBooking"
import { DashboardView } from "../components/DashboardView"
import type {
  Room,
  Facility,
  Booking,
  StaffMember,
  CleaningRequest,
  Checkout,
  DashboardTab,
  RoomStatus,
  StaffStatus,
  StaffDepartment,
  StaffScheduleEntry,
  RoomBookingClient,
  RoomBookingFormPayload,
  MaintenanceActivityFormPayload,
} from "../components/types"
import type { RoomReservationRange } from "../utils"
import {
  generateDateColumns,
  getRoomStatusForDate,
} from "../utils"

const FACILITY_TYPE_ICON: Record<
  string,
  { icon: typeof Dumbbell; color: string }
> = {
  fitness: { icon: Dumbbell, color: "bg-orange-500" },
  recreation: { icon: Waves, color: "bg-blue-500" },
  wellness: { icon: Sparkles, color: "bg-purple-500" },
  business: { icon: Video, color: "bg-teal-500" },
  dining: { icon: Coffee, color: "bg-amber-500" },
}

function mapApiFacilityToDashboard(f: ApiFacility): Facility {
  const type =
    (f.facilityType?.name ?? f.type ?? "fitness") as string
  const { icon, color } =
    FACILITY_TYPE_ICON[type] ?? {
      icon: LayoutGrid,
      color: "bg-gray-500",
    }
  return {
    id: f.id,
    name: f.name,
    type,
    capacity: f.capacity ?? 0,
    icon,
    color,
    startTime: f.startTime ?? f.openTime ?? "08:00",
    endTime: f.endTime ?? f.closeTime ?? "20:00",
  }
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function mapStaffDisplayToMember(
  d: StaffMemberDisplay,
): StaffMember {
  const emp = d.employee
  const workStatus = emp?.workStatus ?? "available"
  let status: StaffStatus = "available"
  if (workStatus === "busy" || workStatus === "occupied") status = "busy"
  else if (workStatus === "off" || workStatus === "inactive") status = "off"

  const dept = (emp?.departmentName ?? "Recepción") as StaffDepartment
  const validDepts: StaffDepartment[] = [
    "Limpieza",
    "Mantenimiento",
    "Seguridad",
    "Recepción",
    "Servicio",
  ]
  const department = validDepts.includes(dept) ? dept : "Recepción"

  const schedule = emp?.schedule as StaffScheduleEntry[] | undefined
  const todayDow = new Date().getDay()
  const todaySchedule = schedule?.find((s) => s.dayOfWeek === todayDow && s.isActive)

  return {
    id: d.id,
    name:
      (d.name ?? [d.firstName, d.lastName].filter(Boolean).join(" ")) || "—",
    avatar: getInitials(d.name ?? d.firstName ?? "U"),
    department,
    status,
    tasksToday: emp?.totalTasks ?? emp?.tasksToday ?? 0,
    completedTasks: emp?.completedTasks ?? 0,
    maxCapacity: emp?.maxCapacity ?? 8,
    shift: todaySchedule
      ? `${todaySchedule.startTime} - ${todaySchedule.endTime}`
      : "—",
    currentRoom: emp?.currentRoom ?? undefined,
    schedule,
  }
}

function mapReservationBookingToDashboard(
  b: ReservationFacilityBooking
): Booking {
  return {
    facilityId: b.facilityId,
    clientName: "—",
    clientRoom: "—",
    time: "08:00",
    duration: 60,
    status: "confirmed",
  }
}

function getStatusColor(
  status: RoomStatus | "booked" | StaffStatus
): string {
  const colors: Record<string, string> = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    maintenance: "bg-orange-500",
    reserved: "bg-yellow-500",
    booked: "bg-purple-500",
    busy: "bg-orange-500",
    off: "bg-gray-500",
  }
  return colors[status] ?? "bg-gray-500"
}

function getStatusText(status: StaffStatus): string {
  switch (status) {
    case "available":
      return "Disponible"
    case "busy":
      return "Ocupado"
    case "off":
      return "Fuera de servicio"
    default:
      return status
  }
}

function getRequestStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-gray-500",
    assigned: "bg-blue-500",
    "in-progress": "bg-orange-500",
    completed: "bg-green-500",
  }
  return colors[status] ?? "bg-gray-500"
}

function getRequestStatusText(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    assigned: "Asignado",
    "in-progress": "En progreso",
    completed: "Completado",
  }
  return labels[status] ?? status
}

const SLOT_BOUNDS: Record<string, [number, number]> = {
  "7:00 AM": [7, 11],
  "11:00 AM": [11, 15],
  "3:00 PM": [15, 19],
  "7:00 PM": [19, 24],
}

export function DashboardApiContainer() {
  const { t, language } = useLanguage()
  const { formatDate, timezone } = useUserTimeZone()
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const dataSource = useSelector(
    (state: RootState) => state.dataSource.dataSource
  )
  const skip = dataSource !== "api"

  const { data: roomsData, isLoading: roomsLoading, refetch: refetchRooms } =
    useGetRoomsQuery(undefined, { skip })
  const [createReservation] = useCreateReservationMutation()
  const [createStaffTask] = useCreateStaffTaskMutation()
  const { toast } = useToast()
  const { data: staffData } = useGetStaffQuery(undefined, { skip })
  const { data: facilitiesData } = useGetFacilitiesQuery(undefined, {
    skip,
  })
  const { data: bookingsData } = useGetReservationFacilityBookingsQuery(
    undefined,
    { skip }
  )
  const { data: clientsData } = useGetClientsQuery(
    { page: 1, limit: 200 },
    { skip }
  )
  const { data: reservationsData } = useGetReservationsQuery(
    { page: 1, limit: 500 },
    { skip }
  )
  const { data: todayCheckoutsData } = useGetTodayCheckoutsQuery(undefined, { skip })
  const [completeCheckout] = useCompleteCheckoutMutation()

  const todayStart = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString()
  }, [])
  const todayEnd = useMemo(() => {
    const d = new Date(); d.setHours(23, 59, 59, 999); return d.toISOString()
  }, [])

  const { data: staffTasksData } = useGetStaffTasksQuery(
    { scheduledFrom: todayStart, scheduledTo: todayEnd, limit: 200 },
    { skip }
  )
  const staffTasks = useMemo((): StaffTask[] =>
    staffTasksData?.data?.tasks ?? staffTasksData?.data?.staffTasks ?? [],
    [staffTasksData]
  )

  const reservationsByRoomId = useMemo((): Record<string, RoomReservationRange[]> => {
    const data = reservationsData?.data as { objects?: Array<{ roomId: string; checkIn: string; checkOut: string; status?: string }>; reservations?: Array<{ roomId: string; checkIn: string; checkOut: string; status?: string }> } | undefined
    const raw = data?.objects ?? data?.reservations ?? []
    const list = Array.isArray(raw) ? raw : []
    const byRoom: Record<string, RoomReservationRange[]> = {}
    for (const r of list) {
      if (!r?.roomId || r.status === "cancelled") continue
      const range: RoomReservationRange = {
        checkIn: r.checkIn ?? "",
        checkOut: r.checkOut ?? "",
        status: r.status,
      }
      if (!byRoom[r.roomId]) byRoom[r.roomId] = []
      byRoom[r.roomId].push(range)
    }
    return byRoom
  }, [reservationsData?.data])

  const roomBookingClients: RoomBookingClient[] = useMemo(() => {
    const list = clientsData?.data?.objects ?? []
    return (Array.isArray(list) ? list : []).map((d) => {
      const c = mapClientApiToClient(d)
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone ?? "-",
        room: c.room ?? "-",
        checkIn: c.checkIn ?? "-",
        checkOut: c.checkOut ?? "-",
      }
    })
  }, [clientsData?.data?.objects])

  const [activeTab, setActiveTab] = useState<DashboardTab>("rooms")
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [searchName, setSearchName] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [checkoutSearchRoom, setCheckoutSearchRoom] = useState("")
  const [checkoutSearchGuest, setCheckoutSearchGuest] = useState("")
  const [checkoutSearchStatus, setCheckoutSearchStatus] = useState("all")

  const rooms: Room[] = useMemo(() => {
    const raw =
      roomsData?.data?.objects ??
      (roomsData?.data as { objects?: Room[] })?.objects ??
      []
    return raw.map(
      (r: Room & { roomType?: { id: string; name: string } }) => ({
        ...r,
        type: r.roomType?.name ?? r.type ?? "",
      })
    )
  }, [roomsData?.data])

  const staffMembers: StaffMember[] = useMemo(() => {
    const raw =
      staffData?.data?.objects ??
      (staffData?.data as { objects?: StaffMemberDisplay[] })?.objects ??
      []
    return raw.map(mapStaffDisplayToMember)
  }, [staffData?.data])

  const facilities: Facility[] = useMemo(() => {
    const raw =
      facilitiesData?.data?.facilities ??
      facilitiesData?.data?.objects ??
      (facilitiesData?.data as { facilities?: ApiFacility[] })?.facilities ??
      []
    return (raw as ApiFacility[]).map(mapApiFacilityToDashboard)
  }, [facilitiesData?.data])

  const dispatch = useDispatch<AppDispatch>()
  const [facilitySlots, setFacilitySlots] = useState<Record<string, FacilitySlotResponse[]>>({})

  const facilityIdsKey = useMemo(() => facilities.map((f) => f.id).join(","), [facilities])

  useEffect(() => {
    if (skip || !facilityIdsKey) return
    const ids = facilityIdsKey.split(",").filter(Boolean)
    const subscriptions = ids.map((id) => {
      const sub = dispatch(facilityApi.endpoints.getFacilitySlots.initiate(id))
      sub.then(({ data }) => {
        if (data?.data) {
          setFacilitySlots((prev) => ({ ...prev, [id]: data.data }))
        }
      })
      return sub
    })
    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe())
    }
  }, [facilityIdsKey, skip, dispatch])

  const bookings: Booking[] = useMemo(() => {
    const raw =
      bookingsData?.data?.bookings ??
      bookingsData?.data?.reservationFacilityBookings ??
      (bookingsData?.data as { reservationFacilityBookings?: ReservationFacilityBooking[] })
        ?.reservationFacilityBookings ??
      []
    return (raw as ReservationFacilityBooking[]).map(
      mapReservationBookingToDashboard
    )
  }, [bookingsData?.data])

  const filteredRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (room.guest?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      ),
    [rooms, searchTerm]
  )

  const filteredCheckouts: Checkout[] = useMemo(() => {
    const list = todayCheckoutsData?.data ?? []
    return list.map((r) => ({
      id: r.id,
      room: r.room?.number ?? r.roomId,
      guestName: r.user ? `${r.user.firstName} ${r.user.lastName}` : r.clientId,
      status: (r.status === "checked_out" ? "completed" : "pending") as Checkout["status"],
      balance: 0,
      lateCheckout: false,
    }))
  }, [todayCheckoutsData])

  const checkoutsCompletedCount = useMemo(
    () => filteredCheckouts.filter((c) => c.status === "completed").length,
    [filteredCheckouts]
  )
  const checkoutsPendingCount = useMemo(
    () => filteredCheckouts.filter((c) => c.status === "pending").length,
    [filteredCheckouts]
  )
  const requests: CleaningRequest[] = []

  const dateColumns = useMemo(
    () => generateDateColumns(currentDate, timelineMode),
    [currentDate, timelineMode]
  )

  const getRoomStatusForDateWithReservations = useCallback(
    (room: Room, date: Date) =>
      getRoomStatusForDate(room, date, reservationsByRoomId[room.id] ?? []),
    [reservationsByRoomId]
  )

  const getStatusLabel = (
    status: RoomStatus | "booked" | StaffStatus
  ): string => {
    const labels: Record<string, string> = {
      available: t("admin.available"),
      occupied: t("admin.occupied"),
      maintenance: t("admin.maintenance"),
      reserved: t("admin.reserved"),
      booked: t("admin.booked"),
      busy: t("admin.busy"),
      off: t("admin.off"),
    }
    return labels[status] ?? status
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (timelineMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(
        newDate.getMonth() + (direction === "next" ? 1 : -1)
      )
    }
    setCurrentDate(newDate)
  }

  const convertISOToLocaleFormat = (isoDate: string): string => formatDate(isoDate)

  const handleCompleteCheckout = useCallback(async (checkoutId: string) => {
    try {
      await completeCheckout(checkoutId).unwrap()
      toast({ title: "Checkout completado", description: "La habitación quedó liberada." })
    } catch {
      toast({ title: "Error", description: "No se pudo completar el checkout.", variant: "destructive" })
    }
  }, [completeCheckout, toast])

  const facilityBookingSuggestions = useMemo(
    () =>
      Array.from(
        new Set(bookings.map((b) => b.clientName).filter(Boolean))
      ) as string[],
    [bookings]
  )

  const getTasksForTimeSlot = useCallback(
    (staffId: string, timeSlot: string): StaffTask[] => {
      const bounds = SLOT_BOUNDS[timeSlot]
      if (!bounds) return []
      const [start, end] = bounds
      return staffTasks.filter((task) => {
        if (task.userId !== staffId) return false
        const hour = new Date(task.scheduledStartAt).getHours()
        return hour >= start && hour < end
      })
    },
    [staffTasks]
  )

  const handleCreateMaintenanceActivity = useCallback(
    async (payload: MaintenanceActivityFormPayload) => {
      console.log(payload.assignedStaffId)
      try {
        await createStaffTask({
          userId: payload.assignedStaffId,
          scheduledStartAt: new Date(
            `${payload.scheduledDate}T${payload.scheduledTime}`
          ).toISOString(),
          description: payload.description,
        }).unwrap()
        toast({ title: "Éxito", description: "Tarea creada correctamente." })
      } catch {
        toast({
          title: "Error",
          description: "No se pudo crear la tarea.",
          variant: "destructive",
        })
      }
    },
    [createStaffTask, toast]
  )

  const handleCreateRoomBooking = async (payload: RoomBookingFormPayload) => {
    if (!payload.clientId) {
      toast({
        title: "Error",
        description: "Seleccione un cliente de la lista.",
        variant: "destructive",
      })
      return
    }
    try {
      await createReservation({
        roomId: payload.roomId,
        clientId: payload.clientId,
        checkIn: moment.tz(payload.checkIn, 'YYYY-MM-DD', timezone).startOf('day').toISOString(),
        checkOut: moment.tz(payload.checkOut, 'YYYY-MM-DD', timezone).startOf('day').toISOString(),
      }).unwrap()
      toast({
        title: "Éxito",
        description: "Reserva creada correctamente.",
      })
      refetchRooms()
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear la reserva.",
        variant: "destructive",
      })
    }
  }

  if (roomsLoading && activeTab === "rooms") {
    return (
      <div className="p-8">
        <div className="animate-pulse rounded-lg bg-muted h-64" />
      </div>
    )
  }

  return (
    <DashboardView
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      timelineMode={timelineMode}
      setTimelineMode={setTimelineMode}
      currentDate={currentDate}
      onCurrentDateChange={setCurrentDate}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchName={searchName}
      onSearchNameChange={setSearchName}
      filterDepartment={filterDepartment}
      onFilterDepartmentChange={setFilterDepartment}
      filteredRooms={filteredRooms}
      dateColumns={dateColumns}
      staffMembers={staffMembers}
      requests={requests}
      getTasksForTimeSlot={getTasksForTimeSlot}
      facilities={facilities}
      bookings={bookings}
      filteredCheckouts={filteredCheckouts}
      checkoutSearchRoom={checkoutSearchRoom}
      onCheckoutSearchRoomChange={setCheckoutSearchRoom}
      checkoutSearchGuest={checkoutSearchGuest}
      onCheckoutSearchGuestChange={setCheckoutSearchGuest}
      checkoutSearchStatus={checkoutSearchStatus}
      onCheckoutSearchStatusChange={setCheckoutSearchStatus}
      checkoutsCompletedCount={checkoutsCompletedCount}
      checkoutsPendingCount={checkoutsPendingCount}
      onCompleteCheckout={handleCompleteCheckout}
      onShowBookingsDetail={() => { }}
      navigateDate={navigateDate}
      convertISOToLocaleFormat={convertISOToLocaleFormat}
      getStatusColor={getStatusColor}
      getStatusLabel={getStatusLabel}
      getRoomStatusForDate={getRoomStatusForDateWithReservations}
      getStatusText={getStatusText}
      getRequestStatusColor={getRequestStatusColor}
      getRequestStatusText={getRequestStatusText}
      t={t}
      language={language}
      orgId={orgId}
      rooms={rooms}
      roomBookingClients={roomBookingClients}
      facilityBookingSuggestions={facilityBookingSuggestions}
      onCreateRoomBooking={handleCreateRoomBooking}
      onCreateMaintenanceActivity={handleCreateMaintenanceActivity}
      onAddFacilityBooking={() => { }}
      facilitySlots={facilitySlots}
    />
  )
}

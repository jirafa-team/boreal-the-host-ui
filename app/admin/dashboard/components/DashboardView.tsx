"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/shared/types/routes"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Hotel,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  Calendar,
  Plus,
  CheckSquare,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getBookingsAtSlot,
  getBookingForSlot,
  getOccupancyPercentage,
  isBookingStart,
  isMultiPartyFacility,
  STAFF_TIME_SLOTS,
  getFacilityTimeSlotsArray,
} from "../utils"
import type {
  Booking,
  Checkout,
  DateColumn,
  Facility,
  Room,
  StaffMember,
  CleaningRequest,
  DashboardTab,
  RoomStatus,
  StaffStatus,
  RoomBookingClient,
  RoomBookingFormPayload,
  MaintenanceActivityFormPayload,
  FacilityBookingFormPayload,
} from "./types"

type TFunction = (key: string) => string

export type DashboardViewProps = {
  activeTab: DashboardTab
  setActiveTab: (tab: DashboardTab) => void
  timelineMode: "week" | "month"
  setTimelineMode: (mode: "week" | "month") => void
  currentDate: Date
  onCurrentDateChange: (date: Date) => void
  searchTerm: string
  onSearchTermChange: (value: string) => void
  searchName: string
  onSearchNameChange: (value: string) => void
  filterDepartment: string
  onFilterDepartmentChange: (value: string) => void
  filteredRooms: Room[]
  dateColumns: DateColumn[]
  staffMembers: StaffMember[]
  requests: CleaningRequest[]
  getTasksForTimeSlot: (staffName: string, timeSlot: string) => CleaningRequest[]
  facilities: Facility[]
  bookings: Booking[]
  filteredCheckouts: Checkout[]
  checkoutSearchRoom: string
  onCheckoutSearchRoomChange: (value: string) => void
  checkoutSearchGuest: string
  onCheckoutSearchGuestChange: (value: string) => void
  checkoutSearchStatus: string
  onCheckoutSearchStatusChange: (value: string) => void
  checkoutsCompletedCount: number
  checkoutsPendingCount: number
  onCompleteCheckout: (checkoutId: number) => void
  onShowBookingsDetail: (bookingsList: Booking[]) => void
  navigateDate: (direction: "prev" | "next") => void
  convertISOToLocaleFormat: (isoDate: string) => string
  getStatusColor: (status: RoomStatus | "booked" | StaffStatus) => string
  getStatusLabel: (status: RoomStatus | "booked" | StaffStatus) => string
  getRoomStatusForDate: (room: Room, date: Date) => RoomStatus
  getStatusText: (status: StaffStatus) => string
  getRequestStatusColor: (status: string) => string
  getRequestStatusText: (status: string) => string
  t: TFunction
  language: string
  orgId: string | undefined
  /** All rooms (for room booking dialog select) */
  rooms: Room[]
  /** Clients for room booking autocomplete */
  roomBookingClients: RoomBookingClient[]
  /** Client name suggestions for facility booking autocomplete */
  facilityBookingSuggestions: string[]
  onCreateRoomBooking: (payload: RoomBookingFormPayload) => void
  onCreateMaintenanceActivity: (payload: MaintenanceActivityFormPayload) => void
  onAddFacilityBooking: (payload: FacilityBookingFormPayload) => void
}

export function DashboardView({
  activeTab,
  setActiveTab,
  timelineMode,
  setTimelineMode,
  currentDate,
  onCurrentDateChange,
  searchTerm,
  onSearchTermChange,
  searchName,
  onSearchNameChange,
  filterDepartment,
  onFilterDepartmentChange,
  filteredRooms,
  dateColumns,
  staffMembers,
  getTasksForTimeSlot,
  facilities,
  bookings,
  filteredCheckouts,
  checkoutSearchRoom,
  onCheckoutSearchRoomChange,
  checkoutSearchGuest,
  onCheckoutSearchGuestChange,
  checkoutSearchStatus,
  onCheckoutSearchStatusChange,
  checkoutsCompletedCount,
  checkoutsPendingCount,
  onCompleteCheckout,
  onShowBookingsDetail,
  navigateDate,
  convertISOToLocaleFormat,
  getStatusColor,
  getStatusLabel,
  getRoomStatusForDate,
  getStatusText,
  getRequestStatusColor,
  getRequestStatusText,
  t,
  language,
  orgId,
  rooms,
  roomBookingClients,
  facilityBookingSuggestions,
  onCreateRoomBooking,
  onCreateMaintenanceActivity,
  onAddFacilityBooking,
}: DashboardViewProps) {
  const router = useRouter()
  const timeSlotsArray = getFacilityTimeSlotsArray()

  const [showRoomBookingDialog, setShowRoomBookingDialog] = useState(false)
  const [showMaintenanceActivityDialog, setShowMaintenanceActivityDialog] =
    useState(false)
  const [showFacilityBookingDialog, setShowFacilityBookingDialog] =
    useState(false)

  const [roomBookingRoomId, setRoomBookingRoomId] = useState("")
  const [roomBookingClientSearch, setRoomBookingClientSearch] = useState("")
  const [roomBookingClientName, setRoomBookingClientName] = useState("")
  const [roomBookingPeople, setRoomBookingPeople] = useState(1)
  const [roomBookingCheckIn, setRoomBookingCheckIn] = useState("")
  const [roomBookingCheckOut, setRoomBookingCheckOut] = useState("")
  const [showRoomClientSuggestions, setShowRoomClientSuggestions] =
    useState(false)

  const [maintenanceDescription, setMaintenanceDescription] = useState("")
  const [maintenancePriority, setMaintenancePriority] = useState<
    "normal" | "urgent"
  >("normal")
  const [maintenanceDeliveryTime, setMaintenanceDeliveryTime] = useState("1")
  const [maintenanceAssignedStaffId, setMaintenanceAssignedStaffId] =
    useState("")
  const [maintenanceScheduledDate, setMaintenanceScheduledDate] = useState("")
  const [maintenanceScheduledTime, setMaintenanceScheduledTime] = useState("")

  const [facilityBookingFacilityId, setFacilityBookingFacilityId] = useState("")
  const [facilityBookingClientName, setFacilityBookingClientName] = useState("")
  const [facilityBookingClientRoom, setFacilityBookingClientRoom] = useState("")
  const [facilityBookingPeople, setFacilityBookingPeople] = useState(1)
  const [facilityBookingTime, setFacilityBookingTime] = useState("")
  const [facilityBookingDuration, setFacilityBookingDuration] = useState(60)
  const [facilityClientSearchTerm, setFacilityClientSearchTerm] = useState("")
  const [showFacilityClientSuggestions, setShowFacilityClientSuggestions] =
    useState(false)

  const filteredRoomBookingClients = useMemo(
    () =>
      roomBookingClients.filter(
        (c) =>
          c.name.toLowerCase().includes(roomBookingClientSearch.toLowerCase()) ||
          c.email.toLowerCase().includes(roomBookingClientSearch.toLowerCase())
      ),
    [roomBookingClients, roomBookingClientSearch]
  )

  const filteredFacilityBookingSuggestions = useMemo(
    () =>
      facilityBookingSuggestions.filter((name) =>
        name.toLowerCase().includes(facilityClientSearchTerm.toLowerCase())
      ),
    [facilityBookingSuggestions, facilityClientSearchTerm]
  )

  const maintenanceStaffMembers = useMemo(
    () =>
      staffMembers.filter((m) => m.department === "Mantenimiento"),
    [staffMembers]
  )

  const availableRooms = useMemo(
    () => rooms.filter((r) => r.status === "available"),
    [rooms]
  )

  return (
    <div>
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {activeTab === "rooms" && t("admin.roomsTimeline")}
                {activeTab === "staff" && "Estado de Personal"}
                {activeTab === "facilities" && "Timeline de Amenities"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === "rooms" && t("admin.viewRealTimeStatus")}
                {activeTab === "staff" &&
                  "Gestiona y visualiza el estado del personal en tiempo real"}
                {activeTab === "facilities" &&
                  "Visualiza la disponibilidad y ocupación de los amenities"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("rooms")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "rooms"
                  ? "bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-purple-600 to-purple-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6" />
              <Hotel className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Habitaciones</span>
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "staff"
                  ? "bg-gradient-to-br from-lime-600 to-lime-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-lime-600 to-lime-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6" />
              <Users className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Personal</span>
            </button>
            <button
              onClick={() => setActiveTab("facilities")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "facilities"
                  ? "bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-orange-600 to-orange-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6" />
              <Building2 className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Amenities</span>
            </button>
            <button
              onClick={() => setActiveTab("checkouts")}
              className={`group relative overflow-hidden rounded-lg px-5 py-2 text-white transition-all duration-300 text-xs font-medium ${
                activeTab === "checkouts"
                  ? "bg-gradient-to-br from-red-600 to-red-700 shadow-lg scale-105 ring-2 ring-white ring-opacity-50"
                  : "bg-gradient-to-br from-red-600 to-red-700 opacity-60 hover:opacity-75 shadow-sm hover:shadow-md hover:scale-105"
              }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white opacity-10 rounded-full -mr-6 -mt-6" />
              <CheckCircle2 className="w-4 h-4 inline mr-2 relative z-10" />
              <span className="relative z-10">Check-outs del Día</span>
            </button>
          </div>
        </div>
      </header>

      {filteredRooms.length === 0 && activeTab === "rooms" && (
        <Card className="p-12 text-center m-8 mt-6">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {t("admin.noRoomsFound")}
          </p>
        </Card>
      )}

      {activeTab === "rooms" && (
        <div className="px-8 py-6">
          <Card className="p-6 overflow-x-auto">
            <div className="flex items-end justify-between gap-4 mb-6 pb-6 border-b border-border flex-wrap">
              <div className="flex-1 max-w-xs">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Buscar habitación
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ej: 101, 205..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${timelineMode === "week" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    Semana
                  </span>
                  <button
                    onClick={() =>
                      setTimelineMode(timelineMode === "week" ? "month" : "week")
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      timelineMode === "month" ? "bg-lime-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        timelineMode === "month"
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm font-medium ${timelineMode === "month" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    Mes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateDate("prev")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={
                      language === "es" || language === "pt"
                        ? "Fecha anterior"
                        : "Previous date"
                    }
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <input
                      type="date"
                      value={currentDate.toISOString().split("T")[0]}
                      onChange={(e) =>
                        onCurrentDateChange(new Date(e.target.value))
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="pointer-events-none flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-40">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {convertISOToLocaleFormat(
                          currentDate.toISOString().split("T")[0]
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateDate("next")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={
                      language === "es" || language === "pt"
                        ? "Fecha siguiente"
                        : "Next date"
                    }
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <Dialog
                  open={showRoomBookingDialog}
                  onOpenChange={setShowRoomBookingDialog}
                >
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                      style={{ backgroundColor: "#1557F6" }}
                      title="Crear reserva"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Crear reserva
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Crear Reserva de Habitación</DialogTitle>
                      <DialogDescription>
                        Ingresa los datos de la nueva reserva
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="room-select">Habitación</Label>
                        <Select
                          value={roomBookingRoomId}
                          onValueChange={setRoomBookingRoomId}
                        >
                          <SelectTrigger id="room-select">
                            <SelectValue placeholder="Seleccionar habitación" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRooms.map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.number} - {room.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="guest-select">Cliente</Label>
                        <div className="relative">
                          <Input
                            id="guest-select"
                            placeholder="Buscar cliente..."
                            value={
                              showRoomClientSuggestions
                                ? roomBookingClientSearch
                                : roomBookingClientName
                            }
                            onChange={(e) => {
                              setRoomBookingClientSearch(e.target.value)
                              setRoomBookingClientName(e.target.value)
                              setShowRoomClientSuggestions(true)
                            }}
                            onFocus={() => setShowRoomClientSuggestions(true)}
                          />
                          {showRoomClientSuggestions && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              {filteredRoomBookingClients.length > 0 ? (
                                filteredRoomBookingClients.map((client) => (
                                  <button
                                    key={client.id}
                                    type="button"
                                    onClick={() => {
                                      setRoomBookingClientName(client.name)
                                      setRoomBookingClientSearch(client.name)
                                      setShowRoomClientSuggestions(false)
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-muted border-b last:border-b-0 transition-colors"
                                  >
                                    <p className="font-medium text-sm">
                                      {client.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {client.email} - Habitación {client.room}
                                    </p>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-sm text-muted-foreground">
                                  No se encontraron clientes
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="people-count">Cantidad de Personas</Label>
                        <Input
                          id="people-count"
                          type="number"
                          min={1}
                          max={10}
                          value={roomBookingPeople}
                          onChange={(e) =>
                            setRoomBookingPeople(
                              Math.min(
                                10,
                                Math.max(1, parseInt(e.target.value, 10) || 1)
                              )
                            )
                          }
                          placeholder="Número de personas"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="check-in">Check-in</Label>
                          <Input
                            id="check-in"
                            type="date"
                            value={roomBookingCheckIn}
                            onChange={(e) =>
                              setRoomBookingCheckIn(e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="check-out">Check-out</Label>
                          <Input
                            id="check-out"
                            type="date"
                            value={roomBookingCheckOut}
                            onChange={(e) =>
                              setRoomBookingCheckOut(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          if (
                            roomBookingRoomId &&
                            roomBookingClientName &&
                            roomBookingCheckIn &&
                            roomBookingCheckOut
                          ) {
                            onCreateRoomBooking({
                              roomId: roomBookingRoomId,
                              clientName: roomBookingClientName,
                              people: roomBookingPeople,
                              checkIn: roomBookingCheckIn,
                              checkOut: roomBookingCheckOut,
                            })
                            setShowRoomBookingDialog(false)
                            setRoomBookingRoomId("")
                            setRoomBookingClientSearch("")
                            setRoomBookingClientName("")
                            setRoomBookingPeople(1)
                            setRoomBookingCheckIn("")
                            setRoomBookingCheckOut("")
                          }
                        }}
                      >
                        Crear Reserva
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="min-w-max">
              <div className="flex border-b border-border mb-4">
                <div className="w-48 flex-shrink-0 pr-4 pb-4">
                  <p className="text-sm font-semibold text-foreground">
                    {t("admin.roomNumber")}
                  </p>
                </div>
                <div className="flex gap-1 pb-4">
                  {dateColumns.map((col, idx) => (
                    <div
                      key={idx}
                      className={`${timelineMode === "week" ? "w-24" : "w-12"} text-center flex-shrink-0`}
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        {col.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center border-b border-border pb-2 last:border-b-0"
                  >
                    <div className="w-48 flex-shrink-0 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(room.status)}`}
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {t("admin.roomNumber")} {room.number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {room.type} · {t("admin.floorLabel")} {room.floor}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {dateColumns.map((col, idx) => {
                        const status = getRoomStatusForDate(room, col.date)
                        return (
                          <div
                            key={idx}
                            className={`${timelineMode === "week" ? "w-24" : "w-12"} h-12 rounded flex-shrink-0 ${
                              status === "available"
                                ? "bg-green-100 border border-green-200"
                                : status === "occupied"
                                  ? "bg-red-100 border border-red-200"
                                  : status === "reserved"
                                    ? "bg-blue-100 border border-blue-200"
                                    : "bg-yellow-100 border border-yellow-200"
                            } flex items-center justify-center group relative cursor-pointer hover:shadow-md transition-shadow`}
                          >
                            {status !== "available" && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                  {status === "occupied"
                                    ? t("admin.roomOccupied")
                                    : status === "reserved"
                                      ? t("admin.roomReserved")
                                      : t("admin.roomMaintenance")}
                                  {room.guest && (
                                    <div className="text-[10px]">
                                      {room.guest}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                <span className="text-xs text-muted-foreground">
                  {t("admin.legendAvailable")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
                <span className="text-xs text-muted-foreground">
                  {t("admin.legendOccupied")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
                <span className="text-xs text-muted-foreground">
                  {t("admin.legendReserved")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
                <span className="text-xs text-muted-foreground">
                  {t("admin.legendMaintenance")}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "staff" && (
        <div className="px-8 py-6">
          <Card className="p-6">
            <Card className="p-4 mb-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label
                    htmlFor="search-name"
                    className="text-sm font-medium"
                  >
                    Buscar por nombre
                  </Label>
                  <Input
                    id="search-name"
                    placeholder="Ej: María, Roberto..."
                    value={searchName}
                    onChange={(e) => onSearchNameChange(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="w-48">
                  <Label
                    htmlFor="filter-dept"
                    className="text-sm font-medium"
                  >
                    Filtrar por departamento
                  </Label>
                  <Select
                    value={filterDepartment}
                    onValueChange={onFilterDepartmentChange}
                  >
                    <SelectTrigger id="filter-dept" className="mt-2">
                      <SelectValue placeholder="Todos los departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todos los departamentos
                      </SelectItem>
                      <SelectItem value="Limpieza">Limpieza</SelectItem>
                      <SelectItem value="Mantenimiento">
                        Mantenimiento
                      </SelectItem>
                      <SelectItem value="Seguridad">Seguridad</SelectItem>
                      <SelectItem value="Recepción">Recepción</SelectItem>
                      <SelectItem value="Servicio">Servicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog
                  open={showMaintenanceActivityDialog}
                  onOpenChange={setShowMaintenanceActivityDialog}
                >
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                      style={{ backgroundColor: "#1557F6" }}
                      title="Crear Actividad"
                    >
                      <CheckSquare className="w-5 h-5" />
                      <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Crear Actividad
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Crear Actividad</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label
                          htmlFor="maintenance-description"
                          className="text-sm font-medium"
                        >
                          Descripción
                        </Label>
                        <Input
                          id="maintenance-description"
                          placeholder="Describe la actividad..."
                          value={maintenanceDescription}
                          onChange={(e) =>
                            setMaintenanceDescription(e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maintenance-priority"
                          className="text-sm font-medium"
                        >
                          Prioridad
                        </Label>
                        <Select
                          value={maintenancePriority}
                          onValueChange={(v: "normal" | "urgent") =>
                            setMaintenancePriority(v)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="maintenance-time"
                          className="text-sm font-medium"
                        >
                          Tiempo de entrega (horas)
                        </Label>
                        <Input
                          id="maintenance-time"
                          type="number"
                          min={1}
                          max={24}
                          value={maintenanceDeliveryTime}
                          onChange={(e) =>
                            setMaintenanceDeliveryTime(e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="assign-staff"
                          className="text-sm font-medium"
                        >
                          Asignar a
                        </Label>
                        <Select
                          value={maintenanceAssignedStaffId}
                          onValueChange={setMaintenanceAssignedStaffId}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecciona personal" />
                          </SelectTrigger>
                          <SelectContent>
                            {maintenanceStaffMembers.map((member) => (
                              <SelectItem
                                key={member.id}
                                value={member.id.toString()}
                              >
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label
                            htmlFor="scheduled-date"
                            className="text-sm font-medium"
                          >
                            Fecha Programada
                          </Label>
                          <Input
                            id="scheduled-date"
                            type="date"
                            value={maintenanceScheduledDate}
                            onChange={(e) =>
                              setMaintenanceScheduledDate(e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="scheduled-time"
                            className="text-sm font-medium"
                          >
                            Hora Programada
                          </Label>
                          <Input
                            id="scheduled-time"
                            type="time"
                            value={maintenanceScheduledTime}
                            onChange={(e) =>
                              setMaintenanceScheduledTime(e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setShowMaintenanceActivityDialog(false)
                        }
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          if (
                            maintenanceDescription &&
                            maintenanceAssignedStaffId
                          ) {
                            onCreateMaintenanceActivity({
                              description: maintenanceDescription,
                              priority: maintenancePriority,
                              deliveryTime: maintenanceDeliveryTime,
                              assignedStaffId: maintenanceAssignedStaffId,
                              scheduledDate: maintenanceScheduledDate,
                              scheduledTime: maintenanceScheduledTime,
                            })
                            setShowMaintenanceActivityDialog(false)
                            setMaintenanceDescription("")
                            setMaintenancePriority("normal")
                            setMaintenanceDeliveryTime("1")
                            setMaintenanceAssignedStaffId("")
                            setMaintenanceScheduledDate("")
                            setMaintenanceScheduledTime("")
                          }
                        }}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        Crear
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="flex gap-2 mb-4 sticky left-0">
                  <div className="w-48 flex-shrink-0">
                    <div className="h-16 flex items-center justify-center bg-muted rounded-lg border border-border">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Personal
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {STAFF_TIME_SLOTS.map((timeSlot) => (
                      <div
                        key={timeSlot}
                        className="w-32 flex-shrink-0"
                      >
                        <div className="h-16 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                          <Clock className="w-4 h-4 text-primary mb-1" />
                          <span className="text-xs font-medium text-foreground">
                            {timeSlot}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {staffMembers
                    .filter((s) => s.status !== "off")
                    .filter((s) =>
                      s.name
                        .toLowerCase()
                        .includes(searchName.toLowerCase())
                    )
                    .filter(
                      (s) =>
                        filterDepartment === "all" ||
                        s.department === filterDepartment
                    )
                    .map((member) => (
                      <div key={member.id} className="flex gap-2">
                        <div className="w-48 flex-shrink-0 sticky left-0 bg-background">
                          <Card className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-full">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {member.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground text-sm truncate">
                                  {member.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    className={
                                      getStatusColor(member.status) +
                                      " text-white text-xs py-0"
                                    }
                                  >
                                    {getStatusText(member.status)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {member.tasksToday}/{member.maxCapacity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                        <div className="flex gap-2">
                          {STAFF_TIME_SLOTS.map((timeSlot) => {
                            const tasksInSlot = getTasksForTimeSlot(
                              member.name,
                              timeSlot
                            )
                            const hasTask = tasksInSlot.length > 0
                            return (
                              <div
                                key={timeSlot}
                                className="w-32 flex-shrink-0"
                              >
                                {hasTask ? (
                                  <div className="space-y-2">
                                    {tasksInSlot.map((task) => (
                                      <Card
                                        key={task.id}
                                        className="p-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:shadow-lg transition-all cursor-pointer h-full"
                                      >
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center justify-between">
                                            <span className="font-semibold text-foreground text-xs">
                                              {task.roomNumber}
                                            </span>
                                            {task.priority === "urgent" && (
                                              <Badge
                                                variant="destructive"
                                                className="text-[10px] px-1 py-0"
                                              >
                                                !
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-muted-foreground truncate">
                                            {task.guestName}
                                          </p>
                                          <Badge
                                            className={
                                              getRequestStatusColor(
                                                task.status
                                              ) + " text-[10px] px-1 py-0"
                                            }
                                          >
                                            {getRequestStatusText(task.status)}
                                          </Badge>
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="h-full min-h-[80px] bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground/50">
                                      Libre
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "facilities" && (
        <div className="px-8 py-6">
          <div className="mb-4 flex justify-end">
            <Dialog
              open={showFacilityBookingDialog}
              onOpenChange={setShowFacilityBookingDialog}
            >
              <DialogTrigger asChild>
                <button
                  className="relative group w-10 h-10 rounded-full text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                  style={{ backgroundColor: "#1557F6" }}
                  title="Nueva Reserva"
                >
                  <div className="relative">
                    <Calendar className="w-5 h-5" />
                    <span
                      className="absolute -top-1 -right-1 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        fontSize: "10px",
                        backgroundColor: "#1557F6",
                      }}
                    >
                      +
                    </span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Nueva Reserva
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg">
                    Reserva Manual
                  </DialogTitle>
                  <DialogDescription>
                    Crear una nueva reserva para un cliente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5">
                  <div>
                    <Label
                      htmlFor="facility"
                      className="text-sm font-medium mb-2 block"
                    >
                      Amenity
                    </Label>
                    <Select
                      value={facilityBookingFacilityId}
                      onValueChange={setFacilityBookingFacilityId}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecciona un amenity" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem
                            key={facility.id}
                            value={facility.id}
                          >
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="clientName"
                      className="text-sm font-medium mb-2 block"
                    >
                      Nombre del Cliente
                    </Label>
                    <div className="relative">
                      <Input
                        id="clientName"
                        value={facilityBookingClientName}
                        onChange={(e) => {
                          setFacilityBookingClientName(e.target.value)
                          setFacilityClientSearchTerm(e.target.value)
                          setShowFacilityClientSuggestions(true)
                        }}
                        placeholder="Comienza a escribir el nombre"
                        className="h-11"
                      />
                      {showFacilityClientSuggestions &&
                        filteredFacilityBookingSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-popover border border-border rounded-lg shadow-lg z-50">
                            {filteredFacilityBookingSuggestions.map(
                              (name) => (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={() => {
                                    setFacilityBookingClientName(name)
                                    setFacilityClientSearchTerm(name)
                                    setShowFacilityClientSuggestions(false)
                                    const fromBooking = bookings.find(
                                      (b) => b.clientName === name
                                    )
                                    if (fromBooking) {
                                      setFacilityBookingClientRoom(
                                        fromBooking.clientRoom
                                      )
                                    }
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-muted border-b last:border-b-0 text-sm"
                                >
                                  {name}
                                </button>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="clientRoom"
                      className="text-sm font-medium mb-2 block"
                    >
                      Habitación
                    </Label>
                    <Input
                      id="clientRoom"
                      value={facilityBookingClientRoom}
                      onChange={(e) =>
                        setFacilityBookingClientRoom(e.target.value)
                      }
                      placeholder="Auto-llenado por cliente"
                      className="h-11 bg-muted"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Número de Personas
                    </Label>
                    <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                      <button
                        type="button"
                        onClick={() =>
                          setFacilityBookingPeople((p) => Math.max(1, p - 1))
                        }
                        className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted font-semibold"
                      >
                        −
                      </button>
                      <span className="text-lg font-bold w-12 text-center">
                        {facilityBookingPeople}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFacilityBookingPeople((p) => p + 1)
                        }
                        className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="time"
                      className="text-sm font-medium mb-2 block"
                    >
                      Hora de Inicio
                    </Label>
                    <Select
                      value={facilityBookingTime}
                      onValueChange={setFacilityBookingTime}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecciona hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlotsArray.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="duration"
                      className="text-sm font-medium mb-2 block"
                    >
                      Duración
                    </Label>
                    <Select
                      value={facilityBookingDuration.toString()}
                      onValueChange={(v) =>
                        setFacilityBookingDuration(parseInt(v, 10))
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 Hora</SelectItem>
                        <SelectItem value="120">2 Horas</SelectItem>
                        <SelectItem value="180">3 Horas</SelectItem>
                        <SelectItem value="240">4 Horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => {
                      if (
                        facilityBookingFacilityId &&
                        facilityBookingClientName &&
                        facilityBookingTime
                      ) {
                        onAddFacilityBooking({
                          facilityId: facilityBookingFacilityId,
                          clientName: facilityBookingClientName,
                          clientRoom: facilityBookingClientRoom,
                          people: facilityBookingPeople,
                          time: facilityBookingTime,
                          duration: facilityBookingDuration,
                        })
                        setShowFacilityBookingDialog(false)
                        setFacilityBookingFacilityId("")
                        setFacilityBookingClientName("")
                        setFacilityBookingClientRoom("")
                        setFacilityBookingPeople(1)
                        setFacilityBookingTime("")
                        setFacilityBookingDuration(60)
                        setFacilityClientSearchTerm("")
                      }
                    }}
                    className="w-full h-11 font-medium"
                  >
                    Crear Reserva
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <div style={{ width: "fit-content", minWidth: "100%" }}>
                <div className="flex border-b border-border bg-muted/50 sticky top-0 z-10">
                  <div className="w-64 p-4 font-semibold border-r border-border bg-muted/50 shrink-0">
                    Facility
                  </div>
                  {timeSlotsArray.map((slot) => (
                    <div
                      key={slot}
                      className="w-32 p-3 text-center text-sm font-medium border-r border-border shrink-0"
                    >
                      {slot}
                    </div>
                  ))}
                </div>

                {facilities.map((facility, idx) => {
                  const Icon = facility.icon
                  return (
                    <div
                      key={facility.id}
                      className={`flex ${idx % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
                    >
                      <div className="w-64 p-4 border-r border-border flex items-center gap-3 shrink-0 group relative">
                        <div
                          className={`${facility.color} p-2 rounded-lg shrink-0`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {facility.name}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {facility.type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Cap. {facility.capacity}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {facility.startTime} - {facility.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        {timeSlotsArray.map((slot) => {
                          const bookingAtStart = isBookingStart(
                            facility.id,
                            bookings,
                            slot
                          )
                          const booking = getBookingForSlot(
                            facility.id,
                            bookings,
                            slot
                          )
                          const slotBookings = getBookingsAtSlot(
                            facility.id,
                            bookings,
                            slot
                          )
                          const occupancy = getOccupancyPercentage(
                            facility.id,
                            bookings,
                            facilities,
                            slot
                          )

                          if (bookingAtStart) {
                            const durationHours = bookingAtStart.duration / 60
                            return (
                              <div
                                key={slot}
                                className="relative border-r border-border group shrink-0"
                                style={{
                                  width: `${durationHours * 128}px`,
                                }}
                              >
                                <div
                                  className={`absolute inset-2 rounded-lg ${
                                    bookingAtStart.status === "confirmed"
                                      ? "bg-gradient-to-br from-green-500/30 to-green-600/20 border-2 border-green-500"
                                      : "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-2 border-amber-500"
                                  } p-3 flex flex-col justify-center hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] min-h-[72px]`}
                                  onClick={() =>
                                    slotBookings.length > 0 &&
                                    onShowBookingsDetail(slotBookings)
                                  }
                                >
                                  {isMultiPartyFacility(facility.type) ? (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <p className="text-lg font-bold text-foreground">
                                        {slotBookings.length}/
                                        {facility.capacity}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground">
                                        Ocupación: {occupancy}%
                                      </p>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm font-bold truncate text-foreground">
                                        {slotBookings.length > 1
                                          ? `${slotBookings.length} participantes`
                                          : bookingAtStart.clientName}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground truncate">
                                        {slotBookings.length > 1
                                          ? `Ocupación: ${occupancy}%`
                                          : `Hab. ${bookingAtStart.clientRoom}`}
                                      </p>
                                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5 flex items-center gap-2">
                                        <span>
                                          {bookingAtStart.duration / 60}h
                                        </span>
                                        {slotBookings.length > 0 && (
                                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                                            {slotBookings.length}/
                                            {facility.capacity}
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {slotBookings.length > 0 && (
                                    <div className="mt-2 w-full bg-black/10 rounded-full h-1.5">
                                      <div
                                        className={`h-1.5 rounded-full transition-all ${
                                          occupancy > 80
                                            ? "bg-red-500"
                                            : occupancy > 50
                                              ? "bg-amber-500"
                                              : "bg-green-500"
                                        }`}
                                        style={{ width: `${occupancy}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                  <div className="bg-popover border border-border rounded-lg shadow-xl p-4 min-w-[280px]">
                                    <p className="font-bold text-sm mb-3">
                                      Detalles del horario {slot}
                                    </p>
                                    {slotBookings.length > 0 ? (
                                      <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">
                                          <span className="font-medium">
                                            Ocupación:
                                          </span>{" "}
                                          {slotBookings.length}/
                                          {facility.capacity} ({occupancy}%)
                                        </p>
                                        {slotBookings.length <= 3 ? (
                                          <div className="space-y-2">
                                            {slotBookings.map((b, i) => (
                                              <div
                                                key={i}
                                                className="text-xs text-muted-foreground border-t border-border pt-2"
                                              >
                                                <p className="font-medium text-foreground">
                                                  {b.clientName}
                                                </p>
                                                <p>Hab. {b.clientRoom}</p>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <Button
                                            onClick={() =>
                                              onShowBookingsDetail(
                                                slotBookings
                                              )
                                            }
                                            className="mt-2 text-xs text-primary hover:underline font-medium"
                                          >
                                            Ver los {slotBookings.length}{" "}
                                            participantes →
                                          </Button>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">
                                        Sin reservas
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          if (booking) {
                            const slotBookingsAtTime = getBookingsAtSlot(
                              facility.id,
                              bookings,
                              slot
                            )
                            const occupancyAtTime = getOccupancyPercentage(
                              facility.id,
                              bookings,
                              facilities,
                              slot
                            )
                            if (slotBookingsAtTime.length > 0) {
                              return (
                                <div
                                  key={slot}
                                  className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                                  onClick={() =>
                                    onShowBookingsDetail(slotBookingsAtTime)
                                  }
                                >
                                  <div className="w-full space-y-2">
                                    <p className="text-xs font-medium text-foreground text-center">
                                      {slotBookingsAtTime.length}/
                                      {facility.capacity}
                                    </p>
                                    <div className="w-full bg-black/10 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all ${
                                          occupancyAtTime > 80
                                            ? "bg-red-500"
                                            : occupancyAtTime > 50
                                              ? "bg-amber-500"
                                              : "bg-green-500"
                                        }`}
                                        style={{
                                          width: `${occupancyAtTime}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }
                          return (
                            <div
                              key={slot}
                              className="w-32 border-r border-border p-2 shrink-0 min-h-[88px] flex items-center"
                            >
                              <div className="w-full border-2 border-dashed border-muted-foreground/20 rounded-md h-16 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                                <span className="text-xs text-muted-foreground/50 font-medium">
                                  Libre
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "checkouts" && (
        <div className="px-8 py-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Check-outs del Día
              </h2>
              <div className="flex gap-3">
                <div className="bg-green-50 rounded-lg px-6 py-4 border border-green-200 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-green-600 mb-2">
                    {checkoutsCompletedCount}
                  </p>
                  <p className="text-gray-600 text-xs">Completados</p>
                </div>
                <div className="bg-orange-50 rounded-lg px-6 py-4 border border-orange-200 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-orange-600 mb-2">
                    {checkoutsPendingCount}
                  </p>
                  <p className="text-gray-600 text-xs">Pendientes</p>
                </div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por Habitación
                </label>
                <input
                  type="text"
                  placeholder="Ej: 301"
                  value={checkoutSearchRoom}
                  onChange={(e) =>
                    onCheckoutSearchRoomChange(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por Cliente
                </label>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={checkoutSearchGuest}
                  onChange={(e) =>
                    onCheckoutSearchGuestChange(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Estado
                </label>
                <select
                  value={checkoutSearchStatus}
                  onChange={(e) =>
                    onCheckoutSearchStatusChange(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="completed">Completado</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">
                      Habitación
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 text-sm">
                      Cliente
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 text-sm">
                      Saldo Pendiente
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">
                      Adicionales
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">
                      Estado
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900 text-sm">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCheckouts.map((checkout) => (
                    <tr
                      key={checkout.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900 font-semibold">
                        #{checkout.room}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <button
                          onClick={() =>
                            router.push(
                              orgId
                                ? ROUTES.CLIENT_DETAIL(
                                    orgId,
                                    String(checkout.id)
                                  )
                                : `/admin/clients/${checkout.id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {checkout.guestName}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ${checkout.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {checkout.lateCheckout ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Late Check-out
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            checkout.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {checkout.status === "completed"
                            ? "Completado"
                            : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {checkout.status === "pending" ? (
                          <button
                            onClick={() => onCompleteCheckout(checkout.id)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-all hover:opacity-90"
                            style={{ backgroundColor: "#235E20" }}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Completar
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LayoutGrid, Search, Calendar } from "lucide-react"
import { CreateRoomDialog } from "./CreateRoomDialog"
import { EditRoomDialog } from "./EditRoomDialog"
import { RoomGrid } from "./RoomGrid"
import { StatsCards } from "./StatsCards"
import type { Room, RoomStatus, RoomStats, NewRoomForm, DateColumn } from "./types"

type TFunction = (key: string) => string

export type RoomsViewProps = {
  layoutMode: "grid" | "kanban"
  setLayoutMode: (mode: "grid" | "kanban") => void
  filteredRooms: Room[]
  searchTerm: string
  onSearchTermChange: (value: string) => void
  selectedDate: string
  onSelectedDateChange: (date: string) => void
  currentDate: Date
  onCurrentDateChange: (date: Date) => void
  selectedMonth: { year: number; month: number }
  onSelectedMonthChange: (month: { year: number; month: number }) => void
  timelineMode: "week" | "month"
  setTimelineMode: (mode: "week" | "month") => void
  statusFilter: RoomStatus | null
  onStatusFilterChange: (status: RoomStatus | null) => void
  stats: RoomStats
  dateColumns: DateColumn[]
  showCreateModal: boolean
  setShowCreateModal: (open: boolean) => void
  showEditModal: boolean
  setShowEditModal: (open: boolean) => void
  selectedRoom: Room | null
  setSelectedRoom: (room: Room | null) => void
  newRoom: NewRoomForm
  setNewRoom: (updater: (prev: NewRoomForm) => NewRoomForm) => void
  onCreateRoom: () => void
  onUpdateRoom: () => void
  onDeleteRoom: () => void
  getStatusColor: (status: RoomStatus) => string
  getStatusLabel: (status: RoomStatus) => string
  getRoomStatusForDate: (room: Room, date: Date) => RoomStatus
  navigateDate: (direction: "prev" | "next") => void
  convertISOToLocaleFormat: (isoDate: string) => string
  language: string
  t: TFunction
  roomTypes: Array<{ id: string; name: string }>
  isLoading?: boolean
  error?: unknown
}

export function RoomsView({
  layoutMode,
  setLayoutMode,
  filteredRooms,
  searchTerm,
  onSearchTermChange,
  selectedDate,
  onSelectedDateChange,
  currentDate,
  onCurrentDateChange,
  selectedMonth,
  onSelectedMonthChange,
  timelineMode,
  setTimelineMode,
  statusFilter,
  onStatusFilterChange,
  stats,
  dateColumns,
  showCreateModal,
  setShowCreateModal,
  showEditModal,
  setShowEditModal,
  selectedRoom,
  setSelectedRoom,
  newRoom,
  setNewRoom,
  onCreateRoom,
  onUpdateRoom,
  onDeleteRoom,
  getStatusColor,
  getStatusLabel,
  getRoomStatusForDate,
  navigateDate,
  convertISOToLocaleFormat,
  language,
  t,
  roomTypes,
  isLoading,
  error,
}: RoomsViewProps) {
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room)
    setShowEditModal(true)
  }

  const handleCloseEdit = (open: boolean) => {
    setShowEditModal(open)
    if (!open) setSelectedRoom(null)
  }

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("admin.roomsTitle")}</h1>
              <p className="text-sm text-muted-foreground">{t("admin.manageYourRooms")}</p>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                style={{ backgroundColor: "#1557F6" }}
                title={t("admin.createRoom")}
              >
                <div className="relative flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                  <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">
                    +
                  </span>
                </div>
                <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {t("admin.createRoom")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {isLoading && <p className="text-sm text-muted-foreground py-4">Cargando...</p>}
        {error != null && <p className="text-sm text-destructive py-4">Error al cargar habitaciones.</p>}
        {!isLoading && error == null && (
          <>
            {layoutMode === "grid" && (
              <StatsCards
                stats={stats}
                statusFilter={statusFilter}
                onFilterByStatus={onStatusFilterChange}
                t={t}
              />
            )}

            <Card className="p-6 mb-6">
              <div className="flex gap-4 items-center flex-wrap">
                <div className="relative flex-1 min-w-xs max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("admin.searchRoomsPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {layoutMode === "grid" && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {language === "es" || language === "pt" ? "Fecha:" : "Date:"}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onSelectedDateChange(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="pointer-events-none flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white w-40">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{convertISOToLocaleFormat(selectedDate)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {layoutMode === "grid" && (
              <RoomGrid
                rooms={filteredRooms}
                onEditRoom={handleEditRoom}
                getStatusLabel={getStatusLabel}
                t={t}
              />
            )}

            {filteredRooms.length === 0 && (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("admin.noRoomsFound")}</p>
              </Card>
            )}
          </>
        )}
      </div>

      <CreateRoomDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        newRoom={newRoom}
        onNewRoomChange={setNewRoom}
        onSubmit={onCreateRoom}
        t={t}
      />
      <EditRoomDialog
        open={showEditModal}
        onOpenChange={handleCloseEdit}
        room={selectedRoom}
        roomTypes={roomTypes}
        onRoomChange={(updater) => selectedRoom && setSelectedRoom(updater(selectedRoom))}
        onSave={onUpdateRoom}
        onDelete={onDeleteRoom}
        t={t}
      />
    </>
  )
}

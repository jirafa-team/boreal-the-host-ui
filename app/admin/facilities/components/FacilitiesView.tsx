"use client"

import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { AddFacilityDialog } from "./AddFacilityDialog"
import { BookingsDetailDialog } from "./BookingsDetailDialog"
import { EditFacilityDialog } from "./EditFacilityDialog"
import { FacilityList } from "./FacilityList"
import { FacilityTimeline } from "./FacilityTimeline"
import { NewBookingDialog } from "./NewBookingDialog"
import type { Booking, Facility, NewBookingForm } from "./types"
import { TaxonomyFacilityType } from "@/interfaces/taxonomy-facility-type/TaxonomyFacilityType"

type TFunction = (key: string) => string

export type FacilitiesViewProps = {
  viewMode: "list" | "timeline"
  setViewMode: (mode: "list" | "timeline") => void
  facilities: Facility[]
  facilitiesTypes: TaxonomyFacilityType[]
  bookings: Booking[]
  selectedDate: string
  onSelectedDateChange: (date: string) => void
  currentDate: Date
  setCurrentDate: (date: Date) => void
  timelineMode: "week" | "month"
  setTimelineMode: (mode: "week" | "month") => void
  addFacilityOpen: boolean
  setAddFacilityOpen: (open: boolean) => void
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  editingFacility: Facility | null
  bookingsDetailOpen: boolean
  setBookingsDetailOpen: (open: boolean) => void
  selectedSlotBookings: Booking[]
  setSelectedSlotBookings: (bookings: Booking[]) => void
  newBooking: NewBookingForm
  setNewBooking: (updater: (prev: NewBookingForm) => NewBookingForm) => void
  clientSuggestions: string[]
  setClientSuggestions: (s: string[]) => void
  showClientSuggestions: boolean
  setShowClientSuggestions: (v: boolean) => void
  onAddFacility: (e: React.FormEvent<HTMLFormElement>) => void
  onSaveEdit: (e: React.FormEvent<HTMLFormElement>) => void
  onAddBooking: () => void
  onEditFacility: (facility: Facility) => void
  onClientNameChange: (value: string) => void
  onSelectClient: (clientName: string) => void
  getBookingForSlot: (facilityId: string, time: string) => Booking | undefined
  isBookingStart: (facilityId: string, time: string) => Booking | undefined
  getBookingsAtSlot: (facilityId: string, timeSlot: string) => Booking[]
  getOccupancyPercentage: (facilityId: string, timeSlot: string) => number
  isMultiPartyFacility: (facilityType: string) => boolean
  navigateDate: (direction: "prev" | "next") => void
  language: string
  convertISOToLocaleFormat: (isoDate: string) => string
  t: TFunction
  timeSlots: string[]
  isLoading?: boolean
  error?: unknown
}

export function FacilitiesView({
  viewMode,
  setViewMode,
  facilities,
  facilitiesTypes,
  bookings,
  selectedDate,
  onSelectedDateChange,
  currentDate,
  setCurrentDate,
  timelineMode,
  setTimelineMode,
  addFacilityOpen,
  setAddFacilityOpen,
  dialogOpen,
  setDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  editingFacility,
  bookingsDetailOpen,
  setBookingsDetailOpen,
  selectedSlotBookings,
  setSelectedSlotBookings,
  newBooking,
  setNewBooking,
  clientSuggestions,
  showClientSuggestions,
  setShowClientSuggestions,
  onAddFacility,
  onSaveEdit,
  onAddBooking,
  onEditFacility,
  onClientNameChange,
  onSelectClient,
  getBookingForSlot,
  isBookingStart,
  getBookingsAtSlot,
  getOccupancyPercentage,
  isMultiPartyFacility,
  navigateDate,
  language,
  convertISOToLocaleFormat,
  t,
  timeSlots,
  isLoading,
  error,
}: FacilitiesViewProps) {
  const handleShowBookingsDetail = (bookingsList: Booking[]) => {
    setSelectedSlotBookings(bookingsList)
    setBookingsDetailOpen(true)
  }

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("admin.amenitiesManagement")}</h1>
              <p className="text-sm text-muted-foreground">Administra los amenities y espacios del hotel</p>
            </div>
            <div className="flex gap-4 items-center ml-auto">
              <div className="inline-flex h-10 items-center rounded-lg bg-gray-100 p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${viewMode === "list" ? "text-white shadow-md" : "text-gray-700 hover:text-gray-900"
                    }`}
                  style={viewMode === "list" ? { backgroundColor: "#394a63" } : {}}
                >
                  Lista
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("timeline")}
                  className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${viewMode === "timeline" ? "text-white shadow-md" : "text-gray-700 hover:text-gray-900"
                    }`}
                  style={viewMode === "timeline" ? { backgroundColor: "#394a63" } : {}}
                >
                  Timeline
                </button>
              </div>
              <AddFacilityDialog
                open={addFacilityOpen}
                onOpenChange={setAddFacilityOpen}
                onSubmit={onAddFacility}
                facilitiesTypes={facilitiesTypes}
                t={t}
                trigger={
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                    title={t("admin.addAmenity")}
                  >
                    <div className="relative flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                      <span className="absolute text-base font-bold -bottom-0.5 -right-0.5 text-white drop-shadow-lg">+</span>
                    </div>
                    <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {t("admin.addAmenity")}
                    </span>
                  </button>
                }
              />
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="relative group w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                title={t("admin.addReservation")}
              >
                <div className="relative">
                  <CalendarIcon className="w-5 h-5" />
                  <span
                    className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ fontSize: "10px" }}
                  >
                    +
                  </span>
                </div>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {t("admin.newReservation")}
                </span>
              </button>
              <NewBookingDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                facilities={facilities}
                newBooking={newBooking}
                onNewBookingChange={setNewBooking}
                clientSuggestions={clientSuggestions}
                showClientSuggestions={showClientSuggestions}
                onClientNameChange={onClientNameChange}
                onSelectClient={onSelectClient}
                onSubmit={onAddBooking}
                t={t}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1600px] mx-auto">
        {isLoading && (
          <p className="text-sm text-muted-foreground py-4">Cargando...</p>
        )}
        {error != null && (
          <p className="text-sm text-destructive py-4">Error al cargar facilities.</p>
        )}
        {!isLoading && error == null && (
          <>
            <EditFacilityDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              facility={editingFacility}
              onSubmit={onSaveEdit}
              t={t}
            />
            <BookingsDetailDialog
              open={bookingsDetailOpen}
              onOpenChange={setBookingsDetailOpen}
              bookings={selectedSlotBookings}
              facilities={facilities}
            />
            {viewMode === "list" && (
              <FacilityList
                facilities={facilities}
                bookings={bookings}
                selectedDate={selectedDate}
                onSelectedDateChange={onSelectedDateChange}
                onEditFacility={onEditFacility}
                language={language}
                convertISOToLocaleFormat={convertISOToLocaleFormat}
                t={t}
              />
            )}
            {viewMode === "timeline" && (
              <FacilityTimeline
                facilities={facilities}
                timeSlots={timeSlots}
                currentDate={currentDate}
                timelineMode={timelineMode}
                onTimelineModeChange={setTimelineMode}
                onCurrentDateChange={setCurrentDate}
                navigateDate={navigateDate}
                getBookingForSlot={getBookingForSlot}
                isBookingStart={isBookingStart}
                getBookingsAtSlot={getBookingsAtSlot}
                getOccupancyPercentage={getOccupancyPercentage}
                isMultiPartyFacility={isMultiPartyFacility}
                onShowBookingsDetail={handleShowBookingsDetail}
                onEditFacility={onEditFacility}
                language={language}
                convertISOToLocaleFormat={convertISOToLocaleFormat}
                t={t}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

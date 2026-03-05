"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, Users } from "lucide-react"
import { AddFacilityDialog } from "./AddFacilityDialog"
import { BookingsDetailDialog } from "./BookingsDetailDialog"
import { EditFacilityDialog } from "./EditFacilityDialog"
import type { Booking, Facility } from "./types"

type TFunction = (key: string) => string

export type FacilitiesViewProps = {
  facilities: Facility[]
  bookings: Booking[]
  addFacilityOpen: boolean
  setAddFacilityOpen: (open: boolean) => void
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  editingFacility: Facility | null
  bookingsDetailOpen: boolean
  setBookingsDetailOpen: (open: boolean) => void
  selectedSlotBookings: Booking[]
  setSelectedSlotBookings: (bookings: Booking[]) => void
  onAddFacility: (e: React.FormEvent<HTMLFormElement>) => void
  onSaveEdit: (e: React.FormEvent<HTMLFormElement>) => void
  onEditFacility: (facility: Facility) => void
  onDeleteFacility: (facilityId: string) => void
  getBookingsForFacility: (facilityId: string) => Booking[]
  t: TFunction
  isLoading?: boolean
  error?: unknown
}

export function FacilitiesView({
  facilities,
  addFacilityOpen,
  setAddFacilityOpen,
  editDialogOpen,
  setEditDialogOpen,
  editingFacility,
  bookingsDetailOpen,
  setBookingsDetailOpen,
  selectedSlotBookings,
  setSelectedSlotBookings,
  onAddFacility,
  onSaveEdit,
  onEditFacility,
  onDeleteFacility,
  getBookingsForFacility,
  t,
  isLoading,
  error,
}: FacilitiesViewProps) {
  const handleShowBookingsDetail = (facilityId: string) => {
    const facilityBookings = getBookingsForFacility(facilityId)
    setSelectedSlotBookings(facilityBookings)
    setBookingsDetailOpen(true)
  }

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t("admin.amenitiesManagement")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("admin.configureNewAmenity")}
              </p>
            </div>
            <Dialog open={addFacilityOpen} onOpenChange={setAddFacilityOpen}>
              <DialogTrigger asChild>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                  style={{ backgroundColor: "#1557F6" }}
                  title={t("admin.addAmenity")}
                >
                  <Plus className="w-5 h-5" />
                  <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {t("admin.addAmenity")}
                  </span>
                </button>
              </DialogTrigger>
              <AddFacilityDialog
                open={addFacilityOpen}
                onOpenChange={setAddFacilityOpen}
                onSubmit={onAddFacility}
                t={t}
              />
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1400px] mx-auto">
        {isLoading && (
          <p className="text-sm text-muted-foreground py-4">Cargando...</p>
        )}
        {error != null && (
          <p className="text-sm text-destructive py-4">
            Error al cargar amenities.
          </p>
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
              t={t}
            />

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => {
                const Icon = facility.icon
                return (
                  <Card
                    key={facility.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`${facility.color} p-2 rounded-lg flex-shrink-0`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-foreground truncate">
                              {facility.name}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize truncate">
                              {facility.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end flex-shrink-0">
                          <Badge
                            variant="outline"
                            className="text-xs whitespace-nowrap"
                          >
                            {facility.startTime} - {facility.endTime}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm flex-shrink-0">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <p className="font-semibold">{facility.capacity}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEditFacility(facility)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDeleteFacility(facility.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {facilities.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-lg font-medium text-muted-foreground">
                  No hay amenities registrados
                </p>
                <p className="text-sm text-muted-foreground">
                  Crea uno nuevo para comenzar
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

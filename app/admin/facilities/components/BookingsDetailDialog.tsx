"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Booking, Facility } from "./types"

export type BookingsDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookings: Booking[]
  facilities: Facility[]
}

export function BookingsDetailDialog({ open, onOpenChange, bookings, facilities }: BookingsDetailDialogProps) {
  const facility = facilities.find((f) => f.id === bookings[0]?.facilityId)
  const capacity = facility?.capacity ?? 1
  const occupancyPercent = bookings.length > 0 ? (bookings.length / capacity) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Participantes del horario</DialogTitle>
          <DialogDescription>Listado de todos los usuarios reservados en este horario</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {bookings.length > 0 ? (
            <>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">
                  {bookings.length} de {capacity} lugares ocupados
                </p>
                <div className="w-full bg-background rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      occupancyPercent > 80 ? "bg-red-500" : occupancyPercent > 50 ? "bg-amber-500" : "bg-green-500"
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>
              {bookings.map((booking, idx) => (
                <Card key={idx} className="p-3">
                  <p className="font-semibold text-sm">{booking.clientName}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>Habitación {booking.clientRoom}</span>
                    <Badge className={booking.status === "confirmed" ? "bg-green-600" : "bg-amber-600"}>
                      {booking.status === "confirmed" ? "Confirmado" : "Pendiente"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.time} - {booking.duration / 60}h
                  </p>
                </Card>
              ))}
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay participantes en este horario</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

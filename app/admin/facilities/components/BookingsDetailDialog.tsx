"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { Booking } from "./types"

type TFunction = (key: string) => string

export type BookingsDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookings: Booking[]
  t: TFunction
}

export function BookingsDetailDialog({
  open,
  onOpenChange,
  bookings,
  t,
}: BookingsDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin.participants")}</DialogTitle>
          <DialogDescription>{t("admin.bookingsList")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {bookings.length > 0 ? (
            bookings.map((booking, idx) => (
              <Card
                key={`${booking.facilityId}-${booking.clientName}-${idx}`}
                className="p-4"
              >
                <div className="space-y-2">
                  <p className="font-semibold text-sm">{booking.clientName}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      {t("admin.room")}: {booking.clientRoom}
                    </p>
                    <p>
                      {t("admin.time")}: {booking.time}
                    </p>
                    <p>
                      {t("admin.duration")}: {booking.duration}{" "}
                      {t("admin.minutes")}
                    </p>
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "default" : "secondary"
                      }
                      className={
                        booking.status === "confirmed"
                          ? "bg-green-600"
                          : "bg-amber-600"
                      }
                    >
                      {booking.status === "confirmed"
                        ? t("admin.confirmed")
                        : t("admin.pending")}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("admin.noBookings")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

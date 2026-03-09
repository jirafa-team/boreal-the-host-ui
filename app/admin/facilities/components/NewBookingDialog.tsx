"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Facility, NewBookingForm } from "./types"
import { TIME_SLOTS } from "./types"

type TFunction = (key: string) => string

export type NewBookingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  facilities: Facility[]
  newBooking: NewBookingForm
  onNewBookingChange: (updater: (prev: NewBookingForm) => NewBookingForm) => void
  clientSuggestions: string[]
  showClientSuggestions: boolean
  onClientNameChange: (value: string) => void
  onSelectClient: (clientName: string) => void
  onSubmit: () => void
  t: TFunction
}

export function NewBookingDialog({
  open,
  onOpenChange,
  facilities,
  newBooking,
  onNewBookingChange,
  clientSuggestions,
  showClientSuggestions,
  onClientNameChange,
  onSelectClient,
  onSubmit,
  t,
}: NewBookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">{t("admin.manualReservation")}</DialogTitle>
          <DialogDescription>{t("admin.createReservationForClient")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <Label htmlFor="facility" className="text-sm font-medium mb-2 block">{t("admin.facility")}</Label>
            <Select
              value={newBooking.facilityId}
              onValueChange={(value) => onNewBookingChange((prev) => ({ ...prev, facilityId: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("admin.selectFacility")} />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="clientName" className="text-sm font-medium mb-2 block">{t("admin.clientName")}</Label>
            <div className="relative">
              <Input
                id="clientName"
                value={newBooking.clientName}
                onChange={(e) => onClientNameChange(e.target.value)}
                placeholder={t("admin.startTypingName")}
                className="h-11"
              />
              {showClientSuggestions && clientSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  {clientSuggestions.map((client) => (
                    <button
                      key={client}
                      type="button"
                      onClick={() => onSelectClient(client)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm"
                    >
                      {client}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="clientRoom" className="text-sm font-medium mb-2 block">{t("admin.room")}</Label>
            <Input
              id="clientRoom"
              value={newBooking.clientRoom}
              onChange={(e) => onNewBookingChange((prev) => ({ ...prev, clientRoom: e.target.value }))}
              placeholder={t("admin.autoFilledByClient")}
              className="h-11 bg-gray-50"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">{t("admin.numberOfPeople")}</Label>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <button
                type="button"
                onClick={() => onNewBookingChange((prev) => ({ ...prev, people: Math.max(1, prev.people - 1) }))}
                className="w-9 h-9 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-semibold"
              >
                −
              </button>
              <span className="text-lg font-bold w-12 text-center">{newBooking.people}</span>
              <button
                type="button"
                onClick={() => onNewBookingChange((prev) => ({ ...prev, people: prev.people + 1 }))}
                className="w-9 h-9 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="time" className="text-sm font-medium mb-2 block">{t("admin.startTime")}</Label>
            <Select
              value={newBooking.time}
              onValueChange={(value) => onNewBookingChange((prev) => ({ ...prev, time: value }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("admin.selectTime")} />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration" className="text-sm font-medium mb-2 block">{t("admin.duration")}</Label>
            <Select
              value={newBooking.duration.toString()}
              onValueChange={(value) => onNewBookingChange((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">{t("admin.oneHour")}</SelectItem>
                <SelectItem value="120">{t("admin.twoHours")}</SelectItem>
                <SelectItem value="180">{t("admin.threeHours")}</SelectItem>
                <SelectItem value="240">{t("admin.fourHours")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="button" onClick={onSubmit} className="w-full h-11 font-medium">
            {t("admin.createReservation")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

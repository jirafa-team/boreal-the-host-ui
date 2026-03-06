"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Calendar } from "lucide-react"
import type { Booking, Facility } from "./types"

type TFunction = (key: string) => string

export type FacilityListProps = {
  facilities: Facility[]
  bookings: Booking[]
  selectedDate: string
  onSelectedDateChange: (date: string) => void
  onEditFacility: (facility: Facility) => void
  language: string
  convertISOToLocaleFormat: (isoDate: string) => string
  t: TFunction
}

export function FacilityList({
  facilities,
  bookings,
  selectedDate,
  onSelectedDateChange,
  onEditFacility,
  language,
  convertISOToLocaleFormat,
  t,
}: FacilityListProps) {
  return (
    <>
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((facility) => {
          const Icon = facility.icon
          return (
            <Card key={facility.id} className="p-6 hover:shadow-lg transition-shadow relative">
              <div className="flex items-start gap-4 mb-4">
                <div className={`${facility.color} p-3 rounded-lg shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{facility.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{facility.type}</p>
                </div>
              </div>

              <div className="absolute top-6 right-6 space-y-2 flex flex-col items-end">
                <Badge className="bg-sky-100 hover:bg-sky-200 text-black text-xs font-bold px-3 py-1.5 shrink-0 border-sky-200">
                  <Clock className="w-3 h-3 mr-1" />
                  {facility.startTime} - {facility.endTime}
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{facility.capacity}</span>
                </div>
              </div>

              <Button
                onClick={() => onEditFacility(facility)}
                className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {t("admin.edit")}
              </Button>
            </Card>
          )
        })}
      </div>
    </>
  )
}

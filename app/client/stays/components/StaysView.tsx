"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { setDataSource } from "@/store/slices/dataSourceSlice"
import type { Stay } from "./types"

type TFunction = (key: string) => string

export type StaysViewProps = {
  stays: Stay[]
  userInitials: string
  onStayClick: (stayId: number) => void
  onFirstStayCheckinClick: () => void
  t: TFunction
  isLoading?: boolean
  error?: unknown
}

export function StaysView({
  stays,
  userInitials,
  onStayClick,
  onFirstStayCheckinClick,
  t,
  isLoading = false,
  error,
}: StaysViewProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const mockMode = dataSource === "mock"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Image
            src="/images/thehost-20logo.png"
            alt="TheHost Logo"
            width={240}
            height={120}
            priority
            style={{ height: "auto" }}
          />
          <div className="flex items-center gap-4">
            {/* Switch Mock / API */}
            <div className="flex items-center gap-2">
              <Label htmlFor="stays-datasource" className="text-slate-300 text-sm cursor-pointer">
                {mockMode ? "Mock" : "API"}
              </Label>
              <Switch
                id="stays-datasource"
                checked={mockMode}
                onCheckedChange={(checked) =>
                  dispatch(setDataSource(checked ? "mock" : "api"))
                }
              />
            </div>
            {/* User Avatar - Clickable */}
            <button
              onClick={() => router.push("/client/profile")}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-cyan-500/50 hover:bg-slate-700/70 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-semibold text-white text-xs">
                {userInitials || "U"}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stays Grid */}
      <div className="max-w-7xl mx-auto">
        {isLoading && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              {t("common.loading") || "Cargando..."}
            </p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg">
              {t("common.error") || "Error al cargar las estadías"}
            </p>
          </div>
        )}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stays.map((stay, index) => (
                <div key={stay.id} className="relative">
                  {/* Check-in Button for First Stay */}
                  {index === 0 && stay.status === "Confirmada" && (
                    <div className="absolute -top-12 left-0 right-0 z-10">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onFirstStayCheckinClick()
                        }}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 h-10"
                      >
                        ⚠{" "}
                        {t("stays.completeCheckInData") ||
                          "Completar datos para check-in"}
                      </Button>
                    </div>
                  )}
                  <Card
                    className="bg-slate-800/50 border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
                    onClick={() => onStayClick(stay.id)}
                  >
                    {/* Hotel Image */}
                    <div className="relative h-48 bg-slate-700">
                      <Image
                        src={stay.hotelImage}
                        alt={stay.hotelName}
                        fill
                        className="object-cover"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            stay.status === "Confirmada"
                              ? "bg-green-500/30 text-green-300"
                              : stay.status === "Próxima"
                                ? "bg-blue-500/30 text-blue-300"
                                : "bg-yellow-500/30 text-yellow-300"
                          }`}
                        >
                          {stay.status}
                        </span>
                      </div>
                    </div>

                    <CardContent className="pt-6 space-y-4">
                      {/* Hotel Name as Title */}
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {stay.hotelName}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {stay.roomName}
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-300">
                          <span>
                            {t("stays.checkIn") || "Check-in"}:
                          </span>
                          <span className="text-cyan-300 font-semibold">
                            {stay.checkIn}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>
                            {t("stays.checkOut") || "Check-out"}:
                          </span>
                          <span className="text-cyan-300 font-semibold">
                            {stay.checkOut}
                          </span>
                        </div>
                      </div>

                      {/* Button */}
                      <div className="pt-4 border-t border-slate-600">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
                          {t("stays.completeCheckin") || "Completar Check-in"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {stays.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400 text-lg">
                  {t("stays.noStays") || "No tienes estadías registradas"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

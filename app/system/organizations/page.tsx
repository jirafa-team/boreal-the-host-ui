"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetOrganizationsQuery } from "@/features/organization/slices/organizationSlice"
import type { Organization as ApiOrganization } from "@/interfaces/organization/Organization"
import {
  Building2,
  Calendar,
  Users,
  MapPin,
  ChevronRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Settings,
  TrendingUp,
  Hotel,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import Loading from "./loading"
import { useLanguage } from "@/lib/i18n-context"
import { useCurrency, currencies, getCurrencyName, type Currency } from "@/lib/currency-context"

interface Organization {
  id: string
  name: string
  location: string
  admin: string
  totalRooms: number
  activeClients: number
  revenue: number
  status: "active" | "inactive"
  createdAt: string
  logo?: string
  type: "hotel" | "event" | "both"
}

function mapApiOrgToUi(o: ApiOrganization): Organization {
  return {
    id: o.id,
    name: o.name,
    location: (o as Record<string, unknown>).location as string ?? "",
    admin: (o as Record<string, unknown>).admin as string ?? "",
    totalRooms: ((o as Record<string, unknown>).totalRooms as number) ?? 0,
    activeClients: ((o as Record<string, unknown>).activeClients as number) ?? 0,
    revenue: ((o as Record<string, unknown>).revenue as number) ?? 0,
    status: ((o as Record<string, unknown>).status as Organization["status"]) ?? "active",
    createdAt: ((o as Record<string, unknown>).createdAt as string) ?? "",
    logo: (o as Record<string, unknown>).logo as string | undefined,
    type: ((o as Record<string, unknown>).type as Organization["type"]) ?? "hotel",
  }
}

const getTypeBadge = (type: Organization["type"]) => {
  switch (type) {
    case "hotel":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Hotel</Badge>
      );
    case "event":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Evento</Badge>
      );
    case "both":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Ambos</Badge>
      );
    default:
      return null;
  }
}

const MOCK_ORGANIZATIONS_UI: Organization[] = [
  { id: "1", name: "Hotel Premium Madrid", location: "Madrid, España", admin: "Carlos García", totalRooms: 120, activeClients: 89, revenue: 245000, status: "active", createdAt: "2023-01-15", logo: "/images/thehost-logo.png", type: "hotel" },
  { id: "2", name: "Hotel Boutique Valencia", location: "Valencia, España", admin: "Ana Martínez", totalRooms: 45, activeClients: 32, revenue: 87000, status: "active", createdAt: "2023-06-05", type: "hotel" },
  { id: "3", name: "Grand Hotel Bilbao", location: "Bilbao, España", admin: "Laura Fernández", totalRooms: 85, activeClients: 67, revenue: 156000, status: "inactive", createdAt: "2023-04-22", type: "both" },
  { id: "4", name: "Resort Marbella", location: "Marbella, España", admin: "Juan Rodríguez", totalRooms: 200, activeClients: 156, revenue: 412000, status: "active", createdAt: "2022-11-10", type: "event" },
]

export default function SystemOrganizationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const { data: apiData } = useGetOrganizationsQuery(undefined, { skip: dataSource !== "api" })

  const organizations: Organization[] = useMemo(() => {
    if (dataSource === "api") return (apiData?.data?.organizations ?? []).map(mapApiOrgToUi)
    return MOCK_ORGANIZATIONS_UI
  }, [dataSource, apiData])

  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || "")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCurrencySettings, setShowCurrencySettings] = useState(false)
  const { currency, setCurrency, symbol, formatPrice } = useCurrency()
  const { t } = useLanguage()

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.admin.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || org.type === typeFilter
    return matchesSearch && matchesType
  })

  const activeOrganizations = organizations.filter((org) => org.status === "active")
  const totalRevenue = organizations.reduce((sum, org) => sum + org.revenue, 0)
  const totalClients = organizations.reduce((sum, org) => sum + org.activeClients, 0)

  const getStatusBadge = (status: Organization["status"]) => {
    return status === "active" ? (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Activa</Badge>
    ) : (
      <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">Inactiva</Badge>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t("system.systemPanel")}</h1>
                <p className="text-sm text-gray-600">{t("system.organizationsManagement")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCurrencySettings(true)}
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <Settings className="w-4 h-4" />
                {t("system.settings")}
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="gap-2 bg-transparent text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                {t("system.logoutBtn")}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">{t("system.totalOrganizations")}</p>
                    <p className="text-3xl font-bold text-white">{organizations.length}</p>
                    <p className="text-xs text-blue-100 mt-1">{t("system.thisMonth")}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-100 mb-1">{t("system.activeOrganizations")}</p>
                    <p className="text-3xl font-bold text-white">{activeOrganizations.length}</p>
                    <p className="text-xs text-purple-100 mt-1">{t("system.thisMonth")}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100 mb-1">{t("system.totalRevenue")}</p>
                    <p className="text-3xl font-bold text-white">
                      {formatPrice(totalRevenue)}
                    </p>
                    <p className="text-xs text-green-100 mt-1">{t("system.thisMonth")}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-100 mb-1">{t("system.totalClients")}</p>
                    <p className="text-3xl font-bold text-white">{totalClients}</p>
                    <p className="text-xs text-yellow-100 mt-1">{t("system.thisMonth")}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Hotel className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder={t("system.searchHotels")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Button 
                  onClick={() => router.push("/system/organizations/new")}
                  className="gap-2 bg-blue-600 text-white border-0 hover:bg-blue-700 h-12 px-6"
                >
                  <Plus className="w-4 h-4" />
                  {t("system.newHotel")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <Card
                key={org.id}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => router.push(`/system/organizations/${org.id}`)}
                    >
                      {org.logo ? (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          <Image src={org.logo || "/placeholder.svg"} alt={org.name} width={56} height={56} className="object-cover" loading="eager" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                          {org.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(org.status)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          {t("system.configure")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <LogOut className="w-4 h-4 mr-2" />
                          {t("system.deactivate")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{org.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{t("system.admin")}: {org.admin}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t("system.hotelRooms")}:</span>
                      <span className="font-semibold text-gray-900">{org.totalRooms}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t("system.activeClients")}:</span>
                      <span className="font-semibold text-gray-900">{org.activeClients}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{t("system.revenueMonth")}:</span>
                      <span className="font-bold text-green-600">{formatPrice(org.revenue)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md group-hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin?org=${org.id}`)
                    }}
                  >
                    {t("system.accessPanel")}
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrganizations.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("system.noOrganizationsFound")}</h3>
                <p className="text-gray-600">{t("system.adjustYourSearch")}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Currency Settings Dialog */}
        <Dialog open={showCurrencySettings} onOpenChange={setShowCurrencySettings}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t("system.currencySettings")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600 mb-4">
                {t("system.selectCurrency")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr)
                      setShowCurrencySettings(false)
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      currency === curr
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{curr}</div>
                    <div className="text-sm text-gray-600">{getCurrencyName(curr)}</div>
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}

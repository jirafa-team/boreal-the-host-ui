"use client"

import React from "react"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import {
  Hotel,
  Calendar,
  Bell,
  LayoutGrid,
  Users,
  BarChart3,
  Building2,
  Sparkles,
  Compass,
  TrendingUp,
  Ticket,
  ShoppingBag,
  UserCog,
  Settings,
  ArrowRight,
} from "lucide-react"

const colorClasses = {
  "from-purple-600 to-purple-700": "bg-gradient-to-br from-purple-600 to-purple-700",
  "from-indigo-600 to-indigo-700": "bg-gradient-to-br from-indigo-600 to-indigo-700",
  "from-orange-600 to-orange-700": "bg-gradient-to-br from-orange-600 to-orange-700",
  "from-pink-600 to-pink-700": "bg-gradient-to-br from-pink-600 to-pink-700",
  "from-red-600 to-red-700": "bg-gradient-to-br from-red-600 to-red-700",
  "from-blue-600 to-blue-700": "bg-gradient-to-br from-blue-600 to-blue-700",
  "from-green-600 to-green-700": "bg-gradient-to-br from-green-600 to-green-700",
  "from-yellow-600 to-yellow-700": "bg-gradient-to-br from-yellow-600 to-yellow-700",
  "from-slate-600 to-slate-700": "bg-gradient-to-br from-slate-600 to-slate-700",
  "from-teal-600 to-teal-700": "bg-gradient-to-br from-teal-600 to-teal-700",
}

const customColors = {
  "pedidos-custom": "#008db1",
  "clientes-custom": "#7c1df9",
  "notificaciones-custom": "#dd6d00",
  "recomendaciones-custom": "#5ba000",
}

export default function AdminHomePage() {
  const router = useRouter()
  const { t } = useLanguage()

  const gradientColors: { [key: string]: string } = {
    "from-purple-600 to-purple-700": "linear-gradient(135deg, rgb(147, 51, 234), rgb(126, 34, 206))",
    "from-indigo-600 to-indigo-700": "linear-gradient(135deg, rgb(79, 70, 229), rgb(67, 56, 202))",
    "from-orange-600 to-orange-700": "linear-gradient(135deg, rgb(234, 88, 12), rgb(194, 65, 12))",
    "from-pink-600 to-pink-700": "linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))",
    "from-red-600 to-red-700": "linear-gradient(135deg, rgb(220, 38, 38), rgb(185, 28, 28))",
    "from-blue-600 to-blue-700": "linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))",
    "from-green-600 to-green-700": "linear-gradient(135deg, rgb(22, 163, 74), rgb(20, 124, 61))",
    "from-yellow-600 to-yellow-700": "linear-gradient(135deg, rgb(202, 138, 4), rgb(161, 98, 7))",
    "from-slate-600 to-slate-700": "linear-gradient(135deg, rgb(71, 85, 105), rgb(51, 65, 85))",
    "from-teal-600 to-teal-700": "linear-gradient(135deg, rgb(13, 148, 136), rgb(5, 122, 119))",
  }

  const solidColors: { [key: string]: string } = {
    "pedidos-custom": "#008db1",
    "clientes-custom": "#7c1df9",
    "notificaciones-custom": "#dd6d00",
    "recomendaciones-custom": "#5ba000",
  }

  const menuSections = [
    {
      title: t("admin.general"),
      items: [
        { href: "/admin/dashboard", label: t("admin.controlDashboard"), icon: BarChart3, color: "from-green-600 to-green-700" },
        // { href: "/admin/sales-assistant", label: t("admin.salesAssistant"), icon: TrendingUp, color: "from-green-600 to-green-700" },
      ],
      columns: 2,
    },
    {
      title: t("admin.spaces"),
      items: [
        { href: "/admin/rooms", label: t("admin.rooms"), icon: Hotel, color: "from-purple-600 to-purple-700" },
        // { href: "/admin/space-builder", label: t("admin.spaceDesign"), icon: LayoutGrid, color: "from-indigo-600 to-indigo-700" },
        { href: "/admin/facilities", label: "Amenities", icon: Building2, color: "from-orange-600 to-orange-700" },
      ],
      columns: 2,
    },
    {
      title: t("admin.services"),
      items: [
        { href: "/admin/staff", label: "Personal", icon: Sparkles, color: "from-pink-600 to-pink-700" },
        // { href: "/admin/events", label: t("admin.events"), icon: Calendar, color: "from-red-600 to-red-700" },
        // { href: "/admin/tickets", label: t("admin.tickets"), icon: Ticket, color: "from-yellow-600 to-yellow-700" },
        // { href: "/admin/pedidos", label: t("admin.orders"), icon: ShoppingBag, color: "pedidos-custom" },
      ],
      columns: 2,
    },
    {
      title: t("admin.communication"),
      items: [
        { href: "/admin/clients", label: t("admin.clients"), icon: Users, color: "clientes-custom" },
        // { href: "/admin/notifications", label: t("admin.notifications"), icon: Bell, color: "notificaciones-custom" },
        // { href: "/admin/recommendations", label: t("admin.recommendations"), icon: Compass, color: "recomendaciones-custom" },
      ],
      columns: 3,
    },
    {
      title: t("admin.management"),
      items: [
        { href: "/admin/users", label: "Usuarios", icon: UserCog, color: "from-slate-600 to-slate-700" },
        { href: "/admin/settings", label: "Configuración", icon: Settings, color: "from-teal-600 to-teal-700" },
      ],
      columns: 2,
    },
  ]

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("admin.home")}</h1>
          <p className="text-gray-600 mt-1">{t("admin.selectFeature") || "Selecciona una opción para comenzar"}</p>
        </div>

        {/* Menu Sections - Unified Grid */}
        <div className="w-full grid grid-cols-4 gap-4">
          {/* Collect all visible items */}
          {(() => {
            const allItems = [];
            menuSections.forEach((section) => {
              section.items.forEach((item) => {
                allItems.push({ ...item, sectionId: section.title });
              });
            });
            
            return allItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="group relative overflow-hidden rounded-lg p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 min-h-32 flex flex-col"
                  style={{
                    background: solidColors[item.color] || gradientColors[item.color] || "linear-gradient(135deg, rgb(71, 85, 105), rgb(51, 65, 85))"
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-8 -mt-8"></div>
                  </div>
                  <div className="relative flex flex-col items-start h-full">
                    <div className="mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold mb-auto text-left line-clamp-2">{item.label}</h3>
                    <div className="flex items-center gap-1 text-xs opacity-90 mt-4">
                      <span>Acceder</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              )
            })
          })()}
        </div>
      </div>
    </div>
  )
}

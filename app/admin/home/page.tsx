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
  ArrowRight,
} from "lucide-react"

export default function AdminHomePage() {
  const router = useRouter()
  const { t } = useLanguage()

  const colorClasses: { [key: string]: string } = {
    "from-purple-600 to-purple-700": "bg-gradient-to-br from-purple-600 to-purple-700",
    "from-indigo-600 to-indigo-700": "bg-gradient-to-br from-indigo-600 to-indigo-700",
    "from-orange-600 to-orange-700": "bg-gradient-to-br from-orange-600 to-orange-700",
    "from-pink-600 to-pink-700": "bg-gradient-to-br from-pink-600 to-pink-700",
    "from-red-600 to-red-700": "bg-gradient-to-br from-red-600 to-red-700",
    "from-blue-600 to-blue-700": "bg-gradient-to-br from-blue-600 to-blue-700",
    "from-green-600 to-green-700": "bg-gradient-to-br from-green-600 to-green-700",
    "from-yellow-600 to-yellow-700": "bg-gradient-to-br from-yellow-600 to-yellow-700",
    "from-slate-600 to-slate-700": "bg-gradient-to-br from-slate-600 to-slate-700",
  }

  const menuSections = [
    {
      title: t("admin.general"),
      items: [
        { href: "/admin", label: t("admin.dashboard"), icon: BarChart3, color: "from-blue-600 to-blue-700" },
        { href: "/admin/sales-assistant", label: t("admin.salesAssistant"), icon: TrendingUp, color: "from-green-600 to-green-700" },
      ],
    },
    {
      title: t("admin.spaces"),
      items: [
        { href: "/admin/rooms", label: t("admin.rooms"), icon: Hotel, color: "from-purple-600 to-purple-700" },
        { href: "/admin/space-builder", label: t("admin.spaceDesign"), icon: LayoutGrid, color: "from-indigo-600 to-indigo-700" },
        { href: "/admin/facilities", label: t("admin.facilities"), icon: Building2, color: "from-orange-600 to-orange-700" },
      ],
    },
    {
      title: t("admin.services"),
      items: [
        { href: "/admin/staff", label: t("admin.staff"), icon: Users, color: "from-pink-600 to-pink-700" },
        { href: "/admin/events", label: t("admin.events"), icon: Calendar, color: "from-red-600 to-red-700" },
        { href: "/admin/tickets", label: t("admin.tickets"), icon: Ticket, color: "from-yellow-600 to-yellow-700" },
        { href: "/admin/pedidos", label: t("admin.orders"), icon: ShoppingBag, color: "from-cyan-600 to-cyan-700" },
      ],
    },
    {
      title: t("admin.communication"),
      items: [
        { href: "/admin/clients", label: t("admin.clients"), icon: Users, color: "from-violet-600 to-violet-700" },
        { href: "/admin/notifications", label: t("admin.notifications"), icon: Bell, color: "from-amber-600 to-amber-700" },
        { href: "/admin/recommendations", label: t("admin.recommendations"), icon: Compass, color: "from-lime-600 to-lime-700" },
      ],
    },
    {
      title: t("admin.management"),
      items: [
        { href: "/admin/users", label: t("admin.users"), icon: UserCog, color: "from-slate-600 to-slate-700" },
      ],
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

        {/* Menu Sections - Full Width Grid */}
        <div className="w-full">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-3">{section.title}</h2>
              <div className="grid grid-cols-9 gap-2">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`group relative overflow-hidden rounded-lg p-2 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${colorClasses[item.color] || "bg-gradient-to-br from-gray-600 to-gray-700"}`}
                    >
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full -mr-4 -mt-4"></div>
                      </div>

                      {/* Content */}
                      <div className="relative flex flex-col items-start h-full">
                        <div className="mb-1">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-semibold mb-1 text-left line-clamp-2">{item.label}</h3>
                        <div className="mt-auto flex items-center gap-0.5 text-[10px] opacity-90">
                          <span>Acceder</span>
                          <ArrowRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

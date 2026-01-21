"use client"

import type React from "react"
import { useState } from "react"
import {
  Hotel,
  Calendar,
  Bell,
  LayoutGrid,
  Users,
  BarChart3,
  Menu,
  Building2,
  Sparkles,
  Compass,
  TrendingUp,
  LogOut,
  Ticket,
  ShoppingBag,
  UserCog,
  Home,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ]

  const navSections = [
    {
      title: t("admin.general"),
      items: [
        { href: "/admin/home", label: t("admin.home"), icon: Home },
        { href: "/admin", label: t("admin.dashboard"), icon: BarChart3 },
        { href: "/admin/sales-assistant", label: t("admin.salesAssistant"), icon: TrendingUp },
      ],
    },
    {
      title: t("admin.spaces"),
      items: [
        { href: "/admin/rooms", label: t("admin.rooms"), icon: Hotel },
        { href: "/admin/space-builder", label: t("admin.spaceDesign"), icon: LayoutGrid },
      ],
    },
    {
      title: t("admin.services"),
      items: [
        { href: "/admin/facilities", label: t("admin.facilities"), icon: Building2 },
        { href: "/admin/staff", label: t("admin.staff"), icon: Sparkles },
        { href: "/admin/events", label: t("admin.events"), icon: Calendar },
        { href: "/admin/tickets", label: t("admin.tickets"), icon: Ticket },
        { href: "/admin/pedidos", label: t("admin.orders"), icon: ShoppingBag },
      ],
    },
    {
      title: t("admin.communication"),
      items: [
        { href: "/admin/clients", label: t("admin.clients"), icon: Users },
        { href: "/admin/notifications", label: t("admin.notifications"), icon: Bell },
        { href: "/admin/recommendations", label: t("admin.recommendations"), icon: Compass },
      ],
    },
    {
      title: t("admin.management"),
      items: [
        { href: "/admin/users", label: t("admin.users"), icon: UserCog },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} border-r transition-all duration-300 flex flex-col`}
        style={{ backgroundColor: "#034AAE" }}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && <h2 className="font-bold text-lg text-white">{t("admin.adminPanel")}</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              {sidebarOpen && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-white/70 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive ? "bg-white/20 text-white font-medium" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-white/90 hover:bg-white/10"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>{t("admin.logout")}</span>}
          </Link>
        </div>

        {sidebarOpen && (
          <div className="p-2 border-t border-white/10">
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

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
  ChevronDown,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["general", "spaces"]))
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()

  // Ocultar sidebar en la página de selección de establecimiento
  const hideSidebar = pathname === '/admin/select-establishment'

  const languages = [
    { code: "es", name: "Español", label: "ES" },
    { code: "en", name: "English", label: "EN" },
    { code: "pt", name: "Português", label: "PT" },
    { code: "fr", name: "Français", label: "FR" },
  ]

  const navSections = [
    {
      id: "general",
      title: t("admin.general"),
      items: [
        { href: "/admin/home", label: t("admin.home"), icon: Home },
        { href: "/admin/dashboard", label: t("admin.controlDashboard"), icon: BarChart3 },
        { href: "/admin", label: t("admin.dashboard"), icon: BarChart3 },
        { href: "/admin/sales-assistant", label: t("admin.salesAssistant"), icon: TrendingUp },
      ],
    },
    {
      id: "spaces",
      title: t("admin.spaces"),
      items: [
        { href: "/admin/rooms", label: t("admin.rooms"), icon: Hotel },
        { href: "/admin/space-builder", label: t("admin.spaceDesign"), icon: LayoutGrid },
        { href: "/admin/facilities", label: t("admin.amenities"), icon: Building2 },
      ],
    },
    {
      id: "services",
      title: t("admin.services"),
      items: [
        { href: "/admin/staff", label: t("admin.staff"), icon: Sparkles },
        { href: "/admin/events", label: t("admin.events"), icon: Calendar },
        { href: "/admin/tickets", label: t("admin.tickets"), icon: Ticket },
        { href: "/admin/pedidos", label: t("admin.orders"), icon: ShoppingBag },
      ],
    },
    {
      id: "communication",
      title: t("admin.communication"),
      items: [
        { href: "/admin/clients", label: t("admin.clients"), icon: Users },
        { href: "/admin/notifications", label: t("admin.notifications"), icon: Bell },
        { href: "/admin/recommendations", label: t("admin.recommendations"), icon: Compass },
      ],
    },
    {
      id: "management",
      title: t("admin.management"),
      items: [
        { href: "/admin/users", label: t("admin.users"), icon: UserCog },
      ],
    },
  ]

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className="flex h-screen bg-background">
      {!hideSidebar && (
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
              <div key={section.id}>
                {sidebarOpen ? (
                  <>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-3 mb-2 text-[10px] font-semibold text-white/70 uppercase tracking-wider hover:text-white/90 flex items-center justify-between transition-colors"
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedSections.has(section.id) ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                    </button>
                    {expandedSections.has(section.id) && (
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon
                          const isActive = pathname === item.href
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-3 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                                isActive ? "bg-white/20 text-white font-medium" : "text-white/90 hover:bg-white/10"
                              }`}
                            >
                              <Icon className="w-5 h-5 shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={item.label}
                          className={`flex items-center justify-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive ? "bg-white/20 text-white font-medium" : "text-white/90 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-2 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/admin/select-establishment"
                className="relative group w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                title="Hospedajes"
              >
                <Hotel className="w-5 h-5" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Hospedajes
                </div>
              </Link>
              <Link
                href="/"
                className="relative group w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Cerrar sesión
                </div>
              </Link>
            </div>
          </div>

          {sidebarOpen && (
            <div className="p-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/70 shrink-0" />
                <div className="inline-flex w-full h-7 items-center rounded-md bg-white/10 border border-white/20 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex-1 h-full font-medium text-xs transition-all ${
                        language === lang.code ? "text-white shadow-md" : "text-white/60 hover:text-white/80"
                      }`}
                      style={language === lang.code ? { backgroundColor: "#0891B2" } : {}}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

"use client"

import { useState, useEffect, useMemo, memo, useCallback } from "react"
import {
  BarChart3,
  Menu,
  Building2,
  Sparkles,
  UserCog,
  Home,
  Globe,
  ChevronDown,
  LogOut,
  Settings,
  Hotel,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import { useDispatch, useSelector } from "react-redux"
import { setDataSource } from "@/store/slices/dataSourceSlice"
import type { RootState } from "@/store/store"
import { ROUTES } from "@/shared/types/routes"

interface NavSection {
  id: string
  title: string
  items: Array<{
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

interface SidebarNavProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  isAgenticoMode: boolean
  /** When set, links use myHost routes (e.g. /myHost/orgId/dashboard). When unset, links use /admin/* */
  orgId?: string
}

export const SidebarNav = memo(function SidebarNav({
  sidebarOpen,
  onToggleSidebar,
  isAgenticoMode,
  orgId,
}: SidebarNavProps) {
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()
  const dispatch = useDispatch()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const mockMode = dataSource === "mock"

  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const savedSections = localStorage.getItem("adminSidebarSections")
      if (savedSections) {
        try {
          return new Set(JSON.parse(savedSections))
        } catch {
          return new Set(["general", "myHotel"])
        }
      }
    }
    return new Set(["general", "myHotel"])
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        "adminSidebarSections",
        JSON.stringify(Array.from(expandedSections))
      )
    }, 300)
    return () => clearTimeout(timer)
  }, [expandedSections])

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId)
      } else {
        newExpanded.add(sectionId)
      }
      return newExpanded
    })
  }, [])

  const navSections: NavSection[] = useMemo(() => {
    const home = orgId ? ROUTES.HOME(orgId) : "/admin/home"
    const dashboard = orgId ? ROUTES.DASHBOARD(orgId) : "/admin/dashboard"
    const rooms = orgId ? ROUTES.ROOMS(orgId) : "/admin/rooms"
    const facilities = orgId ? ROUTES.FACILITIES(orgId) : "/admin/facilities"
    const staff = orgId ? ROUTES.STAFF(orgId) : "/admin/staff"
    const clients = orgId ? ROUTES.CLIENTS(orgId) : "/admin/clients"
    const users = orgId ? ROUTES.USERS(orgId) : "/admin/users"
    const settings = orgId ? ROUTES.SETTINGS(orgId) : "/admin/settings"

    return [
      {
        id: "general",
        title: t("admin.general"),
        items: [
          { href: home, label: t("admin.home"), icon: Home },
          { href: dashboard, label: t("admin.controlDashboard"), icon: BarChart3 },
        ],
      },
      {
        id: "myHotel",
        title: t("admin.myHotel"),
        items: [
          { href: rooms, label: t("admin.rooms"), icon: Hotel },
          { href: facilities, label: t("admin.amenities"), icon: Building2 },
          { href: staff, label: t("admin.staff"), icon: Sparkles },
        ],
      },
      {
        id: "communication",
        title: t("admin.communication"),
        items: [{ href: clients, label: t("admin.clients"), icon: Users }],
      },
      {
        id: "management",
        title: t("admin.management"),
        items: [
          { href: users, label: t("admin.users"), icon: UserCog },
          { href: settings, label: t("admin.settings"), icon: Settings },
        ],
      },
    ]
  }, [t, orgId])

  const languages = [
    { code: "es", name: "Español", label: "ES" },
    { code: "en", name: "English", label: "EN" },
    { code: "pt", name: "Português", label: "PT" },
    { code: "fr", name: "Français", label: "FR" },
  ]

  return (
    <aside
      className={`${sidebarOpen ? "w-64" : "w-20"} border-r transition-all duration-300 flex flex-col will-change-auto`}
      style={
        isAgenticoMode
          ? {
            background:
              "linear-gradient(135deg, rgb(88, 28, 135) 0%, rgb(15, 23, 42) 50%, rgb(6, 18, 32) 100%)",
          }
          : { backgroundColor: "#034AAE" }
      }
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {sidebarOpen && (
          <h2 className="font-bold text-lg text-white">
            {t("admin.adminPanel")}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
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
                    className={`w-4 h-4 transition-transform ${expandedSections.has(section.id)
                      ? "rotate-0"
                      : "-rotate-90"
                      }`}
                  />
                </button>
                <div
                  className={`space-y-1 mb-2 overflow-hidden transition-all duration-200 ${expandedSections.has(section.id) ? "max-h-96" : "max-h-0"
                    }`}
                >
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        className={`flex items-center gap-3 px-3 py-1.5 text-xs rounded-lg transition-colors ${isActive
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/90 hover:bg-white/10"
                          }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
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
                      prefetch={true}
                      title={item.label}
                      className={`flex items-center justify-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/90 hover:bg-white/10"
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-white/10 rounded-lg flex-1">
            <span className="text-xs text-white/70 font-medium whitespace-nowrap">
              {mockMode ? "MOCK" : "API"}
            </span>
            <Switch
              checked={mockMode}
              onCheckedChange={(checked) =>
                dispatch(setDataSource(checked ? "mock" : "api"))
              }
              className="scale-75"
            />
          </div>

          <Link
            href="/admin/select-establishment"
            className="relative group w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shrink-0"
            title={t("admin.accommodations")}
          >
            <Hotel className="w-5 h-5" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t("admin.accommodations")}
            </div>
          </Link>
          <Link
            href="/"
            className="relative group w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shrink-0"
            title={t("admin.logout")}
          >
            <LogOut className="w-5 h-5" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t("admin.logout")}
            </div>
          </Link>
        </div>
      </div>

      {sidebarOpen && (
        <div className="p-2 border-t border-white/10 space-y-2">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group"
          >
            <span className="text-sm font-semibold text-white">Boreal CRM</span>
            <span className="px-2 py-1 bg-amber-500/90 text-white text-[10px] font-bold rounded group-hover:bg-amber-500 transition-colors">
              PRO
            </span>
          </button>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/70 shrink-0" />
            <div className="inline-flex w-full h-7 items-center rounded-md bg-white/10 border border-white/20 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code as "es" | "en" | "pt" | "fr")}
                  className={`flex-1 h-full font-medium text-xs transition-all ${language === lang.code
                    ? "text-white shadow-md"
                    : "text-white/60 hover:text-white/80"
                    }`}
                  style={
                    language === lang.code
                      ? { backgroundColor: "#0891B2" }
                      : undefined
                  }
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  )
})

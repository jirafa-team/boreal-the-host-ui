"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "next/navigation"
import { setDataSource } from "@/store/slices/dataSourceSlice"
import { setCurrentOrganization } from "@/features/organization/slices/organizationSlice"
import type { RootState } from "@/store/store"
import {
  Hotel,
  Users,
  BarChart3,
  Menu,
  Building2,
  Sparkles,
  UserCog,
  Home,
  Globe,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n-context"
import { ROUTES } from "@/shared/types/routes"

export default function MyHostLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const orgId = params?.orgId as string | undefined
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatch()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const mockMode = dataSource === "mock"
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (orgId) {
      dispatch(setCurrentOrganization(orgId))
    }
  }, [orgId, dispatch])

  useEffect(() => {
    const savedSections = localStorage.getItem("adminSidebarSections")
    if (savedSections) {
      setExpandedSections(new Set(JSON.parse(savedSections)))
    } else {
      setExpandedSections(new Set(["general", "spaces"]))
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("adminSidebarSections", JSON.stringify(Array.from(expandedSections)))
    }
  }, [expandedSections, isLoaded])

  const isAgenticoMode = orgId ? pathname === ROUTES.AGENTICO(orgId) : false

  const languages = [
    { code: "es", name: "Español", label: "ES" },
    { code: "en", name: "English", label: "EN" },
    { code: "pt", name: "Português", label: "PT" },
    { code: "fr", name: "Français", label: "FR" },
  ]

  const navSections = orgId
    ? [
        {
          id: "general",
          title: t("admin.general"),
          items: [
            { href: ROUTES.HOME(orgId), label: t("admin.home"), icon: Home },
            { href: ROUTES.DASHBOARD(orgId), label: t("admin.controlDashboard"), icon: BarChart3 },
          ],
        },
        {
          id: "spaces",
          title: t("admin.spaces"),
          items: [
            { href: ROUTES.ROOMS(orgId), label: t("admin.rooms"), icon: Hotel },
            { href: ROUTES.FACILITIES(orgId), label: t("admin.amenities"), icon: Building2 },
          ],
        },
        {
          id: "services",
          title: t("admin.services"),
          items: [{ href: ROUTES.STAFF(orgId), label: t("admin.staff"), icon: Sparkles }],
        },
        {
          id: "communication",
          title: t("admin.communication"),
          items: [{ href: ROUTES.CLIENTS(orgId), label: t("admin.clients"), icon: Users }],
        },
        {
          id: "management",
          title: t("admin.management"),
          items: [
            { href: ROUTES.USERS(orgId), label: t("admin.users"), icon: UserCog },
            { href: ROUTES.SETTINGS(orgId), label: t("admin.settings"), icon: Settings },
          ],
        },
      ]
    : []

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) newExpanded.delete(sectionId)
    else newExpanded.add(sectionId)
    setExpandedSections(newExpanded)
  }

  if (!orgId) {
    return <main className="flex-1 overflow-auto">{children}</main>
  }

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} border-r transition-all duration-300 flex flex-col`}
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
          {sidebarOpen && isLoaded && (
            <h2 className="font-bold text-lg text-white">{t("admin.adminPanel")}</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          {isLoaded &&
            navSections.map((section) => (
              <div key={section.id}>
                {sidebarOpen ? (
                  <>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-3 mb-2 text-[10px] font-semibold text-white/70 uppercase tracking-wider hover:text-white/90 flex items-center justify-between transition-colors hidden"
                    >
                      <span>{section.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedSections.has(section.id) ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                    </button>
                    <div className="space-y-1 mb-2">
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-white/10 rounded-lg flex-1">
              <span className="text-xs text-white/70 font-medium whitespace-nowrap">
                {mockMode ? "MOCK" : "API"}
              </span>
              <Switch
                checked={mockMode}
                onCheckedChange={(checked) => dispatch(setDataSource(checked ? "mock" : "api"))}
                className="scale-75"
              />
            </div>
            {isLoaded && (
              <>
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
              </>
            )}
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
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

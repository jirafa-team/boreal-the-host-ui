"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { SidebarNav } from "./components/SidebarNav"
import { ROUTES } from "@/shared/types/routes"

const ADMIN_TO_MYHOST: Record<string, (orgId: string) => string> = {
  "/admin/home": ROUTES.HOME,
  "/admin/dashboard": ROUTES.DASHBOARD,
  "/admin/rooms": ROUTES.ROOMS,
  "/admin/facilities": ROUTES.FACILITIES,
  "/admin/staff": ROUTES.STAFF,
  "/admin/clients": ROUTES.CLIENTS,
  "/admin/users": ROUTES.USERS,
  "/admin/settings": ROUTES.SETTINGS,
  "/admin/events": ROUTES.EVENTS,
  "/admin/notifications": ROUTES.NOTIFICATIONS,
  "/admin/agentico": ROUTES.AGENTICO,
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const orgId = useSelector(
    (state: RootState) =>
      state.organization?.currentOrganizationId ?? state.auth?.currentOrganization?.id
  )

  const hideSidebar = useMemo(
    () => pathname === "/admin/select-establishment",
    [pathname]
  )

  const isAgenticoMode = useMemo(
    () => pathname === "/admin/agentico",
    [pathname]
  )

  useEffect(() => {
    if (!pathname || !orgId) return
    if (ADMIN_TO_MYHOST[pathname]) {
      router.replace(ADMIN_TO_MYHOST[pathname](orgId))
      return
    }
    if (pathname === "/admin/notifications/log") {
      router.replace(ROUTES.NOTIFICATIONS_LOG(orgId))
      return
    }
    const eventsMatch = pathname.match(/^\/admin\/events\/(.+)$/)
    if (eventsMatch) {
      router.replace(ROUTES.EVENT_DETAIL(orgId, eventsMatch[1]))
      return
    }
    const clientsMatch = pathname.match(/^\/admin\/clients\/(.+)$/)
    if (clientsMatch) {
      router.replace(ROUTES.CLIENT_DETAIL(orgId, clientsMatch[1]))
      return
    }
  }, [pathname, orgId, router])

  return (
    <div className="flex h-screen bg-background will-change-auto">
      {!hideSidebar && (
        <SidebarNav
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isAgenticoMode={isAgenticoMode}
        />
      )}
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  )
}

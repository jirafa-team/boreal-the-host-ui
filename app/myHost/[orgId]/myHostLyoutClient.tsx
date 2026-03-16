"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useParams, usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { setCurrentOrganization } from "@/features/organization/slices/organizationSlice"
import { SidebarNav } from "@/app/admin/components/SidebarNav"
import { ROUTES } from "@/shared/types/routes"

export default function MyHostLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const orgId = params?.orgId as string | undefined
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const pathname = usePathname()
    const dispatch = useDispatch()

    const isAgenticoMode = useMemo(
        () => !!orgId && pathname === ROUTES.AGENTICO(orgId),
        [orgId, pathname]
    )

    useEffect(() => {
        if (orgId) {
            dispatch(setCurrentOrganization(orgId))
        }
    }, [orgId, dispatch])

    if (!orgId) {
        return <main className="flex-1 overflow-auto">{children}</main>
    }

    return (
        <div className="flex h-screen bg-background will-change-auto">
            <SidebarNav
                sidebarOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                isAgenticoMode={isAgenticoMode}
                orgId={orgId}
            />
            <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
    )
}
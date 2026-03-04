"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import { SidebarNav } from "./sidebar-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  // Ocultar sidebar en la página de selección de establecimiento
  const hideSidebar = useMemo(() => pathname === '/admin/select-establishment', [pathname])
  
  // Detectar si estamos en modo agentico
  const isAgenticoMode = useMemo(() => pathname === '/admin/agentico', [pathname])

  return (
    <div className="flex h-screen bg-background will-change-auto">
      {!hideSidebar && (
        <SidebarNav 
          sidebarOpen={sidebarOpen} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isAgenticoMode={isAgenticoMode}
        />
      )}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  )
}

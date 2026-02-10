"use client"

import React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Hotel,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Bed,
  Package,
  ShoppingCart,
  MessageSquare,
  FileText,
  BarChart3,
  Shield,
  Home,
  Bell,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface Organization {
  id: string
  name: string
  location: string
  address: string
  admin: string
  adminEmail: string
  adminPhone: string
  totalRooms: number
  activeClients: number
  revenue: number
  occupancy: number
  status: "active" | "inactive"
  createdAt: string
  logo?: string
}

interface Module {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  category: "core" | "service" | "analytics" | "advanced"
}

const mockOrganization: Organization = {
  id: "1",
  name: "Hotel Premium Madrid",
  location: "Madrid, España",
  address: "Calle Gran Vía 45, 28013 Madrid",
  admin: "Carlos García",
  adminEmail: "carlos.garcia@hotelpremium.com",
  adminPhone: "+34 912 345 678",
  totalRooms: 120,
  activeClients: 89,
  revenue: 245000,
  occupancy: 78,
  status: "active",
  createdAt: "2023-01-15",
  logo: "/images/thehost-logo.png",
}

const initialModules: Module[] = [
  // Core Modules
  {
    id: "rooms",
    name: "Gestión de Habitaciones",
    description: "Administrar habitaciones, tarifas y disponibilidad",
    icon: <Bed className="w-5 h-5" />,
    enabled: true,
    category: "core",
  },
  {
    id: "clients",
    name: "Gestión de Clientes",
    description: "Base de datos de clientes y perfiles",
    icon: <Users className="w-5 h-5" />,
    enabled: true,
    category: "core",
  },
  {
    id: "reservations",
    name: "Reservas",
    description: "Sistema de reservas y check-in/check-out",
    icon: <Calendar className="w-5 h-5" />,
    enabled: true,
    category: "core",
  },
  {
    id: "housekeeping",
    name: "Housekeeping",
    description: "Gestión de limpieza y mantenimiento",
    icon: <Home className="w-5 h-5" />,
    enabled: true,
    category: "core",
  },
  // Service Modules
  {
    id: "roomservice",
    name: "Room Service",
    description: "Pedidos de comida y bebidas a habitaciones",
    icon: <ShoppingCart className="w-5 h-5" />,
    enabled: true,
    category: "service",
  },
  {
    id: "concierge",
    name: "Concierge & Tickets",
    description: "Solicitudes de ayuda y venta de tickets",
    icon: <MessageSquare className="w-5 h-5" />,
    enabled: true,
    category: "service",
  },
  {
    id: "recommendations",
    name: "Recomendaciones",
    description: "Sugerencias personalizadas para huéspedes",
    icon: <Sparkles className="w-5 h-5" />,
    enabled: false,
    category: "service",
  },
  {
    id: "spaces",
    name: "Gestión de Espacios",
    description: "Administrar salones, conferencias y áreas comunes",
    icon: <Building2 className="w-5 h-5" />,
    enabled: false,
    category: "service",
  },
  // Analytics Modules
  {
    id: "analytics",
    name: "Analytics Básico",
    description: "Métricas y estadísticas básicas",
    icon: <BarChart3 className="w-5 h-5" />,
    enabled: true,
    category: "analytics",
  },
  {
    id: "revenue",
    name: "Revenue Management",
    description: "Optimización de ingresos y tarifas dinámicas",
    icon: <DollarSign className="w-5 h-5" />,
    enabled: false,
    category: "analytics",
  },
  {
    id: "reports",
    name: "Reportes Avanzados",
    description: "Informes detallados y exportación de datos",
    icon: <FileText className="w-5 h-5" />,
    enabled: false,
    category: "analytics",
  },
  // Advanced Modules
  {
    id: "ai",
    name: "Asistente AI",
    description: "Asistente inteligente para ventas y atención",
    icon: <Sparkles className="w-5 h-5" />,
    enabled: false,
    category: "advanced",
  },
  {
    id: "security",
    name: "Seguridad Avanzada",
    description: "Autenticación de dos factores y auditoría",
    icon: <Shield className="w-5 h-5" />,
    enabled: false,
    category: "advanced",
  },
  {
    id: "notifications",
    name: "Notificaciones Push",
    description: "Alertas en tiempo real para staff y clientes",
    icon: <Bell className="w-5 h-5" />,
    enabled: false,
    category: "advanced",
  },
]

export default function OrganizationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [organization] = useState<Organization>(mockOrganization)
  const [modules, setModules] = useState<Module[]>(initialModules)

  const toggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId ? { ...module, enabled: !module.enabled } : module
      )
    )
  }

  const getModulesByCategory = (category: string) => {
    return modules.filter((module) => module.category === category)
  }

  const enabledModulesCount = modules.filter((m) => m.enabled).length

  const categoryInfo = {
    core: { title: "Módulos Base", color: "blue", description: "Funcionalidades esenciales del sistema" },
    service: { title: "Servicios", color: "purple", description: "Servicios adicionales para huéspedes" },
    analytics: { title: "Analytics", color: "green", description: "Análisis de datos e informes" },
    advanced: { title: "Avanzados", color: "amber", description: "Funcionalidades premium" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/system/organizations")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center gap-3">
              {organization.logo ? (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Image src={organization.logo || "/placeholder.svg"} alt={organization.name} width={48} height={48} className="object-cover" loading="eager" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={organization.status === "active" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-gray-500/10 text-gray-600 border-gray-500/20"}>
                    {organization.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">Creado el {new Date(organization.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/system/organizations")} variant="outline" className="gap-2 bg-transparent text-blue-600 border-blue-200 hover:bg-blue-50">
              <Home className="w-4 h-4" />
              Volver a Organizaciones
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Habitaciones</p>
                  <p className="text-3xl font-bold text-white">{organization.totalRooms}</p>
                  <p className="text-xs text-blue-100 mt-1">Total disponibles</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bed className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100 mb-1">Clientes Activos</p>
                  <p className="text-3xl font-bold text-white">{organization.activeClients}</p>
                  <p className="text-xs text-purple-100 mt-1">Huéspedes actuales</p>
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
                  <p className="text-sm text-green-100 mb-1">Ingresos</p>
                  <p className="text-3xl font-bold text-white">€{(organization.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-green-100 mt-1">Este mes</p>
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
                  <p className="text-sm text-amber-100 mb-1">Ocupación</p>
                  <p className="text-3xl font-bold text-white">{organization.occupancy}%</p>
                  <p className="text-xs text-amber-100 mt-1">Tasa actual</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Hotel className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Information & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Información del Hotel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dirección</p>
                <p className="font-semibold text-gray-900">{organization.address}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                <p className="font-semibold text-gray-900">{organization.location}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha de creación</p>
                <p className="font-semibold text-gray-900">
                  {new Date(organization.createdAt).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Información del Administrador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre completo</p>
                <p className="font-semibold text-gray-900">{organization.admin}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{organization.adminEmail}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="font-semibold text-gray-900">{organization.adminPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Management */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Gestión de Módulos
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Activa o desactiva funcionalidades para este hotel
                </p>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                {enabledModulesCount} de {modules.length} activos
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {(["core", "service", "analytics", "advanced"] as const).map((category) => {
              const categoryModules = getModulesByCategory(category)
              const info = categoryInfo[category]
              const colorClasses = {
                blue: "from-blue-500 to-blue-600",
                purple: "from-purple-500 to-purple-600",
                green: "from-green-500 to-green-600",
                amber: "from-amber-500 to-amber-600",
              }

              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-10 w-1 rounded-full bg-gradient-to-b ${colorClasses[info.color as keyof typeof colorClasses]}`} />
                    <div>
                      <h3 className="font-bold text-gray-900">{info.title}</h3>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryModules.map((module) => (
                      <Card 
                        key={module.id} 
                        className={`border transition-all ${
                          module.enabled 
                            ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-md" 
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                module.enabled 
                                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white" 
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {module.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{module.name}</h4>
                                <p className="text-sm text-gray-600">{module.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={module.enabled}
                              onCheckedChange={() => toggleModule(module.id)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/system/organizations")}
            className="gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a organizaciones
          </Button>
          <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle2 className="w-4 h-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}

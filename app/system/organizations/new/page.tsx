"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  ArrowLeft,
  Upload,
  MapPin,
  User,
  Hotel,
  Hash,
  DollarSign,
  Save,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function NewOrganizationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    admin: "",
    adminEmail: "",
    adminPhone: "",
    totalRooms: "",
    description: "",
    logo: null as File | null,
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Nueva organización creada:", formData)
    
    // Redirigir a la lista de organizaciones
    router.push("/system/organizations")
  }

  const handleCancel = () => {
    router.back()
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
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nuevo Hotel</h1>
                <p className="text-sm text-gray-600">Registra una nueva organización</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="gap-2 bg-transparent"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar Hotel"}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Logo del Hotel
              </CardTitle>
              <CardDescription>
                Sube el logo de tu hotel (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <Image
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Hotel className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Seleccionar imagen
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG o SVG (máx. 2MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información General */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Información General
              </CardTitle>
              <CardDescription>
                Datos básicos del hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-gray-500" />
                    Nombre del Hotel *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Hotel Premium Madrid"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalRooms" className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    Número de Habitaciones *
                  </Label>
                  <Input
                    id="totalRooms"
                    name="totalRooms"
                    type="number"
                    placeholder="120"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe brevemente el hotel..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Ubicación
              </CardTitle>
              <CardDescription>
                Dirección y ubicación del hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección Completa *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Calle Principal 123"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ciudad / Región *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Madrid, España"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Administrador */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Administrador Principal
              </CardTitle>
              <CardDescription>
                Información del responsable del hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin">Nombre Completo *</Label>
                <Input
                  id="admin"
                  name="admin"
                  placeholder="Carlos García"
                  value={formData.admin}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email *</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    placeholder="admin@hotel.com"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Teléfono *</Label>
                  <Input
                    id="adminPhone"
                    name="adminPhone"
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={formData.adminPhone}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Importante */}
          <Card className="border-0 shadow-lg bg-blue-50 border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ¿Qué sucede después?
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Se creará la organización con el estado "Activa"</li>
                    <li>• El administrador recibirá un correo con las credenciales de acceso</li>
                    <li>• Podrás configurar habitaciones y servicios desde el panel de administración</li>
                    <li>• Los clientes podrán comenzar a usar el sistema inmediatamente</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción móviles */}
          <div className="flex gap-3 md:hidden">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Eraser, Sparkles, Hotel, Car, Award as IdCard, Crown, Upload, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CheckInPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [clientType, setClientType] = useState<"normal" | "vip">("normal")
  const [dniPhoto, setDniPhoto] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reservationCode: "",
    isTitular: false,
    idNumber: "",
    hasVehicle: false,
    vehiclePlate: "",
    vehicleBrand: "",
    vehicleModel: "",
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
      }
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/client?type=${clientType}`)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDniPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDniPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeDniPhoto = () => {
    setDniPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader
          className="text-center space-y-4 relative overflow-hidden py-8"
          style={{ backgroundColor: "#88fdda" }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-gradient-to-tl from-cyan-400 to-purple-400 blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative flex justify-center mb-2">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #142834, #11AFBF)",
                  boxShadow: "0 8px 20px rgba(17, 175, 191, 0.3)",
                }}
              >
                <Hotel className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          <div className="relative">
            <CardTitle className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">Bienvenido</CardTitle>
            <div
              className="h-1 w-24 mx-auto rounded-full"
              style={{
                background: "linear-gradient(to right, #142834, #11AFBF)",
              }}
            />
          </div>

          <CardDescription className="text-gray-700 text-base relative px-4 leading-relaxed">
            Estás a solo un paso de disfrutar una experiencia inolvidable
          </CardDescription>

          <div className="flex justify-center gap-2 pt-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="pb-3 border-b-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Tipo de Cliente</p>
              <RadioGroup value={clientType} onValueChange={(value) => setClientType(value as "normal" | "vip")}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="cursor-pointer font-medium">
                    Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vip" id="vip" />
                  <Label htmlFor="vip" className="flex items-center gap-2 cursor-pointer font-medium">
                    <Crown className="w-4 h-4 text-amber-500" />
                    VIP
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Input
              id="firstName"
              type="text"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="border-gray-300"
            />

            <Input
              id="lastName"
              type="text"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="border-gray-300"
            />

            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="border-gray-300"
            />

            <Input
              id="phone"
              type="tel"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="border-gray-300"
            />

            <Input
              id="reservationCode"
              type="text"
              placeholder="Código de Reserva"
              value={formData.reservationCode}
              onChange={(e) => handleChange("reservationCode", e.target.value)}
              className="border-gray-300"
            />

            <div className="pt-3 border-t-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Información Adicional</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isTitular"
                    checked={formData.isTitular}
                    onCheckedChange={(checked) => handleChange("isTitular", checked as boolean)}
                  />
                  <Label htmlFor="isTitular" className="flex items-center gap-2 cursor-pointer font-medium">
                    <IdCard className="w-4 h-4 text-primary" />
                    Soy el titular de la reserva
                  </Label>
                </div>

                {formData.isTitular && (
                  <div className="pl-6 space-y-3">
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="Número de Documento (DNI, Pasaporte, etc.)"
                      value={formData.idNumber}
                      onChange={(e) => handleChange("idNumber", e.target.value)}
                      className="border-gray-300"
                    />

                    <div className="space-y-2">
                      <Label htmlFor="dniPhoto" className="text-sm font-medium text-gray-700">
                        Foto del DNI
                      </Label>

                      {!dniPhoto ? (
                        <div className="relative">
                          <input
                            ref={fileInputRef}
                            id="dniPhoto"
                            type="file"
                            accept="image/*"
                            onChange={handleDniPhotoChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed"
                            style={{ borderColor: "#88fdda" }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Subir foto del DNI
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="relative border-2 rounded-lg overflow-hidden"
                          style={{ borderColor: "#88fdda" }}
                        >
                          <img src={dniPhoto || "/placeholder.svg"} alt="DNI" className="w-full h-40 object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={removeDniPhoto}
                            className="absolute top-2 right-2 h-8 w-8"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Información del Vehículo</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasVehicle"
                    checked={formData.hasVehicle}
                    onCheckedChange={(checked) => handleChange("hasVehicle", checked as boolean)}
                  />
                  <Label htmlFor="hasVehicle" className="flex items-center gap-2 cursor-pointer font-medium">
                    <Car className="w-4 h-4 text-primary" />
                    Viajaré con vehículo
                  </Label>
                </div>

                {formData.hasVehicle && (
                  <div className="space-y-3 pl-6">
                    <Input
                      id="vehiclePlate"
                      type="text"
                      placeholder="Matrícula (ABC-1234)"
                      value={formData.vehiclePlate}
                      onChange={(e) => handleChange("vehiclePlate", e.target.value)}
                      className="border-gray-300"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        id="vehicleBrand"
                        type="text"
                        placeholder="Marca"
                        value={formData.vehicleBrand}
                        onChange={(e) => handleChange("vehicleBrand", e.target.value)}
                        className="border-gray-300"
                      />

                      <Input
                        id="vehicleModel"
                        type="text"
                        placeholder="Modelo"
                        value={formData.vehicleModel}
                        onChange={(e) => handleChange("vehicleModel", e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Firma Digital</p>

              <div className="space-y-2">
                <div className="flex items-center justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={clearSignature} className="h-8 px-2 text-xs">
                    <Eraser className="w-3 h-3 mr-1" />
                    Limpiar
                  </Button>
                </div>
                <div className="border-2 rounded-md overflow-hidden" style={{ borderColor: "#88fdda" }}>
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full bg-white cursor-crosshair touch-none"
                    style={{ touchAction: "none" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Dibuja tu firma en el recuadro</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 text-white font-semibold"
              style={{
                background: "linear-gradient(to right, #6f65d0, #67f1d0)",
              }}
            >
              Completar Check-In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Necesitas ayuda?{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Contactar Recepción
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

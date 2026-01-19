"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, AlertCircle, Utensils, BedDouble, Wrench, MessageSquare } from "lucide-react"

export default function HelpFormPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const categories = [
    { id: "orden", label: "Problema con Orden", icon: Utensils, color: "bg-orange-100 text-orange-600" },
    { id: "servicio", label: "Problema con Servicio", icon: AlertCircle, color: "bg-blue-100 text-blue-600" },
    { id: "habitacion", label: "Problema en Habitación", icon: BedDouble, color: "bg-purple-100 text-purple-600" },
    { id: "mantenimiento", label: "Mantenimiento", icon: Wrench, color: "bg-red-100 text-red-600" },
    { id: "otro", label: "Otro", icon: MessageSquare, color: "bg-gray-100 text-gray-600" },
  ]

  const subcategories: Record<string, string[]> = {
    orden: [
      "Pedido incorrecto",
      "Comida fría",
      "Demora en la entrega",
      "Falta un item",
      "Problema con la calidad",
      "Otro",
    ],
    servicio: [
      "Limpieza no realizada",
      "Personal descortés",
      "Servicio no disponible",
      "Demora en atención",
      "Solicitud no atendida",
      "Otro",
    ],
    habitacion: [
      "Temperatura (AC/Calefacción)",
      "Ruido",
      "Problema con camas",
      "Limpieza insuficiente",
      "Amenidades faltantes",
      "Otro",
    ],
    mantenimiento: ["Plomería", "Electricidad", "TV/Electrónicos", "Cerradura/Puerta", "Ventanas", "Otro"],
    otro: ["Consulta general", "Sugerencia", "Queja administrativa", "Solicitud especial", "Otro"],
  }

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedSubcategory || !description.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)

    // Redirect after success
    setTimeout(() => {
      router.push("/client")
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Reporte Enviado!</h2>
          <p className="text-gray-600">Nuestro equipo se pondrá en contacto contigo pronto.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#11AFBE] to-[#773CCA] text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">¿Necesitas Ayuda?</h1>
            <p className="text-sm text-white/80">Reporta cualquier inconveniente</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Category Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Selecciona una categoría</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id
              return (
                <Card
                  key={category.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-2 border-[#773CCA] bg-[#773CCA]/5"
                      : "border border-gray-200 hover:border-[#11AFBE]"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setSelectedSubcategory(null)
                  }}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{category.label}</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {selectedCategory && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Especifica el problema</h2>
            <div className="space-y-2">
              {subcategories[selectedCategory].map((subcategory) => (
                <Card
                  key={subcategory}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedSubcategory === subcategory
                      ? "border-2 border-[#11AFBE] bg-[#11AFBE]/5"
                      : "border border-gray-200 hover:border-[#11AFBE] hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedSubcategory(subcategory)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedSubcategory === subcategory ? "border-[#11AFBE] bg-[#11AFBE]" : "border-gray-300"
                      }`}
                    >
                      {selectedSubcategory === subcategory && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{subcategory}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {selectedCategory && selectedSubcategory && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Describe el problema</h2>
            <Textarea
              placeholder="Por favor, describe con el mayor detalle posible el inconveniente que estás experimentando..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200 p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Respuesta rápida garantizada</p>
              <p className="text-blue-700">Nuestro equipo responderá tu solicitud en menos de 15 minutos.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Submit Button */}
      {selectedCategory && selectedSubcategory && description.trim() && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#773CCA] hover:bg-[#6530b0] text-white py-6 text-base font-semibold"
          >
            {isSubmitting ? "Enviando..." : "Enviar Reporte"}
          </Button>
        </div>
      )}
    </div>
  )
}

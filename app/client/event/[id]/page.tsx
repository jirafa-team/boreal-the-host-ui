"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, MapPin, Users, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const events = [
    {
      id: "1",
      name: "Conferencia Anual Q1",
      description: "Únete a líderes de la industria para discutir las últimas tendencias y estrategias empresariales.",
      date: "2024-11-10",
      time: "9:00 AM",
      duration: "3 horas",
      location: "Salón Principal",
      category: "conferencia",
      registered: true,
      attendees: 45,
      image: "/business-conference-presentation.jpg",
      gradient: "from-blue-500 to-purple-600",
      fullDescription:
        "Esta conferencia reunirá a los principales expertos en tecnología y negocios para compartir insights sobre las últimas tendencias del mercado. Incluye sesiones de networking, presentaciones magistrales y talleres interactivos.",
      speakers: [
        { name: "Dr. María González", role: "CEO Tech Innovations" },
        { name: "Juan Pérez", role: "Director de Estrategia" },
      ],
      agenda: [
        { time: "9:00 AM", activity: "Registro y Bienvenida" },
        { time: "9:30 AM", activity: "Keynote: Tendencias 2024" },
        { time: "11:00 AM", activity: "Panel de Discusión" },
        { time: "12:00 PM", activity: "Networking y Cierre" },
      ],
    },
    {
      id: "2",
      name: "Cena de Gala",
      description:
        "Una noche elegante con música en vivo y un menú de cinco tiempos preparado por nuestro chef ejecutivo.",
      date: "2024-11-12",
      time: "7:00 PM",
      duration: "4 horas",
      location: "Restaurante Principal",
      category: "gala",
      registered: false,
      attendees: 32,
      image: "/elegant-gala-dinner-restaurant.jpg",
      gradient: "from-amber-500 to-red-600",
      fullDescription:
        "Disfruta de una experiencia culinaria excepcional en nuestra cena de gala anual. El menú ha sido cuidadosamente diseñado por nuestro chef ejecutivo e incluye maridaje de vinos premium.",
      speakers: [],
      agenda: [
        { time: "7:00 PM", activity: "Cóctel de Bienvenida" },
        { time: "8:00 PM", activity: "Primer Tiempo" },
        { time: "9:00 PM", activity: "Música en Vivo" },
        { time: "10:30 PM", activity: "Postre y Despedida" },
      ],
    },
    {
      id: "3",
      name: "Workshop de Innovación",
      description: "Taller interactivo sobre metodologías ágiles y transformación digital para equipos modernos.",
      date: "2024-11-15",
      time: "2:00 PM",
      duration: "2.5 horas",
      location: "Sala de Conferencias B",
      category: "workshop",
      registered: false,
      attendees: 28,
      image: "/innovation-technology-workshop.jpg",
      gradient: "from-green-500 to-teal-500",
      fullDescription:
        "Un taller práctico donde aprenderás las últimas metodologías de innovación y trabajo colaborativo. Incluye ejercicios grupales y casos de estudio reales.",
      speakers: [{ name: "Laura Martínez", role: "Innovation Consultant" }],
      agenda: [
        { time: "2:00 PM", activity: "Introducción a Metodologías Ágiles" },
        { time: "3:00 PM", activity: "Ejercicio Práctico Grupal" },
        { time: "4:00 PM", activity: "Q&A y Conclusiones" },
      ],
    },
  ]

  const event = events.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Evento no encontrado</p>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" priority />
        <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {event.registered ? (
            <Badge className="bg-white text-[#773CCA] hover:bg-white shadow-lg text-base px-4 py-2">✓ Registrado</Badge>
          ) : (
            <Badge className="bg-white text-gray-700 hover:bg-white shadow-lg text-base px-4 py-2">Disponible</Badge>
          )}
        </div>

        {/* Event Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
          <p className="text-white/90 text-base">{event.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-gradient-to-br ${event.gradient} rounded-xl p-4 text-white text-center`}>
            <p className="text-xs font-semibold uppercase opacity-90">{month}</p>
            <p className="text-3xl font-bold leading-none my-1">{day}</p>
            <p className="text-xs opacity-90">{event.time}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold">Duración</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{event.duration}</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 mb-1">Ubicación</p>
              <p className="text-lg font-semibold text-gray-800">{event.location}</p>
            </div>
          </div>
        </div>

        {/* Attendees */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Asistentes</p>
                <p className="text-lg font-bold text-gray-800">{event.attendees} personas</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${event.gradient} border-2 border-white flex items-center justify-center text-white text-sm font-semibold`}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Tag className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Categoría</p>
              <Badge variant="outline" className="capitalize text-base px-3 py-1">
                {event.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Acerca del Evento</h2>
          <p className="text-gray-600 leading-relaxed">{event.fullDescription}</p>
        </div>

        {/* Speakers (if any) */}
        {event.speakers.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Presentadores</h2>
            <div className="space-y-3">
              {event.speakers.map((speaker, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.gradient} flex items-center justify-center text-white font-bold`}
                  >
                    {speaker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{speaker.name}</p>
                    <p className="text-sm text-gray-500">{speaker.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agenda */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Agenda</h2>
          <div className="space-y-4">
            {event.agenda.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="text-sm font-bold text-[#773CCA] whitespace-nowrap">{item.time}</div>
                <div className="flex-1">
                  <p className="text-gray-700">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
        {event.registered ? (
          <Button size="lg" className="w-full bg-[#773CCA] text-white hover:bg-[#773CCA]/90 text-lg py-6" disabled>
            Ya estás registrado
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#11AFBE] to-[#773CCA] text-white hover:opacity-90 text-lg py-6"
          >
            Registrarse al Evento
          </Button>
        )}
      </div>
    </div>
  )
}

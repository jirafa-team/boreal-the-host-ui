"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Star, ExternalLink, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

type Recommendation = {
  id: number
  name: string
  category: string
  distance: string
  description: string
  rating: string
  address: string
  phone?: string
  website?: string
  image?: string
}

const categoryColors: Record<string, string> = {
  Cultura: "bg-purple-500",
  Gastronomía: "bg-orange-500",
  Naturaleza: "bg-green-500",
  Entretenimiento: "bg-pink-500",
  Compras: "bg-blue-500",
  Deportes: "bg-red-500",
}

export default function RecommendationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingRecommendation, setEditingRecommendation] = useState<Recommendation | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    distance: "",
    description: "",
    rating: "",
    address: "",
    phone: "",
    website: "",
    image: "",
  })

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 1,
      name: "Museo Nacional",
      category: "Cultura",
      distance: "1.2 km",
      description: "Arte contemporáneo y exposiciones históricas",
      rating: "4.8",
      address: "Calle Principal 123",
      phone: "+34 912 345 678",
      website: "https://museonacional.es",
      image: "https://images.unsplash.com/photo-1598255762823-d28297c9b3cb?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Restaurante La Pérgola",
      category: "Gastronomía",
      distance: "800 m",
      description: "Cocina mediterránea con estrella Michelin",
      rating: "4.9",
      address: "Avenida Gastronómica 45",
      phone: "+34 913 456 789",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Parque Central",
      category: "Naturaleza",
      distance: "2.5 km",
      description: "Amplias zonas verdes y lago artificial",
      rating: "4.7",
      address: "Paseo del Parque s/n",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Teatro Principal",
      category: "Entretenimiento",
      distance: "1.5 km",
      description: "Espectáculos y obras de teatro en vivo",
      rating: "4.6",
      address: "Plaza del Teatro 8",
      phone: "+34 914 567 890",
      website: "https://teatroprincipal.es",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=400&fit=crop",
    },
  ])

  const categories = ["Cultura", "Gastronomía", "Naturaleza", "Entretenimiento", "Compras", "Deportes"]

  const filteredRecommendations = recommendations.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || rec.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      category: "",
      distance: "",
      description: "",
      rating: "",
      address: "",
      phone: "",
      website: "",
      image: "",
    })
    setEditingRecommendation(null)
    setCreateDialogOpen(true)
  }

  const handleOpenEdit = (rec: Recommendation) => {
    setFormData({
      name: rec.name,
      category: rec.category,
      distance: rec.distance,
      description: rec.description,
      rating: rec.rating,
      address: rec.address,
      phone: rec.phone || "",
      website: rec.website || "",
      image: rec.image || "",
    })
    setEditingRecommendation(rec)
    setCreateDialogOpen(true)
  }

  const handleSave = () => {
    if (editingRecommendation) {
      setRecommendations(
        recommendations.map((rec) => (rec.id === editingRecommendation.id ? { ...rec, ...formData } : rec)),
      )
    } else {
      setRecommendations([
        ...recommendations,
        {
          id: Math.max(...recommendations.map((r) => r.id)) + 1,
          ...formData,
        },
      ])
    }
    setCreateDialogOpen(false)
  }

  const handleDelete = (id: number) => {
    setRecommendations(recommendations.filter((rec) => rec.id !== id))
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recomendaciones de la Ciudad</h1>
          <p className="text-muted-foreground mt-2">Gestiona lugares recomendados para tus huéspedes</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <button 
              className="relative group w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              title="Nueva recomendación"
              onClick={handleOpenCreate}
            >
              <Lightbulb className="w-5 h-5" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Nueva Recomendación
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRecommendation ? "Editar Recomendación" : "Nueva Recomendación"}</DialogTitle>
              <DialogDescription>
                {editingRecommendation
                  ? "Actualiza la información de la recomendación"
                  : "Añade un nuevo lugar recomendado para tus huéspedes"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="image">URL de la Imagen</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.image && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border mt-2">
                    <Image src={formData.image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Lugar *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Museo Nacional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distancia del Hotel *</Label>
                  <Input
                    id="distance"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="Ej: 1.2 km"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Valoración *</Label>
                  <Input
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="Ej: 4.8"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descripción del lugar..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle Principal 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+34 912 345 678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web (opcional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {editingRecommendation ? "Actualizar" : "Crear"} Recomendación
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((rec) => (
          <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-all">
            {rec.image && (
              <div className="relative w-full h-48">
                <Image src={rec.image || "/placeholder.svg"} alt={rec.name} fill className="object-cover" />
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-lg mb-2">{rec.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${categoryColors[rec.category]} text-white`}>{rec.category}</Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{rec.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{rec.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{rec.distance}</span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.address}</p>
                {rec.phone && <p className="text-sm text-muted-foreground">{rec.phone}</p>}
                {rec.website && (
                  <a
                    href={rec.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    Visitar sitio web <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleOpenEdit(rec)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(rec.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron recomendaciones</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterCategory !== "all"
              ? "Intenta con otros términos de búsqueda"
              : "Empieza agregando lugares recomendados para tus huéspedes"}
          </p>
          {!searchTerm && filterCategory === "all" && (
            <Button onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primera Recomendación
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}

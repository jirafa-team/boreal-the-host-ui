"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Club Sandwich",
    description: "Triple decker con pollo, bacon, lechuga, tomate y mayonesa",
    price: 12.5,
    category: "Platos Principales",
    image: "/club-sandwich.jpg",
  },
  {
    id: "2",
    name: "Hamburguesa Deluxe",
    description: "Carne Angus, queso cheddar, bacon, cebolla caramelizada",
    price: 15.0,
    category: "Platos Principales",
    image: "/gourmet-burger.png",
  },
  {
    id: "3",
    name: "Pasta Carbonara",
    description: "Fettuccine con salsa de huevo, panceta y parmesano",
    price: 14.0,
    category: "Platos Principales",
    image: "/pasta-carbonara.png",
  },
  {
    id: "4",
    name: "Ensalada César",
    description: "Lechuga romana, crutones, pollo grillado, aderezo césar",
    price: 11.0,
    category: "Ensaladas",
    image: "/caesar-salad.png",
  },
  {
    id: "5",
    name: "Sushi Mix",
    description: "Selección de 12 piezas variadas de sushi y sashimi",
    price: 22.0,
    category: "Especialidades",
    image: "/sushi-platter.png",
  },
  {
    id: "6",
    name: "Pizza Margherita",
    description: "Salsa de tomate, mozzarella fresca, albahaca",
    price: 13.5,
    category: "Platos Principales",
    image: "/margherita-pizza.png",
  },
  {
    id: "7",
    name: "Tiramisú",
    description: "Postre italiano clásico con mascarpone y café",
    price: 7.5,
    category: "Postres",
    image: "/classic-tiramisu.png",
  },
  {
    id: "8",
    name: "Cheesecake",
    description: "Tarta de queso con coulis de frutos rojos",
    price: 8.0,
    category: "Postres",
    image: "/classic-cheesecake.png",
  },
  {
    id: "9",
    name: "Coca-Cola",
    description: "Lata 330ml",
    price: 3.5,
    category: "Bebidas",
    image: "/generic-soda-can.png",
  },
  {
    id: "10",
    name: "Agua Mineral",
    description: "Botella 500ml",
    price: 2.5,
    category: "Bebidas",
    image: "/reusable-water-bottle.png",
  },
  {
    id: "11",
    name: "Vino Tinto",
    description: "Copa de vino tinto reserva",
    price: 8.5,
    category: "Bebidas",
    image: "/red-wine-glass.png",
  },
]

export default function RoomServiceMenu() {
  const router = useRouter()
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos")

  const categories = ["Todos", "Platos Principales", "Ensaladas", "Especialidades", "Postres", "Bebidas"]

  const filteredItems =
    selectedCategory === "Todos" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const groupedByCategory = () => {
    const groups: { [key: string]: MenuItem[] } = {}
    const categoryOrder = ["Platos Principales", "Ensaladas", "Especialidades", "Postres", "Bebidas"]

    categoryOrder.forEach((cat) => {
      groups[cat] = menuItems.filter((item) => item.category === cat)
    })

    return groups
  }

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [itemId, qty]) => {
      const item = menuItems.find((i) => i.id === itemId)
      return sum + (item ? item.price * qty : 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Link href="/client">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Menú Room Service</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-[73px] z-10 bg-background border-b border-border overflow-x-auto">
        <div className="flex gap-2 p-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="pb-32 px-4 pt-4 space-y-3">
        {selectedCategory === "Todos"
          ? Object.entries(groupedByCategory()).map(
              ([category, items]) =>
                items.length > 0 && (
                  <div key={category} className="space-y-3">
                    <h2 className="text-lg font-bold text-foreground mt-4 first:mt-0">{category}</h2>
                    {items.map((item) => (
                      <Card key={item.id} className="p-3 border-2" style={{ borderColor: "#88fdda" }}>
                        <div className="flex gap-3">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base">{item.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-lg font-bold text-primary">€{item.price.toFixed(2)}</span>
                              {cart[item.id] ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 bg-transparent"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="font-semibold min-w-[20px] text-center">{cart[item.id]}</span>
                                  <Button
                                    size="icon"
                                    className="h-7 w-7 text-white"
                                    style={{ backgroundColor: "#773CCA" }}
                                    onClick={() => addToCart(item.id)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  className="text-white"
                                  style={{ backgroundColor: "#773CCA" }}
                                  onClick={() => addToCart(item.id)}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Agregar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ),
            )
          : filteredItems.map((item) => (
              <Card key={item.id} className="p-3 border-2" style={{ borderColor: "#88fdda" }}>
                <div className="flex gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-primary">€{item.price.toFixed(2)}</span>
                      {cart[item.id] ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-semibold min-w-[20px] text-center">{cart[item.id]}</span>
                          <Button
                            size="icon"
                            className="h-7 w-7 text-white"
                            style={{ backgroundColor: "#773CCA" }}
                            onClick={() => addToCart(item.id)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: "#773CCA" }}
                          onClick={() => addToCart(item.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
          <Button
            className="w-full h-14 bg-gradient-to-r from-[#6f65d0] to-[#67f1d0] text-white text-lg font-semibold"
            onClick={() => {
              alert(`Orden enviada: ${getTotalItems()} items - Total: €${getTotalPrice().toFixed(2)}`)
              router.push("/client")
            }}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Ordenar ({getTotalItems()}) - €{getTotalPrice().toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  )
}

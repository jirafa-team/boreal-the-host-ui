"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Square, Type, Trash2, Move, Edit2, Save, Grid3x3, Copy, Home, DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type RoomType = "single" | "double" | "suite" | "deluxe" | "presidential"

interface Room {
  id: string
  type: RoomType
  number: string
  x: number
  y: number
  width: number
  height: number
  floor: number
  status: "available" | "occupied" | "maintenance" | "cleaning"
  notes: string
}

interface TextLabel {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
}

const roomTypeConfig = {
  single: { label: "Individual", color: "#3b82f6", width: 100, height: 80 },
  double: { label: "Doble", color: "#8b5cf6", width: 120, height: 100 },
  suite: { label: "Suite", color: "#ec4899", width: 150, height: 120 },
  deluxe: { label: "Deluxe", color: "#f59e0b", width: 140, height: 110 },
  presidential: { label: "Presidencial", color: "#10b981", width: 180, height: 140 },
}

export default function SpaceBuilderPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [textLabels, setTextLabels] = useState<TextLabel[]>([])
  const [selectedTool, setSelectedTool] = useState<"room" | "text" | "move" | null>(null)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>("double")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [currentFloor, setCurrentFloor] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const addRoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool !== "room" || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const config = roomTypeConfig[selectedRoomType]
    const roomNumber = `${currentFloor}${String(rooms.filter((r) => r.floor === currentFloor).length + 1).padStart(2, "0")}`

    const newRoom: Room = {
      id: Date.now().toString(),
      type: selectedRoomType,
      number: roomNumber,
      x: x - config.width / 2,
      y: y - config.height / 2,
      width: config.width,
      height: config.height,
      floor: currentFloor,
      status: "available",
      notes: "",
    }

    setRooms([...rooms, newRoom])
    setSelectedTool(null)
  }

  const addTextLabel = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool !== "text" || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newLabel: TextLabel = {
      id: Date.now().toString(),
      text: "Área",
      x,
      y,
      fontSize: 16,
    }

    setTextLabels([...textLabels, newLabel])
    setSelectedTool(null)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === "room") {
      addRoom(e)
    } else if (selectedTool === "text") {
      addTextLabel(e)
    }
  }

  const deleteRoom = () => {
    if (selectedRoom) {
      setRooms(rooms.filter((r) => r.id !== selectedRoom))
      setSelectedRoom(null)
    }
  }

  const duplicateRoom = () => {
    if (selectedRoom) {
      const room = rooms.find((r) => r.id === selectedRoom)
      if (room) {
        const newRoom = {
          ...room,
          id: Date.now().toString(),
          number: `${currentFloor}${String(rooms.filter((r) => r.floor === currentFloor).length + 1).padStart(2, "0")}`,
          x: room.x + 20,
          y: room.y + 20,
        }
        setRooms([...rooms, newRoom])
        setSelectedRoom(newRoom.id)
      }
    }
  }

  const startDragging = (roomId: string, e: React.MouseEvent) => {
    if (selectedTool !== "move") return
    e.stopPropagation()

    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      setIsDragging(true)
      setSelectedRoom(roomId)
      setDragOffset({
        x: e.clientX - room.x,
        y: e.clientY - room.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !selectedRoom || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y

    setRooms(rooms.map((room) => (room.id === selectedRoom ? { ...room, x: newX, y: newY } : room)))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const currentFloorRooms = rooms.filter((r) => r.floor === currentFloor)

  return (
    <>
      {/* Left Sidebar - Tools */}
      <aside className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-foreground">Diseñador de Hotel</h1>
            <p className="text-xs text-muted-foreground">Crea el plano de tu hotel</p>
          </div>

          {/* Floor Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Piso</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((floor) => (
                <Button
                  key={floor}
                  variant={currentFloor === floor ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentFloor(floor)}
                  className="flex-1"
                >
                  {floor}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="p-4 border-b border-border space-y-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Herramientas</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedTool === "room" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool("room")}
                className="justify-start"
              >
                <Square className="w-4 h-4 mr-2" />
                Habitación
              </Button>
              <Button
                variant={selectedTool === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool("text")}
                className="justify-start"
              >
                <Type className="w-4 h-4 mr-2" />
                Etiqueta
              </Button>
              <Button
                variant={selectedTool === "move" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool("move")}
                className="justify-start"
              >
                <Move className="w-4 h-4 mr-2" />
                Mover
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)} className="justify-start">
                <Grid3x3 className="w-4 h-4 mr-2" />
                {showGrid ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
          </div>

          {selectedTool === "room" && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Tipo de Habitación</Label>
              <Select value={selectedRoomType} onValueChange={(value) => setSelectedRoomType(value as RoomType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roomTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: config.color }} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Room Actions */}
        {selectedRoom && (
          <div className="p-4 border-b border-border space-y-2">
            <Label className="text-sm font-medium mb-2 block">Acciones</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const room = rooms.find((r) => r.id === selectedRoom)
                if (room) setEditingRoom(room)
              }}
              className="w-full justify-start"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={duplicateRoom} className="w-full justify-start bg-transparent">
              <Copy className="w-4 h-4 mr-2" />
              Duplicar
            </Button>
            <Button variant="destructive" size="sm" onClick={deleteRoom} className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        )}

        {/* Floor Summary */}
        <div className="flex-1 overflow-auto p-4">
          <Label className="text-sm font-medium mb-3 block">Habitaciones - Piso {currentFloor}</Label>
          <div className="space-y-2">
            {currentFloorRooms.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No hay habitaciones en este piso</p>
            ) : (
              currentFloorRooms.map((room) => (
                <Card
                  key={room.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedRoom === room.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: roomTypeConfig[room.type].color }} />
                      <div>
                        <p className="text-sm font-medium">Habitación {room.number}</p>
                        <p className="text-xs text-muted-foreground">{roomTypeConfig[room.type].label}</p>
                      </div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        room.status === "available"
                          ? "bg-green-500/10 text-green-600"
                          : room.status === "occupied"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {room.status === "available"
                        ? "Disponible"
                        : room.status === "occupied"
                          ? "Ocupada"
                          : room.status === "maintenance"
                            ? "Mantenimiento"
                            : "Limpieza"}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Button className="w-full" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Guardar Plano
          </Button>
        </div>
      </aside>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-muted">
        <div className="p-8">
          <div
            ref={canvasRef}
            className="relative w-full min-h-[800px] bg-background rounded-lg border border-border shadow-lg"
            style={{
              backgroundImage: showGrid
                ? "repeating-linear-gradient(0deg, hsl(var(--border)) 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, hsl(var(--border)) 0 1px, transparent 1px 100%)"
                : "none",
              backgroundSize: showGrid ? "20px 20px" : "auto",
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Text Labels */}
            {textLabels.map((label) => (
              <div
                key={label.id}
                className="absolute font-semibold text-muted-foreground pointer-events-none"
                style={{
                  left: label.x,
                  top: label.y,
                  fontSize: label.fontSize,
                }}
              >
                {label.text}
              </div>
            ))}

            {/* Rooms */}
            {currentFloorRooms.map((room) => {
              const config = roomTypeConfig[room.type]
              return (
                <div
                  key={room.id}
                  className={`absolute rounded-lg border-2 transition-all ${
                    selectedRoom === room.id ? "ring-2 ring-primary border-primary shadow-lg" : "border-foreground/20"
                  } ${selectedTool === "move" ? "cursor-move" : "cursor-pointer"}`}
                  style={{
                    left: room.x,
                    top: room.y,
                    width: room.width,
                    height: room.height,
                    backgroundColor: config.color + "20",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedRoom(room.id)
                  }}
                  onMouseDown={(e) => startDragging(room.id, e)}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                    <DoorOpen className="w-6 h-6 mb-1" style={{ color: config.color }} />
                    <p className="text-xs font-bold" style={{ color: config.color }}>
                      {room.number}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              )
            })}

            {/* Empty State */}
            {currentFloorRooms.length === 0 && textLabels.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Home className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">Canvas vacío</p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Selecciona una herramienta de la izquierda y haz clic en el canvas para añadir habitaciones
                  </p>
                </div>
              </div>
            )}

            {/* Instruction Overlay */}
            {selectedTool && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
                {selectedTool === "room" &&
                  `Haz clic para añadir una habitación ${roomTypeConfig[selectedRoomType].label}`}
                {selectedTool === "text" && "Haz clic para añadir una etiqueta"}
                {selectedTool === "move" && "Haz clic y arrastra para mover habitaciones"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Room Dialog */}
      <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Habitación {editingRoom?.number}</DialogTitle>
            <DialogDescription>Modifica los detalles de la habitación</DialogDescription>
          </DialogHeader>
          {editingRoom && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="room-number">Número de Habitación</Label>
                <Input
                  id="room-number"
                  value={editingRoom.number}
                  onChange={(e) => setEditingRoom({ ...editingRoom, number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Tipo</Label>
                <Select
                  value={editingRoom.type}
                  onValueChange={(value) => setEditingRoom({ ...editingRoom, type: value as RoomType })}
                >
                  <SelectTrigger id="room-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roomTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-status">Estado</Label>
                <Select
                  value={editingRoom.status}
                  onValueChange={(value) => setEditingRoom({ ...editingRoom, status: value as Room["status"] })}
                >
                  <SelectTrigger id="room-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="occupied">Ocupada</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="cleaning">Limpieza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-notes">Notas</Label>
                <Input
                  id="room-notes"
                  placeholder="Añade notas sobre la habitación..."
                  value={editingRoom.notes}
                  onChange={(e) => setEditingRoom({ ...editingRoom, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRoom(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (editingRoom) {
                  setRooms(rooms.map((r) => (r.id === editingRoom.id ? editingRoom : r)))
                  setEditingRoom(null)
                }
              }}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

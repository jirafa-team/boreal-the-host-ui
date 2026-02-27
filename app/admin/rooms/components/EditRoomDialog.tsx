"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Room, RoomStatus } from "./types"
import type { TaxonomyRoomType } from "@/interfaces/taxonomy-room-type/TaxonomyRoomType"

type TFunction = (key: string) => string

export type EditRoomDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: Room | null
  roomTypes: Array<{ id: string; name: string }>
  onRoomChange: (updater: (prev: Room) => Room) => void
  onSave: () => void
  onDelete: () => void
  t: TFunction
}

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: "available", label: "Disponible" },
  { value: "occupied", label: "Ocupada" },
  { value: "reserved", label: "Reservada" },
  { value: "maintenance", label: "Mantenimiento" },
]

export function EditRoomDialog({ open, onOpenChange, room, roomTypes, onRoomChange, onSave, onDelete, t }: EditRoomDialogProps) {
  if (!room) return null

  const selectValue = room.roomTypeId ?? room.type
  const currentTypeNotInList = room.roomTypeId && !roomTypes.some((rt) => rt.id === room.roomTypeId)

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    const selected = roomTypes.find((rt) => rt.id === selectedId)
    onRoomChange((prev) => ({
      ...prev,
      roomTypeId: selectedId,
      type: selected?.name ?? prev.type,
    }))
  }

  const formatDateForInput = (date?: string | null) => {
    if (!date) return ""
    return date.split("T")[0]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Editar Habitación {room.number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Número de Habitación</label>
            <Input
              value={room.number}
              onChange={(e) => onRoomChange((prev) => ({ ...prev, number: e.target.value }))}
              placeholder="Ej: 101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
            <select
              value={selectValue}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currentTypeNotInList && (
                <option value={room.roomTypeId!}>{room.type ?? "Tipo actual"}</option>
              )}
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Piso</label>
            <Input
              type="number"
              value={room.floor}
              onChange={(e) => onRoomChange((prev) => ({ ...prev, floor: parseInt(e.target.value, 10) || 1 }))}
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
            <select
              value={room.status}
              onChange={(e) => onRoomChange((prev) => ({ ...prev, status: e.target.value as RoomStatus }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(room.status === "occupied" || room.status === "reserved") && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Huésped</label>
                <Input
                  value={room.guest ?? ""}
                  onChange={(e) => onRoomChange((prev) => ({ ...prev, guest: e.target.value }))}
                  placeholder="Nombre del huésped"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Check-in</label>
                  <Input
                    type="date"
                    value={formatDateForInput(room.checkIn)}
                    onChange={(e) =>
                      onRoomChange((prev) => ({
                        ...prev,
                        checkIn: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Check-out</label>
                  <Input
                    type="date"
                    value={formatDateForInput(room.checkOut)}
                    onChange={(e) =>
                      onRoomChange((prev) => ({
                        ...prev,
                        checkOut: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="destructive" onClick={onDelete}>
            Eliminar
          </Button>
          <div className="flex-1" />
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={onSave} className="bg-indigo-600 hover:bg-indigo-700">
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

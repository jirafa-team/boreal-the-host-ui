"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { NewRoomForm } from "./types"

type TFunction = (key: string) => string

const FLOORS = [1, 2, 3, 4, 5]
const ROOM_TYPES = [
  "Individual",
  "Doble",
  "Suite",
  "Familiar",
  "Deluxe",
  "Presidencial",
]

export type CreateRoomDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  newRoom: NewRoomForm
  onNewRoomChange: (updater: (prev: NewRoomForm) => NewRoomForm) => void
  onSubmit: () => void
  t: TFunction
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  newRoom,
  onNewRoomChange,
  onSubmit,
  t,
}: CreateRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {t("admin.createNewRoom")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.roomNumber")}
            </label>
            <Input
              type="text"
              placeholder="Ej: 105"
              value={newRoom.number}
              onChange={(e) =>
                onNewRoomChange((prev) => ({ ...prev, number: e.target.value }))
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.type")}
            </label>
            <select
              value={newRoom.type}
              onChange={(e) =>
                onNewRoomChange((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad (Personas)
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              value={newRoom.capacity}
              onChange={(e) =>
                onNewRoomChange((prev) => ({
                  ...prev,
                  capacity: Math.min(
                    10,
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  ),
                }))
              }
              placeholder="Cantidad de personas"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.floor")}
            </label>
            <select
              value={newRoom.floor}
              onChange={(e) =>
                onNewRoomChange((prev) => ({
                  ...prev,
                  floor: parseInt(e.target.value, 10),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {FLOORS.map((f) => (
                <option key={f} value={f}>
                  Piso {f}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            {t("admin.cancel")}
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t("admin.createRoom")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { NewRoomForm } from "./types"

type TFunction = (key: string) => string

export type CreateRoomDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  newRoom: NewRoomForm
  onNewRoomChange: (updater: (prev: NewRoomForm) => NewRoomForm) => void
  onSubmit: () => void
  t: TFunction
  roomTypes: Array<{ id: string; name: string }>
}

const FLOORS = [1, 2, 3, 4, 5]

export function CreateRoomDialog({ open, onOpenChange, newRoom, onNewRoomChange, onSubmit, t, roomTypes }: CreateRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">{t("admin.createNewRoom")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.roomNumber")}</label>
            <Input
              type="text"
              placeholder="Ej: 105"
              value={newRoom.number}
              onChange={(e) => onNewRoomChange((prev) => ({ ...prev, number: e.target.value }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.roomType")}</label>
            <select
              value={newRoom.roomTypeId}
              onChange={(e) => onNewRoomChange((prev) => ({ ...prev, roomTypeId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecciona un tipo</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.floor")}</label>
            <select
              value={newRoom.floor}
              onChange={(e) => onNewRoomChange((prev) => ({ ...prev, floor: parseInt(e.target.value, 10) }))}
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("admin.cancel")}
          </Button>
          <Button type="button" onClick={onSubmit} className="bg-indigo-600 hover:bg-indigo-700">
            {t("admin.createRoom")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

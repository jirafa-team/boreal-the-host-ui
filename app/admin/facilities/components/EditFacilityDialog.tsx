"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Facility } from "./types"

type TFunction = (key: string) => string

export type EditFacilityDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  facility: Facility | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  t: TFunction
}

export function EditFacilityDialog({ open, onOpenChange, facility, onSubmit, t }: EditFacilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.editFacility")}</DialogTitle>
          <DialogDescription>Actualiza los detalles del servicio o espacio</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nombre</Label>
            <Input id="edit-name" name="name" defaultValue={facility?.name} required />
          </div>
          <div>
            <Label htmlFor="edit-type">Tipo</Label>
            <Select name="type" defaultValue={facility?.type} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="recreation">Recreación</SelectItem>
                <SelectItem value="wellness">Bienestar</SelectItem>
                <SelectItem value="business">Negocios</SelectItem>
                <SelectItem value="dining">Gastronomía</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-capacity">{t("admin.capacity")}</Label>
            <Input id="edit-capacity" name="capacity" type="number" defaultValue={facility?.capacity} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startTime">{t("admin.openingTime")}</Label>
              <Input id="edit-startTime" name="startTime" type="time" defaultValue={facility?.startTime} required />
            </div>
            <div>
              <Label htmlFor="edit-endTime">{t("admin.closingTime")}</Label>
              <Input id="edit-endTime" name="endTime" type="time" defaultValue={facility?.endTime} required />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

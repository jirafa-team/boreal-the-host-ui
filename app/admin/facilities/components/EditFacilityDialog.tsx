"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Facility } from "./types"

type TFunction = (key: string) => string

const HARDCODED_TYPE_OPTIONS = [
  { value: "fitness", labelKey: "admin.fitness" },
  { value: "recreation", labelKey: "admin.recreation" },
  { value: "wellness", labelKey: "admin.wellness" },
  { value: "business", labelKey: "admin.business" },
  { value: "dining", labelKey: "admin.dining" },
] as const

export type EditFacilityDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  facility: Facility | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  t: TFunction
  facilityTypeOptions?: { id: string; name: string }[]
}

export function EditFacilityDialog({
  open,
  onOpenChange,
  facility,
  onSubmit,
  t,
  facilityTypeOptions,
}: EditFacilityDialogProps) {
  const options = facilityTypeOptions?.length
    ? facilityTypeOptions.map((ft) => ({ value: ft.id, label: ft.name }))
    : HARDCODED_TYPE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))
  const typeDefaultValue =
    facilityTypeOptions?.length && facility
      ? facility.facilityType?.id ?? facility.type
      : facility?.type ?? "fitness"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin.editFacility")}</DialogTitle>
          <DialogDescription>{t("admin.updateFacilityDetails")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">{t("admin.amenityName")}</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={facility?.name}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-type">{t("admin.amenityType")}</Label>
            <Select name="type" defaultValue={typeDefaultValue} required>
              <SelectTrigger>
                <SelectValue placeholder={t("admin.selectType")} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-capacity">{t("admin.capacity")}</Label>
            <Input
              id="edit-capacity"
              name="capacity"
              type="number"
              defaultValue={facility?.capacity}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startTime">{t("admin.openingTime")}</Label>
              <Input
                id="edit-startTime"
                name="startTime"
                type="time"
                defaultValue={facility?.startTime}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-endTime">{t("admin.closingTime")}</Label>
              <Input
                id="edit-endTime"
                name="endTime"
                type="time"
                defaultValue={facility?.endTime}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {t("common.continue")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

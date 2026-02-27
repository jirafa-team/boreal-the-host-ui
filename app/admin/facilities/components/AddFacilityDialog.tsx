"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaxonomyFacilityType } from "@/interfaces/taxonomy-facility-type/TaxonomyFacilityType"
import { Plus } from "lucide-react"

type TFunction = (key: string) => string

export type AddFacilityDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  facilitiesTypes: TaxonomyFacilityType[]
  t: TFunction
  trigger?: React.ReactNode
}

export function AddFacilityDialog({ open, onOpenChange, onSubmit, facilitiesTypes, t, trigger }: AddFacilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger != null ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : null}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("admin.addNewAmenity")}</DialogTitle>
          <DialogDescription>{t("admin.configureNewAmenity")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">{t("admin.amenityName")}</Label>
            <Input id="name" name="name" placeholder="ej: Gimnasio Premium" className="h-10 px-3" required />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("admin.amenityType")}</Label>
            <Select name="type" required>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t("admin.selectType")} />
              </SelectTrigger>
              <SelectContent>
                {facilitiesTypes ? (
                  <>
                    {facilitiesTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <SelectItem value="">{t("admin.noTypesAvailable")}</SelectItem>
                )}

              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">{t("admin.maxCapacity")}</Label>
            <Input id="capacity" name="capacity" type="number" placeholder="ej: 20" className="h-10 px-3" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium">{t("admin.openingTime")}</Label>
              <Input id="startTime" name="startTime" type="time" className="h-10 px-3" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">{t("admin.closingTime")}</Label>
              <Input id="endTime" name="endTime" type="time" className="h-10 px-3" required />
            </div>
          </div>
          <Button type="submit" className="w-full h-10 font-medium">
            {t("admin.addAmenity")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

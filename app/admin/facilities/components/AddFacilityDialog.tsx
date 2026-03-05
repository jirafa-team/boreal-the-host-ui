"use client"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TFunction = (key: string) => string

export type AddFacilityDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  t: TFunction
}

export function AddFacilityDialog({ onSubmit, t }: AddFacilityDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl">{t("admin.addNewAmenity")}</DialogTitle>
        <DialogDescription>{t("admin.configureNewAmenity")}</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          onSubmit(e)
          ;(e.target as HTMLFormElement).reset()
        }}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {t("admin.amenityName")}
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="ej: Gimnasio Premium"
            className="h-10 px-3"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("admin.amenityType")}</Label>
          <Select name="type" required>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t("admin.selectType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fitness">{t("admin.fitness")}</SelectItem>
              <SelectItem value="recreation">{t("admin.recreation")}</SelectItem>
              <SelectItem value="wellness">{t("admin.wellness")}</SelectItem>
              <SelectItem value="business">{t("admin.business")}</SelectItem>
              <SelectItem value="dining">{t("admin.dining")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity" className="text-sm font-medium">
            {t("admin.maxCapacity")}
          </Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            placeholder="ej: 20"
            className="h-10 px-3"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-sm font-medium">
              {t("admin.openingTime")}
            </Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              className="h-10 px-3"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime" className="text-sm font-medium">
              {t("admin.closingTime")}
            </Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              className="h-10 px-3"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-10 font-medium">
          {t("admin.addAmenity")}
        </Button>
      </form>
    </DialogContent>
  )
}

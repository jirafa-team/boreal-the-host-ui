"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User, NewUserForm } from "./types"

type TFunction = (key: string) => string

export type UserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser: User | null
  formData: NewUserForm
  setFormData: (data: NewUserForm | ((prev: NewUserForm) => NewUserForm)) => void
  onSave: () => void
  t: TFunction
  roles?: Array<{ id: string; name: string }>
}

const defaultPermissions = {
  canManageRooms: false,
  canManageClients: false,
  canManageEvents: false,
  canManageFacilities: false,
  canViewReports: false,
  canManageUsers: false,
}

export function UserDialog({
  open,
  onOpenChange,
  editingUser,
  formData,
  setFormData,
  onSave,
  t,
  roles,
}: UserDialogProps) {
  const permissions = formData.permissions ?? defaultPermissions
  const useRoleIdSelect = roles != null && roles.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingUser ? t("admin.editUser") : t("admin.newUser")}</DialogTitle>
          <DialogDescription>
            {editingUser ? t("admin.editUserInfo") : t("admin.completeNewUserData")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("admin.firstName")}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName ?? ""}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder={t("admin.firstNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("admin.lastName")}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName ?? ""}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder={t("admin.lastNamePlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("admin.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email ?? ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t("admin.emailPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("admin.phone")}</Label>
                <Input
                  id="phone"
                  value={formData.phone ?? ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t("admin.phonePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("admin.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={editingUser ? t("admin.keepPasswordEmpty") : t("admin.passwordPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">{t("admin.role")}</Label>
                {useRoleIdSelect ? (
                  <Select
                    key={editingUser?.id ?? "new"}
                    value={formData.roleId && roles.some((r) => r.id === formData.roleId) ? formData.roleId : ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roleId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("admin.filterRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={formData.role ?? "staff"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value as User["role"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("admin.admin")}</SelectItem>
                      <SelectItem value="staff">{t("admin.staff")}</SelectItem>
                      <SelectItem value="viewer">{t("admin.viewer")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t("admin.status")}</Label>
                <Select
                  value={formData.status ?? "active"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as User["status"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("admin.active")}</SelectItem>
                    <SelectItem value="inactive">{t("admin.inactive")}</SelectItem>
                    <SelectItem value="pending">{t("admin.pending")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{t("admin.permissions")}</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              {(
                [
                  "canManageRooms",
                  "canManageClients",
                  "canManageEvents",
                  "canManageFacilities",
                  "canViewReports",
                  "canManageUsers",
                ] as const
              ).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="cursor-pointer">
                    {t(`admin.${key}`)}
                  </Label>
                  <Switch
                    id={key}
                    checked={permissions[key]}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...permissions, [key]: checked },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
            {t("admin.cancel")}
          </Button>
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            {t("admin.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

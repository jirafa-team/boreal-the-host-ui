"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserTable } from "./UserTable"
import { UserDialog } from "./UserDialog"
import type { User, NewUserForm } from "./types"

type TFunction = (key: string) => string

export type UsersViewProps = {
  filteredUsers: User[]
  searchTerm: string
  onSearchTermChange: (value: string) => void
  roleFilter: string
  onRoleFilterChange: (value: string) => void
  onAddUser: () => void
  onEditUser: (user: User) => void
  onDeleteUser: (id: string) => void
  getRoleBadge: (role: User["role"]) => React.ReactNode
  getStatusBadge: (status: User["status"]) => React.ReactNode
  getInitials: (name: string) => string
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  editingUser: User | null
  formData: NewUserForm
  setFormData: (data: NewUserForm | ((prev: NewUserForm) => NewUserForm)) => void
  onSave: () => void
  t: TFunction
  roles?: Array<{ id: string; name: string }>
  isLoading?: boolean
  error?: unknown
}

export function UsersView({
  filteredUsers,
  searchTerm,
  onSearchTermChange,
  roleFilter,
  onRoleFilterChange,
  onAddUser,
  onEditUser,
  onDeleteUser,
  getRoleBadge,
  getStatusBadge,
  getInitials,
  isDialogOpen,
  setIsDialogOpen,
  editingUser,
  formData,
  setFormData,
  onSave,
  t,
  roles,
  isLoading,
  error,
}: UsersViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("admin.usersManagement")}</h1>
            <p className="text-gray-600 mt-1">
              {filteredUsers.length} {filteredUsers.length === 1 ? t("admin.user") : t("admin.users")}
            </p>
          </div>
          <Button onClick={onAddUser} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            {t("admin.addUser")}
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={t("admin.searchUsers")}
                  value={searchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500"
                />
              </div>
              <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                <SelectTrigger className="w-full md:w-64 h-12 border-gray-200">
                  <SelectValue placeholder={t("admin.filterRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.allRoles")}</SelectItem>
                  {roles ? roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  )
                  ) : (
                    <>
                      <SelectItem value="all">{t("admin.allRoles")}</SelectItem>
                      <SelectItem value="admin">{t("admin.admin")}</SelectItem>
                      <SelectItem value="staff">{t("admin.staff")}</SelectItem>
                      <SelectItem value="viewer">{t("admin.viewer")}</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {isLoading && (
              <p className="text-gray-500 py-4">{String(t("admin.loading") ?? "Cargando...")}</p>
            )}
            {error ? (
              <p className="text-red-600 py-4">
                {String(t("admin.errorLoadingUsers") ?? "Error al cargar usuarios.")}
              </p>
            ) : null}
            {!isLoading && !error && (
              <UserTable
                users={filteredUsers}
                onEdit={onEditUser}
                onDelete={onDeleteUser}
                getRoleBadge={getRoleBadge}
                getStatusBadge={getStatusBadge}
                getInitials={getInitials}
                t={t}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        onSave={onSave}
        t={t}
        roles={roles}
      />
    </div>
  )
}

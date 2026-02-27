"use client"

import { useCallback, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/app/admin/users/slice/userSlice"
import { useGetRolesQuery } from "@/features/role/slices/roleSlice"
import { useLanguage } from "@/lib/i18n-context"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { UserCog, Shield, Eye } from "lucide-react"
import { UsersView } from "../components/UsersView"
import type { User, NewUserForm } from "../components/types"
import { mapApiUserToUi } from "../components/types"

const initialFormData: NewUserForm = {
  firstName: "",
  lastName: "",
  name: "",
  email: "",
  role: "Staff",
  roleId: "",
  status: "active",
  phone: "",
  permissions: {
    canManageRooms: false,
    canManageClients: false,
    canManageEvents: false,
    canManageFacilities: false,
    canViewReports: false,
    canManageUsers: false,
  },
}

export function UsersApiContainer() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const skip = dataSource !== "api"

  const { data: apiData, isLoading, error } = useGetUsersQuery(undefined, { skip })
  const { data: rolesData } = useGetRolesQuery(undefined, { skip })

  const [createUser] = useCreateUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  const rolesList = rolesData?.data?.objects ?? []

  const users: User[] = useMemo(() => {
    const raw = apiData?.data?.objects ?? []
    return raw.map(mapApiUserToUi)
  }, [apiData?.data?.objects])

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<NewUserForm>(initialFormData)

  const filteredUsers = useMemo(() => {
    const selectedRoleName =
      roleFilter === "all"
        ? null
        : rolesList.find((r) => r.id === roleFilter)?.name?.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole =
        roleFilter === "all" ||
        (!!selectedRoleName &&
          (user.roleName ?? user.role ?? "").trim().toLowerCase() === selectedRoleName)

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter, rolesList])

  const getRoleBadge = useCallback(
    (role: User["role"]) => {
      switch (role) {
        case "Hotel Administrator":
          return (
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
              <Shield className="w-3 h-3 mr-1" />
              {t("admin.admin")}
            </Badge>
          )
        case "Staff":
          return (
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <UserCog className="w-3 h-3 mr-1" />
              {t("admin.staff")}
            </Badge>
          )
        case "Viewer":
          return (
            <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
              <Eye className="w-3 h-3 mr-1" />
              {t("admin.viewer")}
            </Badge>
          )
      }
    },
    [t]
  )

  const getStatusBadge = useCallback(
    (status: User["status"]) => {
      if (status === "active") {
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            {t("admin.active")}
          </Badge>
        )
      }
      if (status === "pending") {
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            {t("admin.pending")}
          </Badge>
        )
      }
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
          {t("admin.inactive")}
        </Badge>
      )
    },
    [t]
  )

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [])

  const handleAddUser = useCallback(() => {
    setEditingUser(null)
    setFormData(initialFormData)
    setIsDialogOpen(true)
  }, [])

  const handleEditUser = useCallback(
    (user: User) => {
      const roleNameToMatch = (user.roleName ?? user.role ?? "").trim().toLowerCase()
      const roleId =
        rolesList.find((r) => r.name.trim().toLowerCase() === roleNameToMatch)?.id ?? ""
      const parts = (user.name ?? "").trim().split(/\s+/)
      const firstName = parts[0] ?? ""
      const lastName = parts.slice(1).join(" ") ?? ""
      setEditingUser(user)
      setFormData({ ...user, roleId, firstName, lastName })
      setIsDialogOpen(true)
    },
    [rolesList]
  )

  const handleSave = useCallback(async () => {
    try {
      if (editingUser) {
        const basePayload: Record<string, unknown> = {
          name: formData.name,
          email: formData.email,
          status: formData.status,
          phone: formData.phone,
          permissions: formData.permissions,
        }
        const payload = {
          ...basePayload,
          ...(formData.roleId ? { roleIds: [formData.roleId] } : {}),
        }
        await updateUser({ id: editingUser.id, payload }).unwrap()
        toast({ title: "Éxito", description: t("admin.userUpdated") ?? "Usuario actualizado correctamente." })
      } else {
        const roleName = rolesList.find((r) => r.id === formData.roleId)?.name
        if (
          !formData.firstName?.trim() ||
          !formData.lastName?.trim() ||
          !formData.email?.trim() ||
          !roleName
        ) {
          toast({
            title: "Error",
            description: t("admin.errorSavingUser") ?? "Completa nombre, apellido, email y rol.",
            variant: "destructive",
          })
          return
        }
        await createUser({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          roleName,
        }).unwrap()
        toast({ title: "Éxito", description: t("admin.userCreated") ?? "Usuario creado correctamente." })
      }
      setIsDialogOpen(false)
      setEditingUser(null)
      setFormData(initialFormData)
    } catch {
      toast({
        title: "Error",
        description: t("admin.errorSavingUser") ?? "No se pudo guardar el usuario.",
        variant: "destructive",
      })
    }
  }, [editingUser, formData, rolesList, updateUser, createUser, toast, t])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm(t("admin.confirmDelete"))) return
      try {
        await deleteUser(id).unwrap()
        toast({ title: "Éxito", description: t("admin.userDeleted") ?? "Usuario eliminado correctamente." })
      } catch {
        toast({
          title: "Error",
          description: t("admin.errorDeletingUser") ?? "No se pudo eliminar el usuario.",
          variant: "destructive",
        })
      }
    },
    [deleteUser, toast, t]
  )

  return (
    <UsersView
      filteredUsers={filteredUsers}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      roleFilter={roleFilter}
      onRoleFilterChange={setRoleFilter}
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDelete}
      getRoleBadge={getRoleBadge}
      getStatusBadge={getStatusBadge}
      getInitials={getInitials}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      editingUser={editingUser}
      formData={formData}
      setFormData={setFormData}
      onSave={handleSave}
      t={t}
      roles={rolesList}
      isLoading={isLoading}
      error={error}
    />
  )
}

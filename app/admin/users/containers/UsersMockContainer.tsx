"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { loadMockUsers, setUsers } from "@/app/admin/users/slice/userSlice"
import type { User as ApiUser } from "@/interfaces/user/User"
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

function userToApiPayload(u: User): ApiUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    lastLogin: u.lastLogin,
    phone: u.phone,
    permissions: u.permissions as Record<string, boolean>,
  }
}

export function UsersMockContainer() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const usersFromSlice = useSelector((state: RootState) => state.user.users)

  useEffect(() => {
    if (dataSource === "mock") dispatch(loadMockUsers())
  }, [dataSource, dispatch])

  const users: User[] = useMemo(
    () => usersFromSlice.map(mapApiUserToUi),
    [usersFromSlice]
  )

  const setUsersForMock = useCallback(
    (next: User[] | ((prev: User[]) => User[])) => {
      if (dataSource !== "mock") return
      const list = typeof next === "function" ? next(users) : next
      dispatch(setUsers(list.map(userToApiPayload)))
    },
    [dataSource, users, dispatch]
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<NewUserForm>(initialFormData)

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

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

  const handleEditUser = useCallback((user: User) => {
    const parts = (user.name ?? "").trim().split(/\s+/)
    const firstName = parts[0] ?? ""
    const lastName = parts.slice(1).join(" ") ?? ""
    setEditingUser(user)
    setFormData({ ...user, firstName, lastName })
    setIsDialogOpen(true)
  }, [])

  const handleSave = useCallback(() => {
    if (editingUser) {
      setUsersForMock(
        users.map((u) => (u.id === editingUser.id ? { ...editingUser, ...formData } : u))
      )
    } else {
      const name =
        [formData.firstName, formData.lastName].filter(Boolean).join(" ") ||
        (formData.name ?? "")
      const newUser: User = {
        id: String(users.length + 1),
        name,
        email: formData.email ?? "",
        role: (formData.role ?? "Staff") as User["role"],
        status: formData.status ?? "active",
        lastLogin: new Date().toISOString(),
        phone: formData.phone,
        permissions: formData.permissions ?? initialFormData.permissions!,
      }
      setUsersForMock([...users, newUser])
    }
    setIsDialogOpen(false)
    toast({ title: "Éxito", description: "Usuario guardado correctamente." })
  }, [editingUser, formData, users, setUsersForMock, t, toast])

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm(t("admin.confirmDelete"))) return
      setUsersForMock(users.filter((u) => u.id !== id))
      toast({ title: "Éxito", description: t("admin.userDeleted") ?? "Usuario eliminado correctamente." })
    },
    [users, setUsersForMock, t, toast]
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
    />
  )
}

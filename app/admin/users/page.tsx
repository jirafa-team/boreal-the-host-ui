"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, UserCog, Shield, Eye, Clock } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { useSearchParams } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
  phone?: string
  avatar?: string
  permissions: {
    canManageRooms: boolean
    canManageClients: boolean
    canManageEvents: boolean
    canManageFacilities: boolean
    canViewReports: boolean
    canManageUsers: boolean
  }
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Carlos García",
    email: "carlos@hotel.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15 10:30",
    phone: "+34 600 123 456",
    permissions: {
      canManageRooms: true,
      canManageClients: true,
      canManageEvents: true,
      canManageFacilities: true,
      canViewReports: true,
      canManageUsers: true,
    },
  },
  {
    id: "2",
    name: "María López",
    email: "maria@hotel.com",
    role: "staff",
    status: "active",
    lastLogin: "2024-01-15 09:15",
    phone: "+34 600 234 567",
    permissions: {
      canManageRooms: true,
      canManageClients: true,
      canManageEvents: false,
      canManageFacilities: true,
      canViewReports: true,
      canManageUsers: false,
    },
  },
  {
    id: "3",
    name: "Juan Rodríguez",
    email: "juan@hotel.com",
    role: "staff",
    status: "active",
    lastLogin: "2024-01-14 18:45",
    phone: "+34 600 345 678",
    permissions: {
      canManageRooms: false,
      canManageClients: true,
      canManageEvents: true,
      canManageFacilities: false,
      canViewReports: true,
      canManageUsers: false,
    },
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@hotel.com",
    role: "viewer",
    status: "active",
    lastLogin: "2024-01-15 08:00",
    permissions: {
      canManageRooms: false,
      canManageClients: false,
      canManageEvents: false,
      canManageFacilities: false,
      canViewReports: true,
      canManageUsers: false,
    },
  },
  {
    id: "5",
    name: "Pedro Sánchez",
    email: "pedro@hotel.com",
    role: "staff",
    status: "inactive",
    lastLogin: "2024-01-10 15:20",
    phone: "+34 600 456 789",
    permissions: {
      canManageRooms: true,
      canManageClients: false,
      canManageEvents: false,
      canManageFacilities: true,
      canViewReports: false,
      canManageUsers: false,
    },
  },
]

export default function UsersPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "staff",
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
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Shield className="w-3 h-3 mr-1" />
            {t("admin.admin")}
          </Badge>
        )
      case "staff":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <UserCog className="w-3 h-3 mr-1" />
            {t("admin.staff")}
          </Badge>
        )
      case "viewer":
        return (
          <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
            <Eye className="w-3 h-3 mr-1" />
            {t("admin.viewer")}
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: User["status"]) => {
    if (status === "active") {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{t("admin.active")}</Badge>
    }
    return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">{t("admin.inactive")}</Badge>
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData(user)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      role: "staff",
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
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...editingUser, ...formData } : u)))
    } else {
      const newUser: User = {
        id: String(users.length + 1),
        ...formData,
        lastLogin: new Date().toISOString(),
      } as User
      setUsers([...users, newUser])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm(t("admin.confirmDelete"))) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("admin.usersManagement")}</h1>
            <p className="text-gray-600 mt-1">
              {filteredUsers.length} {filteredUsers.length === 1 ? t("admin.user") : t("admin.users")}
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            {t("admin.addUser")}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={t("admin.searchUsers")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-64 h-12 border-gray-200">
                  <SelectValue placeholder={t("admin.filterRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.allRoles")}</SelectItem>
                  <SelectItem value="admin">{t("admin.admin")}</SelectItem>
                  <SelectItem value="staff">{t("admin.staff")}</SelectItem>
                  <SelectItem value="viewer">{t("admin.viewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">{t("admin.name")}</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">{t("admin.email")}</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">{t("admin.role")}</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">{t("admin.status")}</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">{t("admin.lastLogin")}</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-700">{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {user.lastLogin}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? t("admin.editUser") : t("admin.newUser")}</DialogTitle>
            <DialogDescription>
              {editingUser ? t("admin.editUserInfo") : t("admin.completeNewUserData")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("admin.fullName")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("admin.fullNamePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("admin.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
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
                    value={formData.phone}
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
                  <Select
                    value={formData.role}
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t("admin.status")}</Label>
                  <Select
                    value={formData.status}
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">{t("admin.permissions")}</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageRooms" className="cursor-pointer">
                    {t("admin.canManageRooms")}
                  </Label>
                  <Switch
                    id="canManageRooms"
                    checked={formData.permissions?.canManageRooms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions!, canManageRooms: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageClients" className="cursor-pointer">
                    {t("admin.canManageClients")}
                  </Label>
                  <Switch
                    id="canManageClients"
                    checked={formData.permissions?.canManageClients}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions!, canManageClients: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageEvents" className="cursor-pointer">
                    {t("admin.canManageEvents")}
                  </Label>
                  <Switch
                    id="canManageEvents"
                    checked={formData.permissions?.canManageEvents}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions!, canManageEvents: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageFacilities" className="cursor-pointer">
                    {t("admin.canManageFacilities")}
                  </Label>
                  <Switch
                    id="canManageFacilities"
                    checked={formData.permissions?.canManageFacilities}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions!, canManageFacilities: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canViewReports" className="cursor-pointer">
                    {t("admin.canViewReports")}
                  </Label>
                  <Switch
                    id="canViewReports"
                    checked={formData.permissions?.canViewReports}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions!, canViewReports: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageUsers" className="cursor-pointer">
                    {t("admin.canManageUsers")}
                  </Label>
                  <Switch
                    id="canManageUsers"
                    checked={formData.permissions?.canManageUsers}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions!, canManageUsers: checked },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

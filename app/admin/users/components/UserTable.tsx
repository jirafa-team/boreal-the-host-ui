"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Clock } from "lucide-react"
import type { User } from "./types"

type TFunction = (key: string) => string

export type UserTableProps = {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
  getRoleBadge: (role: User["role"]) => React.ReactNode
  getStatusBadge: (status: User["status"]) => React.ReactNode
  getInitials: (name: string) => string
  t: TFunction
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  getRoleBadge,
  getStatusBadge,
  getInitials,
  t,
}: UserTableProps) {
  return (
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
          {users.map((user) => (
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
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user.id)}
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
  )
}

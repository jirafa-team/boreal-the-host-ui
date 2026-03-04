"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, CheckSquare, Grid, LayoutGrid } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n-context"

type StaffMember = {
  id: number
  name: string
  status: "available" | "busy" | "off"
  department: "Limpieza" | "Mantenimiento" | "Seguridad" | "Recepción" | "Servicio"
  shift: string
  avatar: string
  tasksToday: number
  maxCapacity: number
}

export default function StaffManagement() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "María González",
      status: "busy",
      department: "Limpieza",
      shift: "7:00 AM - 3:00 PM",
      avatar: "MG",
      tasksToday: 5,
      maxCapacity: 8,
    },
    {
      id: 2,
      name: "Roberto Fernández",
      status: "available",
      department: "Mantenimiento",
      shift: "7:00 AM - 3:00 PM",
      avatar: "RF",
      tasksToday: 3,
      maxCapacity: 8,
    },
    {
      id: 3,
      name: "Carmen Silva",
      status: "busy",
      department: "Limpieza",
      shift: "11:00 AM - 7:00 PM",
      avatar: "CS",
      tasksToday: 6,
      maxCapacity: 8,
    },
  ])

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [searchName, setSearchName] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showAssignTaskDialog, setShowAssignTaskDialog] = useState(false)
  const [showMaintenanceActivityDialog, setShowMaintenanceActivityDialog] = useState(false)
  const [newTask, setNewTask] = useState({
    description: "",
    priority: "normal",
    deliveryTime: "1",
  })
  const [newMaintenanceActivity, setNewMaintenanceActivity] = useState({
    description: "",
    priority: "normal",
    deliveryTime: "1",
    assignedStaff: "",
    scheduledDate: "",
    scheduledTime: "",
  })
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    department: "Limpieza" as const,
    shift: "morning",
  })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "off":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return t("admin.available")
      case "busy":
        return t("admin.busy")
      case "off":
        return t("admin.off")
      default:
        return status
    }
  }

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email) {
      const initials = newStaff.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

      const newMember: StaffMember = {
        id: Math.max(...staff.map((s) => s.id), 0) + 1,
        name: newStaff.name,
        status: "available",
        department: newStaff.department,
        shift: newStaff.shift === "morning" ? "7:00 AM - 3:00 PM" : "11:00 AM - 7:00 PM",
        avatar: initials,
        tasksToday: 0,
        maxCapacity: 8,
      }

      setStaff([...staff, newMember])
      setShowAddDialog(false)
      setNewStaff({
        name: "",
        email: "",
        department: "Limpieza",
        shift: "morning",
      })
    }
  }

  const handleAssignTask = () => {
    if (selectedStaff && newTask.description) {
      console.log("[v0] Tarea asignada a:", selectedStaff.name, newTask)
      // Update staff member's task count
      setStaff(
        staff.map((member) =>
          member.id === selectedStaff.id
            ? { ...member, tasksToday: Math.min(member.tasksToday + 1, member.maxCapacity) }
            : member
        )
      )
      setSelectedStaff({
        ...selectedStaff,
        tasksToday: Math.min(selectedStaff.tasksToday + 1, selectedStaff.maxCapacity),
      })
      setShowAssignTaskDialog(false)
      setNewTask({
        description: "",
        priority: "normal",
        deliveryTime: "1",
      })
    }
  }

  const handleCreateMaintenanceActivity = () => {
    if (newMaintenanceActivity.description && newMaintenanceActivity.assignedStaff) {
      console.log("[v0] Actividad de mantenimiento creada:", newMaintenanceActivity)
      setShowMaintenanceActivityDialog(false)
      setNewMaintenanceActivity({
        description: "",
        priority: "normal",
        deliveryTime: "1",
        assignedStaff: "",
        scheduledDate: "",
        scheduledTime: "",
      })
    }
  }

  if (!isLoaded) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("admin.staffTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("admin.manageYour")} {t("admin.staffMembers")}</p>
          </div>
          <div className="inline-flex h-10 items-center rounded-lg bg-gray-100 p-1 border border-gray-200">
            <button
              onClick={() => setViewMode("list")}
              className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                viewMode === "list"
                  ? "text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              style={viewMode === "list" ? { backgroundColor: "#394a63" } : {}}
            >
              {t("admin.day") || "Lista"}
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                viewMode === "kanban"
                  ? "text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              style={viewMode === "kanban" ? { backgroundColor: "#394a63" } : {}}
            >
              {t("admin.kanban")}
            </button>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <div className="flex gap-3">
              {viewMode === "list" && (
              <DialogTrigger asChild>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                  style={{ backgroundColor: "#1557F6" }}
                  title={t("admin.addStaff")}
                >
                  <Plus className="w-5 h-5" />
                  <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {t("admin.addStaff")}
                  </span>
                </button>
              </DialogTrigger>
              )}
              {viewMode === "kanban" && (
              <button
                onClick={() => setShowMaintenanceActivityDialog(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group relative"
                style={{ backgroundColor: "#1557F6" }}
                title={t("admin.createActivity")}
              >
                <CheckSquare className="w-5 h-5" />
                <span className="absolute top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {t("admin.createActivity")}
                </span>
              </button>
              )}
            </div>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t("admin.newUser")}</DialogTitle>
                <DialogDescription>{t("admin.registerNewTeamMember")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">{t("admin.fullName")}</Label>
                  <Input
                    id="name"
                    placeholder={t("admin.exampleFullName")}
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    placeholder={t("admin.exampleEmail")}
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-sm font-medium">{t("admin.department")}</Label>
                  <Select value={newStaff.department} onValueChange={(value) => setNewStaff({ ...newStaff, department: value as any })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Limpieza">{t("admin.cleaning")}</SelectItem>
                      <SelectItem value="Mantenimiento">{t("admin.maintenance")}</SelectItem>
                      <SelectItem value="Seguridad">{t("admin.security")}</SelectItem>
                      <SelectItem value="Recepción">{t("admin.reception")}</SelectItem>
                      <SelectItem value="Servicio">{t("admin.service")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shift" className="text-sm font-medium">{t("admin.shift")}</Label>
                  <Select value={newStaff.shift} onValueChange={(value) => setNewStaff({ ...newStaff, shift: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">{t("admin.morning")}</SelectItem>
                      <SelectItem value="afternoon">{t("admin.afternoon")}</SelectItem>
                      <SelectItem value="evening">{t("admin.evening")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {t("admin.cancel")}
                </Button>
                <Button onClick={handleAddStaff} className="bg-blue-600 hover:bg-blue-700">
                  {t("admin.registerStaff")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="space-y-6">
          {/* Search */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium">{t("admin.searchByName")}</Label>
              <Input
                id="search"
                placeholder={t("admin.searchUsers")}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* List View */}
          {viewMode === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staff.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">{t("admin.selectFeature")}</p>
              </div>
            ) : (
              staff
                .filter((member) => member.name.toLowerCase().includes(searchName.toLowerCase()))
                .map((member) => (
                  <Card
                    key={member.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedStaff(member)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-md mb-3">
                        {member.avatar}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                      <p className="text-xs text-muted-foreground">{member.department}</p>
                      <p className="text-xs text-muted-foreground mt-1">{member.shift}</p>
                      <Badge className={`${getStatusColor(member.status)} text-white mt-3`}>
                        {getStatusText(member.status)}
                      </Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("admin.tasksToday")}</span>
                        <span className="font-semibold text-foreground">
                          {member.tasksToday} / {member.maxCapacity}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${(member.tasksToday / member.maxCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
          )}

          {/* Kanban View */}
          {viewMode === "kanban" && (
          <div className="space-y-4">
            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-4">
              {["available", "busy", "off"].map((status) => (
                <div key={status} className="bg-muted/50 rounded-lg p-4 min-w-sm">
                  <h3 className="font-semibold text-foreground mb-4 capitalize">
                    {status === "available" ? t("admin.statusAvailable") : 
                     status === "busy" ? t("admin.statusBusy") : 
                     t("admin.statusOff")}
                  </h3>
                  <div className="space-y-3">
                    {staff
                      .filter((member) => 
                        member.status === status &&
                        member.name.toLowerCase().includes(searchName.toLowerCase())
                      )
                      .map((member) => (
                        <Card
                          key={member.id}
                          className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedStaff(member)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {member.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-foreground truncate">{member.name}</h4>
                              <p className="text-xs text-muted-foreground">{member.department}</p>
                              <div className="mt-2 flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{t("admin.tasksToday")}</span>
                                <span className="font-semibold">{member.tasksToday}/{member.maxCapacity}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                                <div
                                  className="bg-primary rounded-full h-1.5 transition-all"
                                  style={{ width: `${(member.tasksToday / member.maxCapacity) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Staff Detail Dialog */}
      {selectedStaff && (
        <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("admin.staffDetails")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedStaff.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedStaff.name}</h3>
                  <Badge className={`${getStatusColor(selectedStaff.status)} text-white mt-1`}>
                    {getStatusText(selectedStaff.status)}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("admin.department")}</span>
                  <span className="font-medium text-foreground">{selectedStaff.department}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{t("admin.shift")}</span>
                  <span className="font-medium text-foreground">{selectedStaff.shift}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">{t("admin.tasksToday")}</span>
                  <span className="font-medium text-foreground">{selectedStaff.tasksToday}</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowAssignTaskDialog(true)} 
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                {t("admin.createActivity")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Task Dialog */}
      {selectedStaff && (
        <Dialog open={showAssignTaskDialog} onOpenChange={setShowAssignTaskDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("admin.createActivity")}</DialogTitle>
              <DialogDescription>
                {t("admin.assignActivityToStaff")}: <span className="font-semibold">{selectedStaff.name}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  {t("admin.activityDescription")}
                </Label>
                <Input
                  id="description"
                  placeholder={t("admin.exampleActivityDescription")}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="text-sm font-medium">
                  {t("admin.priority")}
                </Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">{t("admin.normal")}</SelectItem>
                    <SelectItem value="urgent">{t("admin.urgent")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deliveryTime" className="text-sm font-medium">
                  {t("admin.deliveryTime")} (horas)
                </Label>
                <Input
                  id="deliveryTime"
                  type="number"
                  min="1"
                  max="24"
                  value={newTask.deliveryTime}
                  onChange={(e) => setNewTask({ ...newTask, deliveryTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAssignTaskDialog(false)}>
                {t("admin.cancel")}
              </Button>
              <Button onClick={handleAssignTask} className="bg-amber-600 hover:bg-amber-700">
                {t("admin.create")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Maintenance Activity Dialog */}
      <Dialog open={showMaintenanceActivityDialog} onOpenChange={setShowMaintenanceActivityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.createActivity")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="maintenance-description" className="text-sm font-medium">
                {t("admin.activityDescription")}
              </Label>
              <Input
                id="maintenance-description"
                placeholder={t("admin.exampleActivityDescription")}
                value={newMaintenanceActivity.description}
                onChange={(e) => setNewMaintenanceActivity({ ...newMaintenanceActivity, description: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="maintenance-priority" className="text-sm font-medium">
                {t("admin.priority")}
              </Label>
              <Select value={newMaintenanceActivity.priority} onValueChange={(value) => setNewMaintenanceActivity({ ...newMaintenanceActivity, priority: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">{t("admin.normal")}</SelectItem>
                  <SelectItem value="urgent">{t("admin.urgent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maintenance-time" className="text-sm font-medium">
                {t("admin.deliveryTime")} (horas)
              </Label>
              <Input
                id="maintenance-time"
                type="number"
                min="1"
                max="24"
                value={newMaintenanceActivity.deliveryTime}
                onChange={(e) => setNewMaintenanceActivity({ ...newMaintenanceActivity, deliveryTime: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="assign-staff" className="text-sm font-medium">
                {t("admin.assignTo")}
              </Label>
              <Select value={newMaintenanceActivity.assignedStaff} onValueChange={(value) => setNewMaintenanceActivity({ ...newMaintenanceActivity, assignedStaff: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("admin.selectStaff")} />
                </SelectTrigger>
                <SelectContent>
                  {staff
                    .filter((member) => member.department === "Mantenimiento")
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="scheduled-date" className="text-sm font-medium">
                  Fecha Programada
                </Label>
                <Input
                  id="scheduled-date"
                  type="date"
                  value={newMaintenanceActivity.scheduledDate}
                  onChange={(e) => setNewMaintenanceActivity({ ...newMaintenanceActivity, scheduledDate: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="scheduled-time" className="text-sm font-medium">
                  Hora Programada
                </Label>
                <Input
                  id="scheduled-time"
                  type="time"
                  value={newMaintenanceActivity.scheduledTime}
                  onChange={(e) => setNewMaintenanceActivity({ ...newMaintenanceActivity, scheduledTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowMaintenanceActivityDialog(false)}>
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleCreateMaintenanceActivity} className="bg-amber-600 hover:bg-amber-700">
              {t("admin.create")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bell, Lock, Palette, Globe, Database, Shield, Mail, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/i18n-context'
import { useState } from 'react'

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const [settings, setSettings] = useState({
    systemName: 'Sistema de Hospedaje',
    timezone: 'UTC-5',
    theme: 'light',
    notifications: true,
    emailAlerts: true,
    maintenanceMode: false,
    dataBackup: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Settings saved:', settings)
  }

  const settingsSections = [
    {
      title: 'Sistema',
      icon: Database,
      settings: [
        {
          label: 'Nombre del Sistema',
          key: 'systemName',
          type: 'input',
          value: settings.systemName,
        },
        {
          label: 'Zona Horaria',
          key: 'timezone',
          type: 'select',
          value: settings.timezone,
          options: ['UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC', 'UTC+1', 'UTC+2'],
        },
      ],
    },
    {
      title: 'Interfaz',
      icon: Palette,
      settings: [
        {
          label: 'Tema',
          key: 'theme',
          type: 'select',
          value: settings.theme,
          options: ['light', 'dark', 'auto'],
        },
      ],
    },
    {
      title: 'Notificaciones',
      icon: Bell,
      settings: [
        {
          label: 'Habilitar notificaciones',
          key: 'notifications',
          type: 'toggle',
          value: settings.notifications,
        },
        {
          label: 'Alertas por email',
          key: 'emailAlerts',
          type: 'toggle',
          value: settings.emailAlerts,
        },
      ],
    },
    {
      title: 'Seguridad y Mantenimiento',
      icon: Shield,
      settings: [
        {
          label: 'Modo de mantenimiento',
          key: 'maintenanceMode',
          type: 'toggle',
          value: settings.maintenanceMode,
        },
        {
          label: 'Copias de seguridad automáticas',
          key: 'dataBackup',
          type: 'toggle',
          value: settings.dataBackup,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600 text-lg">Personaliza valores del sistema</p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-7xl mx-auto space-y-6">
        {settingsSections.map((section) => {
          const IconComponent = section.icon
          return (
            <Card key={section.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <Label className="text-base font-medium text-gray-700 cursor-pointer">
                      {setting.label}
                    </Label>
                    <div className="flex-shrink-0">
                      {setting.type === 'input' && (
                        <Input
                          type="text"
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className="w-64"
                        />
                      )}
                      {setting.type === 'select' && (
                        <Select value={setting.value} onValueChange={(value) => handleSettingChange(setting.key, value)}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {setting.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {setting.type === 'toggle' && (
                        <Switch
                          checked={setting.value}
                          onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto mt-8 flex gap-3 justify-end">
        <Button variant="outline" className="px-6 bg-transparent">
          Cancelar
        </Button>
        <Button onClick={handleSaveSettings} className="px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}

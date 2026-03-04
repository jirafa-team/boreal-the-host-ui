"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, ArrowLeft, User } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"

export default function ProfilePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<string>("")

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
      return
    }
    setCurrentUser(user)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("common.back") || "Atrás"}
          </Button>
          <h1 className="text-2xl font-bold text-white">{t("common.profile") || "Mi Perfil"}</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="border-b border-slate-700 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">{currentUser || "Usuario"}</CardTitle>
                <p className="text-sm text-slate-400 mt-1">{currentUser}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* User Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("common.email") || "Email"}
                </label>
                <div className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200">
                  {currentUser}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-6 border-t border-slate-700">
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500/90 hover:bg-red-600 text-white font-semibold h-11 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                {t("common.logout") || "Cerrar sesión"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>{t("common.appVersion") || "Versión de la aplicación"}: 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

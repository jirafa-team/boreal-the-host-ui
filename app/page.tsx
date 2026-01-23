"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Shield, X, Globe } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HomePage() {
  const [reservationCode, setReservationCode] = useState("")
  const [lastName, setLastName] = useState("")
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminUser, setAdminUser] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const router = useRouter()

  const { language, setLanguage, t } = useLanguage()

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (reservationCode !== "1" && reservationCode !== "2" && reservationCode !== "3") {
      alert(t("login.invalidCode"))
      return
    }

    if (reservationCode === "1") {
      router.push("/client/checkin")
    } else if (reservationCode === "2") {
      router.push("/client/quick-checkin")
    } else if (reservationCode === "3") {
      router.push("/client/quick-checkin?type=future")
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (adminUser === "system" && adminPassword === "1234") {
      router.push("/system/organizations")
    } else if (adminUser === "admin" && adminPassword === "1234") {
      router.push("/admin/home")
    } else if (adminUser === "staff" && adminPassword === "1234") {
      router.push("/staff/tasks")
    } else {
      alert(t("login.invalidCredentials"))
      setAdminPassword("")
    }
  }

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ]

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/images/thehost-20background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-4 right-4 z-20">
        <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
          <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur-sm border-none">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        {showAdminLogin ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{t("login.adminAccess")}</h2>
              <button onClick={() => setShowAdminLogin(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("login.user")}</label>
                <Input
                  type="text"
                  placeholder={t("login.enterUser")}
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("login.password")}</label>
                <Input
                  type="password"
                  placeholder={t("login.enterPassword")}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                {t("login.login")}
              </Button>
            </form>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <Image
                  src="/images/thehost-20logo.png"
                  alt="TheHost Logo"
                  width={260}
                  height={130}
                  className="h-32 w-auto"
                />
              </div>
              <p className="text-blue-100 text-lg">{t("login.welcome")}</p>
            </div>

            {/* Main card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t("login.reservationCode")}</label>
                  <Input
                    type="text"
                    placeholder={t("login.enterReservationCode")}
                    value={reservationCode}
                    onChange={(e) => setReservationCode(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t("login.lastName")}</label>
                  <Input
                    type="text"
                    placeholder={t("login.enterLastName")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md"
                  disabled={!reservationCode}
                >
                  {t("common.continue")}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">{t("login.orAccessAs")}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  <Shield className="w-5 h-5" />
                  {t("login.accessAdmin")}
                </button>

                <a
                  href="/client/checkin"
                  className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all shadow-md"
                >
                  <User className="w-5 h-5" />
                  {t("login.accessClient")}
                </a>
              </div>
            </div>

            {/* Footer text */}
            <p className="text-center text-white/80 text-sm mt-6">{t("login.needHelp")}</p>
          </>
        )}
      </div>
    </div>
  )
}

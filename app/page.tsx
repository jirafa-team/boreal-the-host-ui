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
import { BorealLoadingBar } from "@/components/boreal-loading-bar"

export default function HomePage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminUser, setAdminUser] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const router = useRouter()

  const { language, setLanguage, t } = useLanguage()

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Usuarios predefinidos
    const predefinedUsers = ["1", "2", "3"]
    const isValidPredefined = predefinedUsers.includes(username)

    // Si no es un usuario predefinido, validar en localStorage
    if (!isValidPredefined) {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.username === username && u.password === password)

      if (!user) {
        alert(t("login.invalidUsername"))
        return
      }

      // Usuario registrado válido - redirigir a acceso cliente normal
      setIsLoading(true)
      setTimeout(() => {
        router.push("/client/checkin")
      }, 800)
      return
    }

    // Usuario predefinido
    if (username !== "1" && username !== "2" && username !== "3") {
      alert(t("login.invalidUsername"))
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      if (username === "1") {
        router.push("/client/checkin")
      } else if (username === "2") {
        router.push("/client/quick-checkin")
      } else if (username === "3") {
        router.push("/client/quick-checkin?type=future")
      }
    }, 800)
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (adminUser === "system" && adminPassword === "1234") {
      setIsLoading(true)
      setTimeout(() => router.push("/system/organizations"), 800)
    } else {
      alert(t("login.invalidCredentials"))
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación de username vacío
    if (!registerUsername.trim()) {
      alert(t("register.usernameMissing"))
      return
    }

    // Validación de username reservado
    if (registerUsername === "1" || registerUsername === "2" || registerUsername === "3" || registerUsername === "system") {
      alert(t("register.usernameReserved"))
      return
    }

    // Validación de password vacío
    if (!registerPassword) {
      alert(t("register.passwordMissing"))
      return
    }

    // Validación de longitud mínima
    if (registerPassword.length < 6) {
      alert(t("register.passwordTooShort"))
      return
    }

    // Validación de confirmación de password
    if (registerPassword !== registerConfirmPassword) {
      alert(t("register.passwordMismatch"))
      return
    }

    // Validación de usuario ya existente
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.some((u: any) => u.username === registerUsername)) {
      alert(t("register.usernameExists"))
      return
    }

    // Registro exitoso
    users.push({ username: registerUsername, password: registerPassword })
    localStorage.setItem("users", JSON.stringify(users))

    alert(t("register.registerSuccess"))
    setShowRegister(false)
    setRegisterUsername("")
    setRegisterPassword("")
    setRegisterConfirmPassword("")
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
        {isLoading ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center min-h-96">
            <BorealLoadingBar />
          </div>
        ) : showAdminLogin ? (
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
                  priority
                />
              </div>
              <p className="text-blue-100 text-lg">{t("login.welcome")}</p>
            </div>

            {/* Main card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
              <form onSubmit={handleClientLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t("login.username")}</label>
                  <Input
                    type="text"
                    placeholder={t("login.enterUsername")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t("login.password")}</label>
                  <Input
                    type="password"
                    placeholder={t("login.enterPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md"
                  disabled={!username || !password}
                >
                  {t("common.continue")}
                </Button>

                <Button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md"
                >
                  {t("register.register")}
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
              </div>
            </div>

            {/* Footer text */}
            <p className="text-center text-white/80 text-sm mt-6">
              <span>{t("login.needHelpPrefix")} </span>
              <a
                href="https://wa.me/5491122415153"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-white hover:text-blue-200 transition-colors"
              >
                {t("login.contactUs")}
              </a>
            </p>
          </>
        )}
      </div>

      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{t("register.registerTitle")}</h2>
              <button
                onClick={() => setShowRegister(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("register.username")}</label>
                <Input
                  type="text"
                  placeholder={t("register.enterUsername")}
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="w-full h-10 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("register.password")}</label>
                <Input
                  type="password"
                  placeholder={t("register.enterPassword")}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full h-10 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t("register.confirmPassword")}</label>
                <Input
                  type="password"
                  placeholder={t("register.confirmPassword")}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className="w-full h-10 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all shadow-md"
                disabled={!registerUsername || !registerPassword || !registerConfirmPassword}
              >
                {t("register.createAccount")}
              </Button>

              <Button
                type="button"
                onClick={() => setShowRegister(false)}
                className="w-full h-10 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-all"
              >
                {t("common.cancel")}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

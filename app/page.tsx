"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { User, Shield, X, Globe } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BorealLoadingBar } from "@/components/boreal-loading-bar"
import type { RootState } from "@/store/store"
import { setDataSource } from "@/store/slices/dataSourceSlice"
import { updateUser } from "@/features/auth/slices/authSlice"
import { API_BASE_URL, ENDPOINTS } from "@/shared/types/api"
import { jwtDecode } from "jwt-decode"

export default function HomePage() {
  const [reservationCode, setReservationCode] = useState("")
  const [lastName, setLastName] = useState("")
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminUser, setAdminUser] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useDispatch()
  const dataSource = useSelector((state: RootState) => state.dataSource.dataSource)
  const mockMode = dataSource === "mock"

  const { language, setLanguage, t } = useLanguage()

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (reservationCode !== "1" && reservationCode !== "2" && reservationCode !== "3") {
      alert(t("login.invalidCode"))
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      if (reservationCode === "1") {
        router.push("/client/checkin")
      } else if (reservationCode === "2") {
        router.push("/client/quick-checkin")
      } else if (reservationCode === "3") {
        router.push("/client/quick-checkin?type=future")
      }
    }, 800)
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (dataSource === "mock") {
      if (adminUser === "system" && adminPassword === "1234") {
        setIsLoading(true)
        setTimeout(() => router.push("/system/organizations"), 800)
      } else if (adminUser === "admin" && adminPassword === "1234") {
        setIsLoading(true)
        setTimeout(() => router.push("/admin/select-establishment"), 800)
      } else if (adminUser === "staff" && adminPassword === "1234") {
        setIsLoading(true)
        setTimeout(() => router.push("/staff/tasks"), 800)
      } else {
        setLoginError(t("login.invalidCredentials"))
        setAdminPassword("")
      }
      return
    }

    setIsLoading(true)
    try {
      const url = `${API_BASE_URL}/api${ENDPOINTS.AUTH.LOGIN}`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminUser, password: adminPassword }),
        credentials: "include",
      })
      console.log(res)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setLoginError((err as { message?: string })?.message ?? t("login.invalidCredentials"))
        setAdminPassword("")
        return
      }
      const data = (await res.json()) as { token?: string }
      if (data?.token) {
        try {
          const decoded = jwtDecode<{ email?: string; uuid?: string; firstName?: string; lastName?: string }>(data.token)
          dispatch(
            updateUser({
              user: {
                email: decoded.email ?? adminUser,
                uuid: decoded.uuid ?? "",
                firstName: decoded.firstName ?? null,
                lastName: decoded.lastName ?? null,
              },
              isLoggedIn: true,
            })
          )
        } catch {
          dispatch(updateUser({ user: { email: adminUser, uuid: "" }, isLoggedIn: true }))
        }
      } else {
        dispatch(updateUser({ user: { email: adminUser, uuid: "" }, isLoggedIn: true }))
      }
      router.push("/admin/select-establishment")
    } catch {
      setLoginError(t("login.invalidCredentials"))
      setAdminPassword("")
    } finally {
      setIsLoading(false)
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

            <div className="flex items-center justify-between gap-2 py-2 px-3 mb-2 rounded-lg bg-gray-100">
              <span className="text-sm font-medium text-gray-700">
                {mockMode ? "MOCK" : "API"}
              </span>
              <Switch
                checked={mockMode}
                onCheckedChange={(checked) => dispatch(setDataSource(checked ? "mock" : "api"))}
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{loginError}</p>
            )}

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

                <Button
                  type="button"
                  className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Ingresar con Google
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

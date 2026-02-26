"use client"

import type React from "react"
import { createContext, useContext, useState, useLayoutEffect } from "react"
import { translations } from "./translations"

type Language = "es" | "en" | "pt" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from localStorage on the server (returns default)
    if (typeof window === "undefined") return "es"
    const savedLanguage = localStorage.getItem("language") as Language | null
    return savedLanguage || "es"
  })
  const [isHydrated, setIsHydrated] = useState(false)

  useLayoutEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
    setIsHydrated(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === "string" ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Alias for consistency
export const useI18n = useLanguage

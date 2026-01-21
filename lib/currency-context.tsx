"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"

export type Currency = "EUR" | "USD" | "GBP" | "JPY" | "MXN" | "ARS" | "BRL"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (curr: Currency) => void
  symbol: string
  formatPrice: (price: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const currencyData: Record<Currency, { symbol: string; name: string; exchangeRate: number }> = {
  EUR: { symbol: "€", name: "Euro", exchangeRate: 1 },
  USD: { symbol: "$", name: "Dólar Estadounidense", exchangeRate: 1.08 },
  GBP: { symbol: "£", name: "Libra Esterlina", exchangeRate: 0.86 },
  JPY: { symbol: "¥", name: "Yen Japonés", exchangeRate: 160.5 },
  MXN: { symbol: "$", name: "Peso Mexicano", exchangeRate: 18.5 },
  ARS: { symbol: "$", name: "Peso Argentino", exchangeRate: 950 },
  BRL: { symbol: "R$", name: "Real Brasileño", exchangeRate: 5.4 },
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR")

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as Currency | null
    if (savedCurrency && Object.keys(currencyData).includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr)
    localStorage.setItem("currency", curr)
  }

  const symbol = currencyData[currency].symbol
  const exchangeRate = currencyData[currency].exchangeRate
  
  const formatPrice = useCallback((price: number): string => {
    const convertedPrice = price * exchangeRate
    if (currency === "JPY") {
      return `${symbol}${Math.round(convertedPrice).toLocaleString()}`
    }
    return `${symbol}${(convertedPrice / 1000).toFixed(1)}K`
  }, [currency, exchangeRate, symbol])

  const value = useMemo(
    () => ({ currency, setCurrency, symbol, formatPrice }),
    [currency, symbol, formatPrice]
  )

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

export function getCurrencyName(curr: Currency): string {
  return currencyData[curr].name
}

export const currencies: Currency[] = Object.keys(currencyData) as Currency[]

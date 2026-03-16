import type React from "react"
import MyHostLayoutClient from "./myHostLyoutClient"

export default function MyHostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MyHostLayoutClient>{children}</MyHostLayoutClient>
}
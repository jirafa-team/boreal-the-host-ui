"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingTasks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-20" />
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

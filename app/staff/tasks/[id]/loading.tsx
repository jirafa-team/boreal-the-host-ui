"use client"

import { ChevronLeft } from "lucide-react"

export default function TaskDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="h-6 bg-blue-500 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-blue-500 rounded w-1/2 mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

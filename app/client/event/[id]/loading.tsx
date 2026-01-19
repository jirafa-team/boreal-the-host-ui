export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-72 bg-gray-300" />
      <div className="px-4 py-6 space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

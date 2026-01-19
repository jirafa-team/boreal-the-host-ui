export default function Loading() {
  return (
    <div className="p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

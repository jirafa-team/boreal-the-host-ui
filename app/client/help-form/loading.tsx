export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#11AFBE] border-t-transparent" />
        <p className="mt-4 text-gray-600">Cargando formulario...</p>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Square, Circle, Type, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ShapeType = "rectangle" | "circle" | "text"

interface Shape {
  id: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  label: string
  color: string
}

export default function SpaceBuilderPage() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedTool, setSelectedTool] = useState<ShapeType | null>(null)
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addShape = (type: ShapeType, e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newShape: Shape = {
      id: Date.now().toString(),
      type,
      x,
      y,
      width: type === "circle" ? 60 : 80,
      height: type === "circle" ? 60 : 80,
      label: type === "text" ? "Texto" : `${shapes.length + 1}`,
      color: "#3b82f6",
    }

    setShapes([...shapes, newShape])
    setSelectedTool(null)
  }

  const deleteShape = () => {
    if (selectedShape) {
      setShapes(shapes.filter((s) => s.id !== selectedShape))
      setSelectedShape(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Diseñador de Espacios</h1>
            <p className="text-xs text-muted-foreground">Dibuja el layout del hotel</p>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-card border-b border-border p-3">
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={selectedTool === "rectangle" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("rectangle")}
          >
            <Square className="w-4 h-4 mr-2" />
            Habitación
          </Button>
          <Button
            variant={selectedTool === "circle" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("circle")}
          >
            <Circle className="w-4 h-4 mr-2" />
            Mesa
          </Button>
          <Button
            variant={selectedTool === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("text")}
          >
            <Type className="w-4 h-4 mr-2" />
            Texto
          </Button>
          {selectedShape && (
            <Button variant="destructive" size="sm" onClick={deleteShape}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4 overflow-auto">
        <div
          ref={canvasRef}
          className="relative w-full h-[600px] bg-muted rounded-lg border-2 border-dashed border-border"
          onClick={(e) => {
            if (selectedTool) {
              addShape(selectedTool, e)
            }
          }}
        >
          {shapes.map((shape) => (
            <div
              key={shape.id}
              className={`absolute cursor-move border-2 flex items-center justify-center text-xs font-medium ${
                selectedShape === shape.id ? "border-primary" : "border-foreground"
              }`}
              style={{
                left: shape.x,
                top: shape.y,
                width: shape.width,
                height: shape.height,
                backgroundColor: selectedShape === shape.id ? shape.color + "40" : shape.color + "20",
                borderRadius: shape.type === "circle" ? "50%" : "4px",
              }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedShape(shape.id)
              }}
            >
              {shape.label}
            </div>
          ))}
          {shapes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p className="text-sm text-center">
                Selecciona una herramienta y toca el canvas
                <br />
                para agregar elementos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      {selectedTool && (
        <div className="bg-card border-t border-border p-4">
          <p className="text-sm text-center text-muted-foreground">Toca en el canvas para añadir un elemento</p>
        </div>
      )}
    </div>
  )
}

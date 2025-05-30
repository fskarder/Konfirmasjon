"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"

interface Video {
  id: string
  baseUrl: string
  filename: string
  mimeType: string
}

export default function PanicButton() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPressed, setIsPressed] = useState(false)

  const fetchRandomVideo = async () => {
    setIsLoading(true)
    setError(null)
    setIsPressed(true)

    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 200)

    try {
      const response = await fetch("/api/random-video")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch video")
      }

      const video = await response.json()
      setCurrentVideo(video)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* Panic Button */}
      <div className="relative">
        <Button
          onClick={fetchRandomVideo}
          disabled={isLoading}
          className={`
            relative h-32 w-32 rounded-full text-2xl font-bold
            bg-red-600 hover:bg-red-700 active:bg-red-800
            border-4 border-red-800 shadow-2xl
            transition-all duration-200 ease-in-out 
            ${isPressed ? "scale-95 shadow-lg" : "scale-100 shadow-2xl"}
            ${isLoading ? "animate-pulse" : ""}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <AlertTriangle className="h-8 w-8" />}
            <span className="text-sm">PANIC</span>
          </div>

          {/* Ripple effect */}
          {isPressed && <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping" />}
        </Button>

        {/* Glow effect */}
        <div
          className={`
          absolute rounded-full bg-red-500 opacity-20 blur-xl
          transition-all duration-300
          ${isPressed ? "scale-150" : "scale-100"}
        `}
        />
      </div>

      {/* Status Messages */}
      {isLoading && (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Finding a random video...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 font-semibold">Error: {error}</p>
        </div>
      )}

      {/* Video Display */}
      {currentVideo && !isLoading && (
        <div className="w-full max-w-4xl">
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            <video
              key={currentVideo.id}
              controls
              autoPlay
              className="w-full h-auto max-h-96 object-contain"
              onError={() => setError("Failed to load video")}
            >
              <source src={currentVideo.baseUrl} type={currentVideo.mimeType} />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-center mt-4 text-gray-600 text-sm">{currentVideo.filename}</p>
        </div>
      )}
    </div>
  )
}

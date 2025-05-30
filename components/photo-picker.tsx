"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useSelectedVideos } from "@/context/selected-videos-context"
import type { SelectedVideo, SelectedAlbum } from "@/types/videos"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    googlePhotosPickerLoaded?: boolean
    onApiLoad?: () => void
  }
}

export default function PhotoPicker() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addAlbum } = useSelectedVideos()

  const pickerCallback = useCallback(
    (data: any) => {
      console.log("Picker callback data:", data)

      if (data.action === "picked" && data.docs) {
        const videos: SelectedVideo[] = data.docs
          .filter((doc: any) => doc.mimeType?.startsWith("video/"))
          .map((doc: any) => ({
            id: doc.id,
            filename: doc.name || `Video ${doc.id}`,
            mimeType: doc.mimeType,
            baseUrl: doc.url,
          }))

        if (videos.length === 0) {
          setError("No videos were selected. Please select video files.")
          setIsSelecting(false)
          return
        }

        // Create a new album with the selected videos
        const newAlbum: SelectedAlbum = {
          id: `album-${Date.now()}`,
          name: `Selection ${new Date().toLocaleString()}`,
          videos,
        }

        addAlbum(newAlbum)
        setIsSelecting(false)
      } else if (data.action === "cancel") {
        setIsSelecting(false)
      }
    },
    [addAlbum],
  )

  // Load the Google Photos Picker API
  useEffect(() => {
    if (!window.googlePhotosPickerLoaded) {
      const script = document.createElement("script")
      script.src = "https://apis.google.com/js/api.js"
      script.onload = () => {
        window.onApiLoad = initPicker
      }
      script.onerror = () => {
        setError("Failed to load Google Photos Picker API")
        setIsLoading(false)
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    } else {
      initPicker()
    }
  }, [])

  const initPicker = useCallback(() => {
    window.gapi?.load("picker", () => {
      window.googlePhotosPickerLoaded = true
      setIsLoading(false)
    })
  }, [])

  const openPicker = useCallback(async () => {
    if (!window.gapi?.picker) {
      setError("Google Photos Picker API not loaded")
      return
    }

    setIsSelecting(true)
    setError(null)

    try {
      // Get the access token from the session
      const response = await fetch("/api/auth/session")
      const session = await response.json()

      if (!session?.accessToken) {
        setError("No access token available. Please sign in again.")
        setIsSelecting(false)
        return
      }

      const picker = new window.gapi.picker.PickerBuilder()
        .addView(new window.gapi.picker.VideoSearchView())
        .setOAuthToken(session.accessToken)
        .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "")
        .setCallback(pickerCallback)
        .build()

      picker.setVisible(true)
    } catch (err) {
      console.error("Error creating picker:", err)
      setError("Failed to open Google Photos Picker")
      setIsSelecting(false)
    }
  }, [pickerCallback])

  return (
    <div className="flex flex-col items-center gap-4">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Google Photos Picker...</span>
        </div>
      ) : (
        <Button onClick={openPicker} disabled={isSelecting} className="bg-blue-600 hover:bg-blue-700">
          {isSelecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Selecting videos...
            </>
          ) : (
            <>
              <span className="mr-2">📷</span>
              Select Videos from Google Photos
            </>
          )}
        </Button>
      )}

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  )
}

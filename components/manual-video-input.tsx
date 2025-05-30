"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSelectedVideos } from "@/context/selected-videos-context"
import type { SelectedVideo, SelectedAlbum } from "@/types/videos"
import { Plus } from "lucide-react"

export default function ManualVideoInput() {
  const [videoUrl, setVideoUrl] = useState("")
  const [videoName, setVideoName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const { addAlbum } = useSelectedVideos()

  const handleAddVideo = () => {
    if (!videoUrl.trim()) return

    setIsAdding(true)

    try {
      const video: SelectedVideo = {
        id: `manual-${Date.now()}`,
        filename: videoName.trim() || `Manual Video ${Date.now()}`,
        mimeType: "video/mp4", // Default, could be improved
        baseUrl: videoUrl.trim(),
      }

      const newAlbum: SelectedAlbum = {
        id: `manual-album-${Date.now()}`,
        name: `Manual Selection ${new Date().toLocaleString()}`,
        videos: [video],
      }

      addAlbum(newAlbum)
      setVideoUrl("")
      setVideoName("")
    } catch (error) {
      console.error("Error adding manual video:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Add Video Manually</h3>
      <p className="text-sm text-gray-600 mb-4">
        If the photo picker doesn't work, you can manually add video URLs here.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="videoName" className="block text-sm font-medium text-gray-700 mb-1">
            Video Name (optional)
          </label>
          <Input
            id="videoName"
            type="text"
            placeholder="My awesome video"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Video URL
          </label>
          <Input
            id="videoUrl"
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <Button onClick={handleAddVideo} disabled={!videoUrl.trim() || isAdding} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          {isAdding ? "Adding..." : "Add Video"}
        </Button>
      </div>
    </div>
  )
}

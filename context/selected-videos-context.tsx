"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { SelectedVideo, SelectedAlbum } from "@/types/videos"

interface SelectedVideosContextType {
  selectedAlbums: SelectedAlbum[]
  addAlbum: (album: SelectedAlbum) => void
  removeAlbum: (albumId: string) => void
  getRandomVideo: () => SelectedVideo | null
  hasVideos: boolean
}

const SelectedVideosContext = createContext<SelectedVideosContextType | undefined>(undefined)

export function SelectedVideosProvider({ children }: { children: React.ReactNode }) {
  const [selectedAlbums, setSelectedAlbums] = useState<SelectedAlbum[]>([])
  const [hasVideos, setHasVideos] = useState(false)

  // Load from localStorage on client side
  useEffect(() => {
    try {
      const savedAlbums = localStorage.getItem("selectedAlbums")
      if (savedAlbums) {
        const parsedAlbums = JSON.parse(savedAlbums)
        setSelectedAlbums(parsedAlbums)

        // Check if there are any videos
        const totalVideos = parsedAlbums.reduce((total: number, album: SelectedAlbum) => total + album.videos.length, 0)
        setHasVideos(totalVideos > 0)
      }
    } catch (error) {
      console.error("Error loading selected albums from localStorage:", error)
    }
  }, [])

  // Save to localStorage whenever selectedAlbums changes
  useEffect(() => {
    try {
      localStorage.setItem("selectedAlbums", JSON.stringify(selectedAlbums))

      // Update hasVideos state
      const totalVideos = selectedAlbums.reduce((total, album) => total + album.videos.length, 0)
      setHasVideos(totalVideos > 0)
    } catch (error) {
      console.error("Error saving selected albums to localStorage:", error)
    }
  }, [selectedAlbums])

  const addAlbum = (album: SelectedAlbum) => {
    setSelectedAlbums((prev) => {
      // Check if album already exists
      const existingAlbumIndex = prev.findIndex((a) => a.id === album.id)

      if (existingAlbumIndex >= 0) {
        // Update existing album
        const newAlbums = [...prev]
        newAlbums[existingAlbumIndex] = album
        return newAlbums
      } else {
        // Add new album
        return [...prev, album]
      }
    })
  }

  const removeAlbum = (albumId: string) => {
    setSelectedAlbums((prev) => prev.filter((album) => album.id !== albumId))
  }

  const getRandomVideo = (): SelectedVideo | null => {
    // Flatten all videos from all albums
    const allVideos = selectedAlbums.flatMap((album) => album.videos)

    if (allVideos.length === 0) {
      return null
    }

    // Get a random video
    const randomIndex = Math.floor(Math.random() * allVideos.length)
    return allVideos[randomIndex]
  }

  return (
    <SelectedVideosContext.Provider
      value={{
        selectedAlbums,
        addAlbum,
        removeAlbum,
        getRandomVideo,
        hasVideos,
      }}
    >
      {children}
    </SelectedVideosContext.Provider>
  )
}

export function useSelectedVideos() {
  const context = useContext(SelectedVideosContext)
  if (context === undefined) {
    throw new Error("useSelectedVideos must be used within a SelectedVideosProvider")
  }
  return context
}

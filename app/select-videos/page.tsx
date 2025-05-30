"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useSelectedVideos } from "@/context/selected-videos-context"
import PhotoPicker from "@/components/photo-picker"
import { Trash2, ArrowLeft, Film } from "lucide-react"
import Link from "next/link"
import ManualVideoInput from "@/components/manual-video-input"

export default function SelectVideosPage() {
  const { data: session } = useSession({ required: true })
  const { selectedAlbums, removeAlbum } = useSelectedVideos()
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null)

  const handleRemoveAlbum = (albumId: string) => {
    if (showConfirmation === albumId) {
      removeAlbum(albumId)
      setShowConfirmation(null)
    } else {
      setShowConfirmation(albumId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Select Videos</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-12 px-4">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Panic Button
          </Button>
        </Link>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Select Videos from Google Photos</h2>
          <p className="text-gray-600 mb-6">
            Use the button below to select videos from your Google Photos. These videos will be used when you press the
            panic button.
          </p>

          <PhotoPicker />
        </div>

        <div className="mt-8">
          <ManualVideoInput />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Selected Videos</h2>

          {selectedAlbums.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">
                No videos selected yet. Use the button above to select videos from Google Photos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedAlbums.map((album) => (
                <Card key={album.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="flex justify-between items-center">
                      <span className="truncate">{album.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={showConfirmation === album.id ? "bg-red-100 text-red-600" : ""}
                        onClick={() => handleRemoveAlbum(album.id)}
                      >
                        {showConfirmation === album.id ? "Confirm" : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Film className="h-5 w-5 text-blue-500" />
                      <span>{album.videos.length} videos</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 text-xs text-gray-500">
                    Added on {new Date(Number.parseInt(album.id.split("-")[1])).toLocaleString()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

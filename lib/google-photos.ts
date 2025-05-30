export interface GooglePhotosResponse {
  mediaItems: GooglePhotosVideo[]
}

export interface GooglePhotosVideo {
  id: string
  filename: string
  mimeType: string
  baseUrl: string
  mediaMetadata: {
    creationTime: string
    width: string
    height: string
    video?: {
      status: string
      fps: number
    }
  }
}

export async function getRandomVideo(accessToken: string): Promise<GooglePhotosVideo | null> {
  try {
    console.log("Getting random video with new scope")

    // Search for video files in Google Photos
    const response = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: {
          mediaTypeFilter: {
            mediaTypes: ["VIDEO"],
          },
        },
        pageSize: 100,
      }),
    })

    if (!response.ok) {
      console.error(`Google Photos API error: ${response.status}`)
      const errorText = await response.text()
      console.error("Error details:", errorText)
      throw new Error(`Google Photos API error: ${response.status}`)
    }

    const data: GooglePhotosResponse = await response.json()
    console.log("API response:", data)

    if (!data.mediaItems || data.mediaItems.length === 0) {
      console.log("No videos found in response")
      return null
    }

    // Get a random video from the results
    const randomIndex = Math.floor(Math.random() * data.mediaItems.length)
    const video = data.mediaItems[randomIndex]

    // Add video parameters to the base URL for playback
    video.baseUrl = `${video.baseUrl}=dv`

    console.log("Selected video:", video.filename)
    return video
  } catch (error) {
    console.error("Error fetching random video:", error)
    return null
  }
}

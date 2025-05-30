interface GooglePhotosVideo {
  id: string
  baseUrl: string
  filename: string
  mimeType: string
  mediaMetadata: {
    width: string
    height: string
    video?: {
      fps: number
      status: string
    }
  }
}

interface GooglePhotosResponse {
  mediaItems: GooglePhotosVideo[]
  nextPageToken?: string
}

export async function getRandomVideo(accessToken: string): Promise<GooglePhotosVideo | null> {
  try {
    console.log("get random video start");
    //list albums:
    const responseAlbum = await fetch("https://photoslibrary.googleapis.com/v1/albums", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
const dataAlbum = await responseAlbum.json();
console.log(dataAlbum.albums); // Each album will have an 'id' and a 'title'
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
      throw new Error(`Google Photos API error: ${response.status}`)
    }

    const data: GooglePhotosResponse = await response.json()

    if (!data.mediaItems || data.mediaItems.length === 0) {
      return null
    }

    // Get a random video from the results
    const randomIndex = Math.floor(Math.random() * data.mediaItems.length)
    const video = data.mediaItems[randomIndex]

    // Add video parameters to the base URL for playback
    video.baseUrl = `${video.baseUrl}=dv`

    return video
  } catch (error) {
    console.error("Error fetching random video:", error)
    return null
  }
}

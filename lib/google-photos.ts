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

interface GooglePhotosListResponse {
  mediaItems: GooglePhotosVideo[]
  nextPageToken?: string
}

export async function getRandomVideo(accessToken: string): Promise<GooglePhotosVideo | null> {
  try {
    console.log("Fetching videos from Google Photos using mediaItems.list");

    const response = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google Photos API error: ${response.status}`);
    }

    const data: GooglePhotosListResponse = await response.json();

    if (!data.mediaItems || data.mediaItems.length === 0) {
      console.warn("No media items returned");
      return null;
    }

    // Manually filter only videos
    const videoItems = data.mediaItems.filter(item =>
      item.mimeType.startsWith("video/") || item.mediaMetadata.video
    );

    if (videoItems.length === 0) {
      console.warn("No video items found in user's media");
      return null;
    }

    // Pick a random video
    const randomIndex = Math.floor(Math.random() * videoItems.length);
    const video = videoItems[randomIndex];

    // Add playback parameters
    video.baseUrl = `${video.baseUrl}=dv`;

    return video;
  } catch (error) {
    console.error("Error fetching video from mediaItems.list:", error);
    return null;
  }
}
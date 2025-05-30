export interface SelectedVideo {
  id: string
  filename: string
  mimeType: string
  baseUrl: string
}

export interface SelectedAlbum {
  id: string
  name: string
  videos: SelectedVideo[]
}

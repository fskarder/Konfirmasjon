import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getRandomVideo } from "@/lib/google-photos"

export async function GET(request: NextRequest) {
  try {
    console.log("i route")
    const session = await getServerSession(authOptions) as any

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("session?.accessToken", session?.accessToken)

    const video = await getRandomVideo(session.accessToken)

    if (!video) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error("Error in random-video API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

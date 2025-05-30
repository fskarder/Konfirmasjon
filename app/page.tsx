"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import PanicButton from "@/components/panic-button"
import { LogOut, User } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Panic Button</h1>
          <p className="text-gray-600 mb-6">Sign in with Google to access your photos and start panicking!</p>
          <Button onClick={() => signIn("google")} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg">
            <User className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Panic Button</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hello, {session.user?.name}</span>
            <Button onClick={() => signOut()} variant="outline" size="sm" className="realtive z-50">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Emergency Video Relief</h2>
          <p className="text-xl text-gray-600">Press the panic button to get a random video from your Google Photos!</p>
        </div>

        <PanicButton />
      </main>
    </div>
  )
}

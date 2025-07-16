"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Toaster } from "@/components/ui/toaster"
import AuthForm from "@/components/auth-form"
import BirthForm from "@/components/birth-form"
import Navbar from "@/components/navbar"
import HomeDashboard from "@/components/home-dashboard"
import HoroscopeCard from "@/components/horoscope-card"
import ChatBox from "@/components/chat-box"
import { Loader2 } from "lucide-react"

export default function App() {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState("home")
  const [showBirthForm, setShowBirthForm] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // Check if user has completed birth form
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
          setShowBirthForm(false)
        } else {
          setShowBirthForm(true)
        }
      } else {
        setUser(null)
        setUserData(null)
        setShowBirthForm(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAuthSuccess = () => {
    // Auth state change will be handled by the listener
  }

  const handleBirthFormComplete = (data) => {
    setUserData(data)
    setShowBirthForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">🔮</div>
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-lg text-purple-600 font-medium">Loading your cosmic journey...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    )
  }

  if (showBirthForm) {
    return (
      <>
        <BirthForm onComplete={handleBirthFormComplete} />
        <Toaster />
      </>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomeDashboard user={userData} onPageChange={setCurrentPage} />
      case "horoscope":
        return <HoroscopeCard zodiacSign={userData.zodiacSign} />
      case "chat":
        return <ChatBox />
      default:
        return <HomeDashboard user={userData} onPageChange={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navbar user={userData} currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="container mx-auto px-4 py-8">{renderCurrentPage()}</main>

      <Toaster />
    </div>
  )
}

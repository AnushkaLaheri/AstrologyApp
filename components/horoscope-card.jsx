"use client"

import { useState, useEffect } from "react"
import { fetchHoroscope } from "@/lib/horoscope-api"
import { zodiacEmojis } from "@/lib/zodiac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, Target, Palette } from "lucide-react"

export default function HoroscopeCard({ zodiacSign }) {
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState("today")

  const days = [
    { id: "yesterday", label: "Yesterday" },
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
  ]

  useEffect(() => {
    console.log("Fetching horoscope for:", selectedDay)
    loadHoroscope(selectedDay)
  }, [selectedDay, zodiacSign])

  const loadHoroscope = async (day) => {
  setLoading(true)

  const getDateKey = (day) => {
    const date = new Date()
    if (day === "yesterday") date.setDate(date.getDate() - 1)
    if (day === "tomorrow") date.setDate(date.getDate() + 1)
    return date.toISOString().split("T")[0] // YYYY-MM-DD
  }

  const dateKey = getDateKey(day)
  const cacheKey = `${zodiacSign}-${day}-${dateKey}`

  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    const parsed = JSON.parse(cached)
    if (parsed.date === dateKey) {
      setHoroscope(parsed.data)
      setLoading(false)
      return
    }
  }

  try {
    const data = await fetchHoroscope(zodiacSign, day)
    setHoroscope(data)
    localStorage.setItem(cacheKey, JSON.stringify({ date: dateKey, data }))
  } catch (error) {
    console.error("Failed to fetch horoscope:", error)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Day Selection Tabs */}
      <div className="flex justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-purple-100">
          <div className="flex space-x-2">
            {days.map(({ id, label }) => (
              <Button
                key={id}
                onClick={() => {
                  console.log("Selected:", id)
                  setSelectedDay(id)
                  
                }}
                variant="ghost"
                className={`px-6 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  selectedDay === id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-100"
                }`}
              >
                {label}
              </Button>

            ))}
          </div>
        </div>
      </div>

      {/* Horoscope Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 pointer-events-none"></div>
        <CardHeader className="relative text-center pb-4">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="text-6xl">{zodiacEmojis[zodiacSign]}</div>
            <div className="text-4xl animate-pulse">✨</div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
            {zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}'s Reading
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ) : horoscope ? (
            <>
              {/* Main Description */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <p className="text-gray-700 text-lg leading-relaxed">{horoscope.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                  <div className="flex justify-center mb-3">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">Lucky Number</h3>
                  <p className="text-3xl font-bold text-green-600">{horoscope.lucky_number}</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                  <div className="flex justify-center mb-3">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">Mood</h3>
                  <p className="text-xl font-bold text-blue-600">{horoscope.mood}</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                  <div className="flex justify-center mb-3">
                    <Palette className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">Lucky Color</h3>
                  <p className="text-xl font-bold text-purple-600">{horoscope.color}</p>
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

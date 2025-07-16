"use client"

import { zodiacEmojis } from "@/lib/zodiac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MessageCircle, Calendar, Sparkles } from "lucide-react"

export default function HomeDashboard({ user, onPageChange }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    
  })
const displayName = user?.name || user?.email?.split("@")[0] || "Guest"

if (!user) {
  return (
    <div className="text-center py-16 text-gray-600 italic">
      Loading your dashboard...
    </div>
  )
}
  

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        {user?.zodiacSign && (
          <div className="flex justify-center space-x-2 text-6xl mb-4">
            <span className="animate-pulse">✨</span>
            <span>{zodiacEmojis[user.zodiacSign]}</span>
            <span className="animate-pulse">🌟</span>
          </div>
        )}

        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
          Welcome back, {displayName}!

        </h1>
        <p className="text-xl text-gray-600">{currentDate}</p>
        <p className="text-lg text-purple-600 font-medium">
          Your sign: {user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)}{" "}
          {zodiacEmojis[user.zodiacSign]}
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg"
          onClick={() => onPageChange("horoscope")}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Daily Horoscope</CardTitle>
            <CardDescription>Discover what the stars have in store for you today</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Read Your Horoscope
            </Button>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg"
          onClick={() => onPageChange("chat")}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Chat with Astrologer</CardTitle>
            <CardDescription>Get personalized guidance from our cosmic advisor</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Conversation
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-full">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">Birth Chart</CardTitle>
            <CardDescription>Your cosmic blueprint based on birth details</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600">Born: {user.birthDate}</p>
            {user.birthTime && <p className="text-sm text-gray-600">Time: {user.birthTime}</p>}
            {user.birthPlace && <p className="text-sm text-gray-600">Place: {user.birthPlace}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Cosmic Insights */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center space-x-2 text-4xl mb-4">
            <Sparkles className="w-10 h-10" />
            <span>🌙</span>
            <Sparkles className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-bold">Cosmic Insight of the Day</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg leading-relaxed">
            "The universe is not only stranger than we imagine, it is stranger than we can imagine. Today, let your
            intuition guide you toward the extraordinary possibilities that await."
          </p>
          <p className="mt-4 text-purple-200">- Your Cosmic Guide</p>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { doc, setDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { getZodiacSign, zodiacEmojis } from "@/lib/zodiac"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Calendar, Clock, MapPin } from "lucide-react"

export default function BirthForm({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    gender: "",
  })
  const { toast } = useToast()

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.birthDate || !formData.gender) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const zodiacSign = getZodiacSign(formData.birthDate)
      const userData = {
        ...formData,
        zodiacSign,
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", auth.currentUser.uid), userData)

      toast({
        title: `Welcome ${formData.name}! ${zodiacEmojis[zodiacSign]}`,
        description: `Your zodiac sign is ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)}`,
      })

      onComplete(userData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: "Personal Info",
      icon: <User className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="h-12"
          />
          <Select onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      title: "Birth Date",
      icon: <Calendar className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange("birthDate", e.target.value)}
            className="h-12"
          />
          {formData.birthDate && (
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Your Zodiac Sign</p>
              <p className="text-2xl font-bold text-purple-600">
                {zodiacEmojis[getZodiacSign(formData.birthDate)]}{" "}
                {getZodiacSign(formData.birthDate).charAt(0).toUpperCase() + getZodiacSign(formData.birthDate).slice(1)}
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Birth Time",
      icon: <Clock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Input
            type="time"
            value={formData.birthTime}
            onChange={(e) => handleInputChange("birthTime", e.target.value)}
            className="h-12"
          />
          <p className="text-sm text-gray-500 text-center">
            Birth time helps provide more accurate readings (optional)
          </p>
        </div>
      ),
    },
    {
      title: "Birth Place",
      icon: <MapPin className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Input
            placeholder="City, Country"
            value={formData.birthPlace}
            onChange={(e) => handleInputChange("birthPlace", e.target.value)}
            className="h-12"
          />
          <p className="text-sm text-gray-500 text-center">
            Birth location helps with astrological calculations (optional)
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-4xl">✨</div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Tell Us About Yourself</CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3 text-purple-600">
            {steps[currentStep - 1].icon}
            <h3 className="text-lg font-semibold">{steps[currentStep - 1].title}</h3>
          </div>

          {steps[currentStep - 1].content}

          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button onClick={handlePrevious} variant="outline" className="flex-1 bg-transparent">
                Previous
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

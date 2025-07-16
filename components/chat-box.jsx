"use client"

import { useState, useEffect, useRef } from "react"
import { collection, addDoc, query, orderBy, onSnapshot, where } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot } from "lucide-react"
import { deleteDoc, getDocs, doc } from "firebase/firestore"


// 🔮 Zara's Dynamic & Intent-Based Responses
const dynamicResponses = [
  (name) => `The stars smile upon you, ${name}. ✨ Good things are coming your way.`,
  (name) => `${name}, focus your energy inward. A revelation is near.`,
  (name) => `Your aura radiates confidence today, ${name}. Use it wisely.`,
  (name) => `The moon guides your decisions, ${name}. Trust the process.`,
  (name) => `${name}, keep faith. Your guardian star is watching over you.`,
  (name) => `Cosmic winds whisper encouragement to you, ${name}.`,
  (name) => `A spiritual awakening may be near, ${name}. Meditate and embrace the signs.`
]

const getIntentReply = (msg) => {
  const text = msg.toLowerCase()

  if (text.includes("love") || text.includes("relationship") || text.includes("partner"))
    return "💖 Venus influences your heart today. Nurture your connections."

  if (text.includes("career") || text.includes("job") || text.includes("work") || text.includes("promotion"))
    return "💼 Your ambitions are aligned with the stars. Keep going."

  if (text.includes("health") || text.includes("sick") || text.includes("ill") || text.includes("fitness"))
    return "🧘‍♀️ You’re in balance. Just stay mindful and positive."

  if (text.includes("money") || text.includes("finance") || text.includes("wealth") || text.includes("salary"))
    return "💰 Financial clarity is approaching. Be patient."

  if (text.includes("marriage") || text.includes("wedding") || text.includes("spouse"))
    return "💍 The alignment favors long-term commitments. Stay open to love."

  if (text.includes("travel") || text.includes("abroad") || text.includes("relocate"))
    return "🌍 A favorable time to explore new places. The stars guide your journey."

  if (text.includes("education") || text.includes("study") || text.includes("exam") || text.includes("college"))
    return "📚 Knowledge flows freely now. Focus and you'll succeed."

  return "🔮 The cosmos is listening. Ask with an open heart."
}

function getZaraReply(userMessage, userName = "Seeker") {
  const intent = getIntentReply(userMessage)
  const dynamic = dynamicResponses[Math.floor(Math.random() * dynamicResponses.length)](userName)
  return `${intent}\n${dynamic}`
}

const suggestedQuestions = [
  "Tell me about my career",
  "How is my love life?",
  "What about my health?",
  "Will I get a new job?",
  "When will I find love?",
  "Any financial advice?",
  "Will I get married soon?",
  "Will I study abroad?"
]

export default function ChatBox() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, "chats"), where("userId", "==", auth.currentUser?.uid), orderBy("timestamp", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setMessages(chatMessages)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      userId: auth.currentUser.uid,
    }

    try {
      await addDoc(collection(db, "chats"), userMessage)
      setNewMessage("")
      setIsLoading(true)

      setTimeout(async () => {
        const userName = auth.currentUser?.displayName || "Seeker"
        const response = getZaraReply(userMessage.text, userName)
        const astrologerMessage = {
          text: response,
          sender: "astrologer",
          timestamp: new Date(),
          userId: auth.currentUser.uid,
        }
        await addDoc(collection(db, "chats"), astrologerMessage)
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      console.error("Sending error:", err)
      setIsLoading(false)
    }
  }
  const deleteAllChats = async () => {
  const q = query(collection(db, "chats"), where("userId", "==", auth.currentUser?.uid))
  const snapshot = await getDocs(q)

  const deletePromises = snapshot.docs.map((chatDoc) => deleteDoc(doc(db, "chats", chatDoc.id)))
  await Promise.all(deletePromises)

  setMessages([]) // clear local state
}


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-6 h-6" />
                <span>Chat with Astrologer Zara</span>
                <div className="text-2xl">🔮</div>
              </CardTitle>
              <Button
                variant="outline"
                className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"

                onClick={deleteAllChats}
              >
                Clear Chat
              </Button>
            </div>
          </CardHeader>


        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/50 to-purple-50/50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-4">✨</div>
                <p>Welcome! What would you like to ask Zara?</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {suggestedQuestions.map((q) => (
                    <Button key={q} variant="outline" size="sm" onClick={() => setNewMessage(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.sender === "user" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"}>
                      {message.sender === "user" ? "U" : "🔮"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-2xl px-4 py-2 shadow-md ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-purple-100"}`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp?.toDate?.()?.toLocaleTimeString() || "Now"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-500 text-white">🔮</AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl px-4 py-2 shadow-md border border-purple-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-purple-100">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about love, career, marriage..."
                className="flex-1 h-12 bg-white/80 border-purple-200 focus:border-purple-400"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

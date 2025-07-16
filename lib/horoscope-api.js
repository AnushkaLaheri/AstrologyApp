const cache = {}

export const fetchHoroscope = async (sign, day = "today") => {
  const key = `${sign}-${day}`

  if (cache[key]) {
    return cache[key]
  }

  const mockHoroscopes = {
    today: {
      description:
        "Today brings new opportunities for growth and self-discovery. Trust your intuition and embrace the changes coming your way. The stars align in your favor for creative endeavors.",
      lucky_number: Math.floor(Math.random() * 100) + 1,
      mood: ["Happy", "Optimistic", "Energetic", "Peaceful"][Math.floor(Math.random() * 4)],
      color: ["Purple", "Blue", "Green", "Gold", "Silver"][Math.floor(Math.random() * 5)],
    },
    yesterday: {
      description:
        "Yesterday's energy was focused on relationships and communication. You may have experienced some clarity in personal matters that will serve you well moving forward.",
      lucky_number: Math.floor(Math.random() * 100) + 1,
      mood: ["Reflective", "Calm", "Thoughtful", "Content"][Math.floor(Math.random() * 4)],
      color: ["Indigo", "Teal", "Rose", "Amber"][Math.floor(Math.random() * 4)],
    },
    tomorrow: {
      description:
        "Tomorrow holds promise for financial matters and career advancement. Stay focused on your goals and don't be afraid to take calculated risks.",
      lucky_number: Math.floor(Math.random() * 100) + 1,
      mood: ["Ambitious", "Confident", "Determined", "Focused"][Math.floor(Math.random() * 4)],
      color: ["Red", "Orange", "Yellow", "Emerald"][Math.floor(Math.random() * 4)],
    },
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Cache it
  cache[key] = mockHoroscopes[day] || mockHoroscopes.today
  return cache[key]
}

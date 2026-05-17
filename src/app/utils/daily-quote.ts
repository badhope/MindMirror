export interface DailyQuote {
  content: string
  author: string
}

const QUOTE_APIS = [
  {
    name: '一言',
    url: 'https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=i',
    parse: (data: any): DailyQuote => ({
      content: data.hitokoto,
      author: data.from || data.from_who || '佚名'
    })
  },
  {
    name: '今日诗词',
    url: 'https://v1.jinrishici.com/all.json',
    parse: (data: any): DailyQuote => ({
      content: data.content,
      author: data.author || '佚名'
    })
  }
]

export async function getDailyQuote(): Promise<DailyQuote> {
  const cacheKey = 'daily-quote'
  const cached = localStorage.getItem(cacheKey)
  
  if (cached) {
    const { date, quote } = JSON.parse(cached)
    if (date === new Date().toISOString().split('T')[0]) {
      return quote
    }
  }
  
  for (const api of QUOTE_APIS) {
    try {
      const response = await fetch(api.url)
      if (!response.ok) continue
      const data = await response.json()
      const quote = api.parse(data)
      
      localStorage.setItem(cacheKey, JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        quote
      }))
      
      return quote
    } catch (e) {
      console.warn(`Failed to fetch from ${api.name}`, e)
    }
  }
  
  return {
    content: '你的潜意识指引着你的人生，而你称其为命运。当潜意识被呈现，命运就被改写了。',
    author: '卡尔·荣格'
  }
}

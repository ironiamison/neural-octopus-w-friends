'use client'

import { useState } from 'react'
import { LineChart, BookOpen, TrendingUp, Zap, Target, Brain, Shield, Coins, ChartBar, Lightbulb } from 'lucide-react'

const courses = [
  {
    id: 'crypto-basics',
    title: 'Cryptocurrency Fundamentals',
    description: 'Master the basics of cryptocurrency, blockchain technology, and digital assets.',
    level: 1,
    category: 'basics',
    icon: BookOpen,
    progress: 0,
    lessons: [
      {
        id: 'intro-blockchain',
        title: 'Introduction to Blockchain',
        description: 'Understanding the foundation of all cryptocurrencies',
        duration: '30 mins',
        xp: 100,
        content: [
          {
            id: 'what-is-blockchain',
            type: 'text',
            content: `
              <h2>What is Blockchain Technology?</h2>
              <p>A blockchain is a distributed digital ledger that stores data in blocks that are linked together chronologically and secured using cryptography. Think of it as a chain of digital "blocks" that contain records of transactions.</p>

              <h3>Key Characteristics</h3>
              <ul>
                <li><strong>Decentralization:</strong> No single entity controls the network</li>
                <li><strong>Transparency:</strong> All transactions are visible to network participants</li>
                <li><strong>Immutability:</strong> Once recorded, data cannot be altered</li>
                <li><strong>Security:</strong> Cryptographic principles ensure data integrity</li>
              </ul>

              <h3>How Blocks Work</h3>
              <p>Each block contains:</p>
              <ul>
                <li>Transaction data</li>
                <li>Timestamp</li>
                <li>Cryptographic hash of the previous block</li>
                <li>Nonce (number used in mining)</li>
              </ul>

              <h3>Real-World Applications</h3>
              <ul>
                <li>Cryptocurrencies</li>
                <li>Smart contracts</li>
                <li>Supply chain tracking</li>
                <li>Digital identity verification</li>
              </ul>
            `
          },
          {
            id: 'blockchain-quiz',
            type: 'quiz',
            content: '',
            quiz: {
              question: 'Which of these is NOT a key characteristic of blockchain technology?',
              options: [
                'Decentralization',
                'Centralized control',
                'Transparency',
                'Immutability'
              ],
              correctAnswer: 1,
              explanation: 'Centralized control is the opposite of what blockchain technology stands for. Blockchain is decentralized by nature, meaning no single entity has complete control over the network.'
            }
          }
        ]
      },
      {
        id: 'crypto-wallets',
        title: 'Understanding Crypto Wallets',
        description: 'Learn about different types of wallets and how to secure your assets',
        duration: '45 mins',
        xp: 150,
        content: [
          {
            id: 'wallet-types',
            type: 'text',
            content: `
              <h2>Cryptocurrency Wallets Explained</h2>
              <p>A cryptocurrency wallet is a digital tool that allows you to store, send, and receive digital currencies. Despite the name, crypto wallets don't actually store cryptocurrencies - they store the private keys that give you access to your crypto on the blockchain.</p>

              <h3>Types of Wallets</h3>
              <h4>Hot Wallets (Online)</h4>
              <ul>
                <li><strong>Software Wallets:</strong> Desktop or mobile applications</li>
                <li><strong>Web Wallets:</strong> Browser-based wallets</li>
                <li><strong>Exchange Wallets:</strong> Provided by cryptocurrency exchanges</li>
              </ul>

              <h4>Cold Wallets (Offline)</h4>
              <ul>
                <li><strong>Hardware Wallets:</strong> Physical devices like Ledger or Trezor</li>
                <li><strong>Paper Wallets:</strong> Physical documents containing keys</li>
              </ul>

              <h3>Security Best Practices</h3>
              <ul>
                <li>Never share your private keys</li>
                <li>Use strong passwords and 2FA</li>
                <li>Keep backup of recovery phrases</li>
                <li>Use multiple wallets for different purposes</li>
              </ul>
            `
          }
        ]
      }
    ]
  },
  {
    id: 'meme-trading',
    title: 'Meme Coin Trading Mastery',
    description: 'Learn the unique aspects of trading meme coins and managing risk.',
    level: 2,
    category: 'trading',
    icon: Zap,
    progress: 0,
    lessons: [
      {
        id: 'meme-fundamentals',
        title: 'Meme Coin Fundamentals',
        description: 'Understanding the unique nature of meme coins',
        duration: '40 mins',
        xp: 200,
        content: [
          {
            id: 'what-are-meme-coins',
            type: 'text',
            content: `
              <h2>Understanding Meme Coins</h2>
              <p>Meme coins are cryptocurrencies that originated from internet memes or have gained popularity through social media and community engagement. Unlike traditional cryptocurrencies, their value is often driven more by social sentiment than technical fundamentals.</p>

              <h3>Key Characteristics</h3>
              <ul>
                <li><strong>Community-Driven:</strong> Strong social media presence and engaged communities</li>
                <li><strong>High Volatility:</strong> Extreme price swings are common</li>
                <li><strong>Viral Nature:</strong> Can gain massive popularity quickly</li>
                <li><strong>Lower Market Cap:</strong> Generally smaller than major cryptocurrencies</li>
              </ul>

              <h3>Popular Meme Coins</h3>
              <ul>
                <li><strong>Dogecoin (DOGE):</strong> The original meme coin</li>
                <li><strong>Shiba Inu (SHIB):</strong> Self-proclaimed "Dogecoin killer"</li>
                <li><strong>BONK:</strong> Solana's popular meme token</li>
                <li><strong>PEPE:</strong> Based on the Pepe the Frog meme</li>
              </ul>

              <h3>Risk Factors</h3>
              <ul>
                <li>High price volatility</li>
                <li>Pump and dump schemes</li>
                <li>Limited utility</li>
                <li>Regulatory uncertainty</li>
              </ul>
            `
          }
        ]
      },
      {
        id: 'technical-analysis',
        title: 'Technical Analysis for Meme Coins',
        description: 'Learn to analyze meme coin charts effectively',
        duration: '60 mins',
        xp: 250,
        content: [
          {
            id: 'chart-patterns',
            type: 'text',
            content: `
              <h2>Technical Analysis for Meme Coins</h2>
              <p>While meme coins are known for their volatility, technical analysis can still provide valuable insights for trading decisions. However, traditional TA must be adapted for the unique characteristics of meme coins.</p>

              <h3>Key Technical Indicators</h3>
              <ul>
                <li><strong>Volume Analysis:</strong> Critical for meme coins</li>
                <li><strong>RSI (Relative Strength Index):</strong> Momentum indicator</li>
                <li><strong>MACD:</strong> Trend and momentum indicator</li>
                <li><strong>Bollinger Bands:</strong> Volatility indicator</li>
              </ul>

              <h3>Chart Patterns</h3>
              <ul>
                <li><strong>Support and Resistance:</strong> Key price levels</li>
                <li><strong>Trend Lines:</strong> Identifying market direction</li>
                <li><strong>Breakout Patterns:</strong> Potential price movements</li>
              </ul>

              <h3>Social Indicators</h3>
              <ul>
                <li>Social media sentiment analysis</li>
                <li>Trading volume vs social mentions</li>
                <li>Influencer activity tracking</li>
              </ul>
            `
          }
        ]
      }
    ]
  },
  {
    id: 'risk-management',
    title: 'Advanced Risk Management',
    description: 'Master the art of protecting your capital while trading meme coins.',
    level: 3,
    category: 'advanced',
    icon: Shield,
    progress: 0,
    lessons: [
      {
        id: 'position-sizing',
        title: 'Position Sizing and Risk Control',
        description: 'Learn how to properly size your trades',
        duration: '45 mins',
        xp: 200,
        content: [
          {
            id: 'risk-basics',
            type: 'text',
            content: `
              <h2>Position Sizing in Meme Coin Trading</h2>
              <p>Position sizing is crucial in meme coin trading due to the high volatility. Proper position sizing helps protect your capital while maximizing potential returns.</p>

              <h3>Key Concepts</h3>
              <ul>
                <li><strong>Risk per Trade:</strong> Never risk more than 1-2% per trade</li>
                <li><strong>Position Calculation:</strong> Based on stop loss distance</li>
                <li><strong>Portfolio Allocation:</strong> Diversification strategies</li>
                <li><strong>Risk:Reward Ratios:</strong> Minimum 1:2 recommended</li>
              </ul>

              <h3>Advanced Techniques</h3>
              <ul>
                <li>Scaling in and out of positions</li>
                <li>Multiple time frame analysis</li>
                <li>Correlation-based position sizing</li>
                <li>Volatility-adjusted sizing</li>
              </ul>
            `
          }
        ]
      }
    ]
  }
]

export default function LearnPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)

  const currentCourse = courses.find(c => c.id === selectedCourse)
  const currentLesson = currentCourse?.lessons.find(l => l.id === selectedLesson)

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Learning Center</h1>
          <p className="text-gray-400">Master meme coin trading through structured courses and hands-on practice</p>
        </div>

        {!selectedCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const Icon = course.icon
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className="text-left p-6 bg-[#1C2127]/50 rounded-xl backdrop-blur-md border border-[#2A2D35]/50 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 text-blue-400" />
                    <h2 className="text-xl font-semibold">{course.title}</h2>
                  </div>
                  <p className="text-gray-400 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Level {course.level}</span>
                    <span className="text-blue-400">{course.lessons.length} lessons</span>
                  </div>
                </button>
              )
            })}
          </div>
        ) : !selectedLesson ? (
          <div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="mb-6 text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Courses
            </button>
            
            <div className="grid gap-6">
              {currentCourse?.lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson.id)}
                  className="text-left p-6 bg-[#1C2127]/50 rounded-xl backdrop-blur-md border border-[#2A2D35]/50 hover:border-blue-500/30 transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                  <p className="text-gray-400 mb-4">{lesson.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{lesson.duration}</span>
                    <span className="text-blue-400">{lesson.xp} XP</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedLesson(null)}
              className="mb-6 text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Lessons
            </button>
            
            <div className="bg-[#1C2127]/50 rounded-xl backdrop-blur-md border border-[#2A2D35]/50 p-8">
              <h2 className="text-2xl font-bold mb-6">{currentLesson?.title}</h2>
              
              {currentLesson?.content.map(content => {
                if (content.type === 'text') {
                  return (
                    <div 
                      key={content.id}
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                  )
                }
                
                if (content.type === 'quiz') {
                  const quiz = content.quiz
                  return (
                    <div key={content.id} className="mt-8 p-6 bg-[#2A2D35]/30 rounded-xl">
                      <h3 className="text-xl font-semibold mb-4">Quiz Time!</h3>
                      <p className="mb-4">{quiz.question}</p>
                      <div className="space-y-3">
                        {quiz.options.map((option, index) => (
                          <button
                            key={index}
                            className="w-full p-4 text-left rounded-lg bg-[#1C2127]/50 hover:bg-[#1C2127] transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
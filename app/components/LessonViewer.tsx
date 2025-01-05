'use client'

import { useState } from 'react'
import { Play, CheckCircle, ArrowLeft, ArrowRight, Star, Award } from 'lucide-react'

interface LessonContent {
  id: string
  type: 'video' | 'text' | 'quiz' | 'interactive'
  content: string
  quiz?: {
    question: string
    options: string[]
    correctAnswer: number
  }
}

interface LessonViewerProps {
  lesson: {
    id: string
    title: string
    description: string
    duration: string
    xp: number
    content: LessonContent[]
  }
  onComplete: () => void
  onBack: () => void
}

export default function LessonViewer({ lesson, onComplete, onBack }: LessonViewerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [completed, setCompleted] = useState(false)

  const currentContent = lesson.content[currentStep]

  const handleNext = () => {
    if (currentStep < lesson.content.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else if (!completed) {
      setCompleted(true)
      onComplete()
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentContent.quiz) return
    
    const correct = selectedAnswer === currentContent.quiz.correctAnswer
    setIsCorrect(correct)
    
    if (correct) {
      setTimeout(handleNext, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Course
        </button>

        {completed ? (
          <div className="bg-[#1C2127]/50 rounded-xl p-8 backdrop-blur-md border border-[#2A2D35]/50 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-green-500/20">
                <Award className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Lesson Completed!</h2>
            <p className="text-gray-400 mb-6">You've earned {lesson.xp} XP</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Return to Course
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{lesson.title}</h1>
                  <p className="text-gray-400">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="h-5 w-5" />
                  <span>{lesson.xp} XP</span>
                </div>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${((currentStep + 1) / lesson.content.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50 mb-6">
              {currentContent.type === 'video' && (
                <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-6">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
              )}

              {currentContent.type === 'text' && (
                <div className="prose prose-invert max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
                </div>
              )}

              {currentContent.type === 'interactive' && (
                <div className="prose prose-invert max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400">This is an interactive section. In a full implementation, this would contain interactive elements like:</p>
                    <ul className="text-gray-400 mt-2 list-disc list-inside">
                      <li>Practice trading interface</li>
                      <li>Chart analysis tools</li>
                      <li>Position sizing calculator</li>
                      <li>Risk management simulator</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentContent.type === 'quiz' && currentContent.quiz && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">{currentContent.quiz.question}</h3>
                  <div className="space-y-3">
                    {currentContent.quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        className={`w-full p-4 rounded-lg border text-left transition-colors ${
                          selectedAnswer === index
                            ? isCorrect === null
                              ? 'border-blue-500 bg-blue-500/10'
                              : isCorrect
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-red-500 bg-red-500/10'
                            : 'border-[#2A2D35] hover:border-blue-500/50'
                        }`}
                        disabled={isCorrect !== null}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {selectedAnswer !== null && isCorrect === null && (
                    <button
                      onClick={handleAnswerSubmit}
                      className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                  {isCorrect === false && (
                    <p className="text-red-400">Try again!</p>
                  )}
                </div>
              )}

              {(currentContent.type !== 'quiz' || isCorrect) && (
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentStep > 0
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    {currentStep < lesson.content.length - 1 ? 'Next' : 'Complete Lesson'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm text-gray-400">
              <span>Step {currentStep + 1} of {lesson.content.length}</span>
              <span>{lesson.duration} remaining</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 
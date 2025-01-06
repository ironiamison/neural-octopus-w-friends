'use client'

import { useState } from 'react'
import { Play, CheckCircle, ArrowLeft, ArrowRight, Star, Award, Bot } from 'lucide-react'
import { motion } from 'framer-motion'

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
  const [completed, setCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const currentContent = lesson.content[currentStep]

  const handleNext = () => {
    if (currentStep < lesson.content.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else {
      setCompleted(true)
      onComplete()
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (isCorrect !== null) return // Prevent changing answer after submission
    setSelectedAnswer(index)
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentContent.quiz) return
    const correct = selectedAnswer === currentContent.quiz.correctAnswer
    setIsCorrect(correct)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {completed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-indigo-500/20 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Award className="h-12 w-12 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Lesson Completed!
          </h2>
          <p className="text-gray-400 mb-6">You've earned {lesson.xp} XP</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-indigo-500/25"
            >
              Return to Course
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  {lesson.title}
                </h1>
                <p className="text-gray-400">{lesson.description}</p>
              </div>
              <div className="flex items-center gap-2 text-indigo-400">
                <Star className="h-5 w-5" />
                <span>{lesson.xp} XP</span>
              </div>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / lesson.content.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20 mb-6"
          >
            {currentContent.type === 'video' && (
              <div className="aspect-video bg-[#1E222D] rounded-lg flex items-center justify-center mb-6 border border-indigo-500/20">
                <Play className="h-12 w-12 text-indigo-400" />
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
                <div className="mt-6 p-4 bg-[#1E222D] border border-indigo-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot className="w-5 h-5 text-indigo-400" />
                    <p className="text-indigo-400 font-medium">Interactive Learning Section</p>
                  </div>
                  <div className="space-y-2 text-gray-400">
                    <p>This section includes interactive elements such as:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Practice trading interface</li>
                      <li>Chart analysis tools</li>
                      <li>Position sizing calculator</li>
                      <li>Risk management simulator</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentContent.type === 'quiz' && currentContent.quiz && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">{currentContent.quiz.question}</h3>
                <div className="space-y-3">
                  {currentContent.quiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 rounded-lg border text-left transition-all duration-300 ${
                        selectedAnswer === index
                          ? isCorrect === null
                            ? 'bg-indigo-500/20 border-indigo-500'
                            : isCorrect
                            ? 'bg-green-500/20 border-green-500'
                            : 'bg-red-500/20 border-red-500'
                          : 'bg-[#1E222D] border-gray-800 hover:border-indigo-500/50'
                      }`}
                      disabled={isCorrect !== null}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer === index && isCorrect !== null && (
                          <CheckCircle className={`w-5 h-5 ${isCorrect ? 'text-green-400' : 'text-red-400'}`} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedAnswer !== null && isCorrect === null && (
                  <button
                    onClick={handleAnswerSubmit}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Submit Answer
                  </button>
                )}

                {isCorrect === true && (
                  <div className="p-4 rounded-lg bg-green-500/20 border border-green-500 text-green-400">
                    Correct! Well done!
                  </div>
                )}

                {isCorrect === false && (
                  <div className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-400">
                    Try again!
                  </div>
                )}
              </div>
            )}

            {(currentContent.type !== 'quiz' || isCorrect) && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentStep > 0
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                >
                  {currentStep < lesson.content.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    'Complete Lesson'
                  )}
                </button>
              </div>
            )}
          </motion.div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>Step {currentStep + 1} of {lesson.content.length}</span>
            <span>{lesson.duration} remaining</span>
          </div>
        </>
      )}
    </div>
  )
} 
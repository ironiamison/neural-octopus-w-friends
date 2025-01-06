'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MotionDiv, MotionA } from './motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LearningModule, Resource } from '../types/learning';
import { ChevronDown, ChevronUp, CheckCircle2, Trophy, Brain, Lock, Info, Clock, BookOpen, Target, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AnimatedCardProps {
  module: LearningModule;
  index: number;
  isLocked?: boolean;
  isCompleted?: boolean;
  completedResources: Set<number>;
  onModuleComplete?: () => Promise<void>;
  onProgressUpdate?: (progress: number) => void;
  onResourceComplete?: (resourceIndex: number) => void;
  pendingUnlockTime?: number;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ResourceState {
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
}

export default function AnimatedCard({ 
  module, 
  index, 
  isLocked = false, 
  isCompleted = false,
  completedResources,
  onModuleComplete,
  onProgressUpdate,
  onResourceComplete,
  pendingUnlockTime 
}: AnimatedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResourceSummary, setShowResourceSummary] = useState<number | null>(null);
  const [resourceStates, setResourceStates] = useState<Record<string, ResourceState>>({});
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const quiz: Quiz = {
    question: `What is the key concept in ${module.title}?`,
    options: [
      'Understanding market trends',
      'Managing risk effectively',
      'Technical analysis',
      'Fundamental research'
    ],
    correctAnswer: 0
  };

  useEffect(() => {
    // Verify resource URLs on client side
    const checkResources = async () => {
      const states: Record<string, ResourceState> = {};
      
      for (const resource of module.resources) {
        states[resource.url] = {
          isLoading: true,
          error: null,
          isValid: false
        };
        
        try {
          const response = await fetch(resource.url, { method: 'HEAD' });
          states[resource.url] = {
            isLoading: false,
            error: null,
            isValid: response.ok
          };
        } catch (error) {
          states[resource.url] = {
            isLoading: false,
            error: 'Resource unavailable',
            isValid: false
          };
        }
      }
      
      setResourceStates(states);
    };

    if (!isLocked) {
      checkResources();
    }
  }, [module.resources, isLocked]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (pendingUnlockTime) {
      const updateTimeRemaining = () => {
        const now = Date.now();
        const remaining = Math.max(0, pendingUnlockTime - now);
        
        if (remaining === 0) {
          clearInterval(interval);
          setTimeRemaining('');
          return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      };

      updateTimeRemaining();
      interval = setInterval(updateTimeRemaining, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [pendingUnlockTime]);

  const handleResourceComplete = (idx: number) => {
    if (onResourceComplete) {
      onResourceComplete(idx);
    }
  };

  const handleAnswerSelect = async (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setIsCorrect(answerIndex === quiz.correctAnswer);
    
    if (answerIndex === quiz.correctAnswer && onProgressUpdate) {
      // Update progress in parent component
      const newProgress = Math.min(module.progress + 10, 100);
      onProgressUpdate(newProgress);

      // Check if module should be completed
      if (newProgress === 100 && onModuleComplete) {
        try {
          await onModuleComplete();
        } catch (error) {
          console.error('Error completing module:', error);
        }
      }
    }
  };

  const handleResourceClick = async (e: React.MouseEvent, resource: Resource, idx: number) => {
    e.preventDefault();
    if (isLocked) return;

    const state = resourceStates[resource.url];
    if (state?.isValid) {
      window.open(resource.url, '_blank');
      handleResourceComplete(idx);
    }
  };

  const previewContent = (
    <div className="space-y-3 p-2 max-w-[300px]">
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-indigo-400" />
        <span>{module.estimatedTime}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <BookOpen className="w-4 h-4 text-purple-400" />
        <span>{module.resources.length} Learning Resources</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Target className="w-4 h-4 text-pink-400" />
        <span>Key Topics:</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {module.topics.map((topic) => (
          <Badge
            key={topic}
            variant="outline"
            className="text-xs bg-[#1E222D]/50 backdrop-blur-md border-indigo-500/50 text-indigo-400"
          >
            {topic}
          </Badge>
        ))}
      </div>
      {isLocked && (
        <div className="flex items-center gap-2 text-sm text-indigo-400">
          <Lock className="w-4 h-4" />
          <span>Complete previous modules to unlock</span>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              layout
              className={isLocked ? 'opacity-75 cursor-not-allowed' : ''}
            >
              <Card className="bg-[#1E222D]/50 backdrop-blur-md border-gray-800 hover:border-indigo-500/50 transition-all duration-300 h-full relative overflow-hidden">
                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                      {timeRemaining ? (
                        <p className="text-sm text-gray-400">
                          Unlocks in {timeRemaining}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">Complete previous modules to unlock</p>
                      )}
                    </div>
                  </div>
                )}
                
                <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                  <div className="flex items-center justify-between mb-2">
                    <MotionDiv
                      animate={{ rotate: isExpanded ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                    >
                      {module.icon}
                    </MotionDiv>
                    <Badge
                      variant="outline"
                      className={`
                        bg-[#1E222D]/50 backdrop-blur-md border-indigo-500/50
                        ${module.difficulty === 'Beginner' ? 'text-green-400' :
                          module.difficulty === 'Intermediate' ? 'text-yellow-400' :
                          'text-red-400'} 
                      `}
                    >
                      <span>{module.difficulty}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                      {module.title}
                    </CardTitle>
                    <MotionDiv
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-indigo-400" />}
                    </MotionDiv>
                  </div>
                  <p className="text-sm text-gray-400">{module.description}</p>
                </CardHeader>

                <MotionDiv
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Section */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-400">{module.progress}%</span>
                            {module.progress === 100 && (
                              <MotionDiv
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                <Trophy className="w-4 h-4 text-yellow-400" />
                              </MotionDiv>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <motion.div 
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${module.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Estimated time:</span>
                        <span>{module.estimatedTime}</span>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic: string) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="bg-[#1E222D]/50 backdrop-blur-md text-xs border-indigo-500/50 text-indigo-400"
                          >
                            <span>{topic}</span>
                          </Badge>
                        ))}
                      </div>

                      {/* Learning Resources with Summaries */}
                      <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-medium text-gray-400">Learning Resources:</h4>
                        {module.resources.map((resource: Resource, idx: number) => (
                          <MotionDiv key={idx} className="space-y-2">
                            <MotionA
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block p-3 rounded-lg bg-[#1E222D]/50 backdrop-blur-md border border-gray-800 transition-all duration-300 ${
                                resourceStates[resource.url]?.isValid 
                                  ? 'hover:border-indigo-500/50' 
                                  : 'opacity-50 cursor-not-allowed'
                              }`}
                              whileHover={{ scale: resourceStates[resource.url]?.isValid ? 1.01 : 1 }}
                              onClick={(e) => handleResourceClick(e, resource, idx)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{resource.title}</span>
                                  {resourceStates[resource.url]?.isLoading && (
                                    <MotionDiv
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                                    </MotionDiv>
                                  )}
                                  {resourceStates[resource.url]?.error && (
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                  )}
                                  {completedResources?.has(idx) && (
                                    <MotionDiv
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring" }}
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    </MotionDiv>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs bg-[#1E222D]/50 backdrop-blur-md border-indigo-500/50 text-indigo-400"
                                  >
                                    <span>{resource.provider}</span>
                                  </Badge>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowResourceSummary(showResourceSummary === idx ? null : idx);
                                    }}
                                    className="p-1 hover:bg-indigo-500/10 rounded-full transition-colors"
                                  >
                                    <Info className="w-4 h-4 text-indigo-400" />
                                  </button>
                                </div>
                              </div>
                              {resourceStates[resource.url]?.error && (
                                <p className="text-xs text-red-400 mt-1">
                                  {resourceStates[resource.url]?.error}
                                </p>
                              )}
                            </MotionA>
                            
                            {/* Resource Summary */}
                            {showResourceSummary === idx && (
                              <MotionDiv
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-[#1E222D]/50 backdrop-blur-md rounded-lg border border-indigo-500/20 text-sm text-gray-400"
                              >
                                {resource.summary}
                              </MotionDiv>
                            )}
                          </MotionDiv>
                        ))}
                      </div>

                      {/* Quiz Section */}
                      <div className="mt-6">
                        <button
                          onClick={() => setShowQuiz(!showQuiz)}
                          className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <Brain className="w-4 h-4" />
                          {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
                        </button>

                        {showQuiz && (
                          <MotionDiv
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-[#1E222D]/50 backdrop-blur-md rounded-lg border border-indigo-500/20"
                          >
                            <p className="font-medium mb-4">{quiz.question}</p>
                            <div className="space-y-2">
                              {quiz.options.map((option, idx) => (
                                <MotionDiv
                                  key={idx}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <button
                                    onClick={() => handleAnswerSelect(idx)}
                                    className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                                      selectedAnswer === idx
                                        ? selectedAnswer === quiz.correctAnswer
                                          ? 'bg-green-500/20 border border-green-500 text-green-400'
                                          : 'bg-red-500/20 border border-red-500 text-red-400'
                                        : 'bg-[#1E222D] border border-gray-800 hover:border-indigo-500/50'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                </MotionDiv>
                              ))}
                            </div>
                            {isCorrect !== null && (
                              <MotionDiv
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`mt-4 text-sm ${
                                  isCorrect ? 'text-green-400' : 'text-red-400'
                                }`}
                              >
                                {isCorrect
                                  ? '🎉 Correct! Well done!'
                                  : '❌ Not quite right. Try again!'}
                              </MotionDiv>
                            )}
                          </MotionDiv>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </MotionDiv>
              </Card>
            </MotionDiv>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-[#1E222D]/50 backdrop-blur-md border-indigo-500/20 shadow-xl"
        >
          {previewContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 
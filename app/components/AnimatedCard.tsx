'use client';

import { useState, useEffect } from 'react';
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
  onModuleComplete?: () => void;
  onProgressUpdate?: (progress: number) => void;
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

export default function AnimatedCard({ module, index, isLocked = false, onModuleComplete }: AnimatedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(module.progress);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedResources, setCompletedResources] = useState<Set<number>>(new Set());
  const [showResourceSummary, setShowResourceSummary] = useState<number | null>(null);
  const [resourceStates, setResourceStates] = useState<Record<string, ResourceState>>({});

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

  const handleResourceComplete = (idx: number) => {
    const newCompleted = new Set(completedResources);
    newCompleted.add(idx);
    setCompletedResources(newCompleted);
    
    const newProgress = Math.round((newCompleted.size / module.resources.length) * 100);
    if (newProgress === 100 && onModuleComplete) {
      onModuleComplete();
    }
    setCurrentProgress(newProgress);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setIsCorrect(answerIndex === quiz.correctAnswer);
    
    if (answerIndex === quiz.correctAnswer) {
      const newProgress = Math.min(currentProgress + 10, 100);
      if (newProgress === 100 && onModuleComplete) {
        onModuleComplete();
      }
      setCurrentProgress(newProgress);
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
        <Clock className="w-4 h-4" />
        <span>{module.estimatedTime}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <BookOpen className="w-4 h-4" />
        <span>{module.resources.length} Learning Resources</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Target className="w-4 h-4" />
        <span>Key Topics:</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {module.topics.map((topic) => (
          <Badge
            key={topic}
            variant="outline"
            className="text-xs bg-[#131722] border-[#2A2D35]"
          >
            {topic}
          </Badge>
        ))}
      </div>
      {isLocked && (
        <div className="flex items-center gap-2 text-sm text-yellow-500">
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
              className={isLocked ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Card className="bg-[#1E222D] border-[#2A2D35] h-full relative overflow-hidden">
                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Complete previous modules to unlock</p>
                    </div>
                  </div>
                )}
                
                <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                  <div className="flex items-center justify-between mb-2">
                    <MotionDiv
                      animate={{ rotate: isExpanded ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {module.icon}
                    </MotionDiv>
                    <Badge
                      variant="outline"
                      className={`
                        ${module.difficulty === 'Beginner' ? 'text-green-500' :
                          module.difficulty === 'Intermediate' ? 'text-yellow-500' :
                          'text-red-500'} 
                        border-[#2A2D35]
                      `}
                    >
                      <span>{module.difficulty}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                    <MotionDiv
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </MotionDiv>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
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
                          <span className="text-muted-foreground">Progress</span>
                          <div className="flex items-center gap-2">
                            <span>{currentProgress}%</span>
                            {currentProgress === 100 && (
                              <MotionDiv
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                <Trophy className="w-4 h-4 text-yellow-500" />
                              </MotionDiv>
                            )}
                          </div>
                        </div>
                        <Progress value={currentProgress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Estimated time:</span>
                        <span>{module.estimatedTime}</span>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic: string) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="bg-[#131722] text-xs border-[#2A2D35]"
                          >
                            <span>{topic}</span>
                          </Badge>
                        ))}
                      </div>

                      {/* Learning Resources with Summaries */}
                      <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-medium">Learning Resources:</h4>
                        {module.resources.map((resource: Resource, idx: number) => (
                          <MotionDiv key={idx} className="space-y-2">
                            <MotionA
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block p-2 rounded-md bg-[#131722] transition-colors ${
                                resourceStates[resource.url]?.isValid 
                                  ? 'hover:bg-[#2A2D35]' 
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
                                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                                    </MotionDiv>
                                  )}
                                  {resourceStates[resource.url]?.error && (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                  )}
                                  {completedResources.has(idx) && (
                                    <MotionDiv
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring" }}
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </MotionDiv>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <span>{resource.provider}</span>
                                  </Badge>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowResourceSummary(showResourceSummary === idx ? null : idx);
                                    }}
                                    className="p-1 hover:bg-[#2A2D35] rounded-full transition-colors"
                                  >
                                    <Info className="w-4 h-4" />
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
                                className="p-3 bg-[#131722] rounded-md text-sm text-muted-foreground"
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
                          className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Brain className="w-4 h-4" />
                          {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
                        </button>

                        {showQuiz && (
                          <MotionDiv
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-[#131722] rounded-lg"
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
                                    className={`w-full p-3 rounded-md text-left transition-colors ${
                                      selectedAnswer === idx
                                        ? selectedAnswer === quiz.correctAnswer
                                          ? 'bg-green-500/20 text-green-400'
                                          : 'bg-red-500/20 text-red-400'
                                        : 'bg-[#1E222D] hover:bg-[#2A2D35]'
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
          className="bg-[#1E222D] border-[#2A2D35] shadow-xl"
        >
          {previewContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 
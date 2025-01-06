import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LearningModule, Resource } from '../types/learning';
import { useWallet } from './WalletProvider';
import { userService } from '../lib/services/user.service';

interface LearningContextType {
  completedModules: string[];
  unlockedModules: string[];
  userProgress: Record<string, number>;
  completedResources: Set<number>;
  pendingUnlocks: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  handleModuleComplete: (moduleId: string) => Promise<void>;
  handleProgressUpdate: (moduleId: string, progress: number) => void;
  handleResourceComplete: (moduleId: string, resourceIndex: number) => void;
  isModuleCompleted: (moduleId: string) => boolean;
  isModuleLocked: (moduleId: string, index: number) => boolean;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

interface LearningProviderProps {
  children: ReactNode;
  modules: LearningModule[];
}

export function LearningProvider({ children, modules }: LearningProviderProps) {
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [unlockedModules, setUnlockedModules] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [completedResources, setCompletedResources] = useState<Set<number>>(new Set());
  const [moduleUnlockTimers, setModuleUnlockTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [pendingUnlocks, setPendingUnlocks] = useState<Record<string, number>>({});

  // Initialize state from localStorage and profile
  useEffect(() => {
    const loadState = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load from localStorage
        const savedState = loadFromLocalStorage();
        
        // Load from profile if wallet connected
        if (publicKey) {
          const profileState = await loadFromProfile(publicKey);
          // Merge states, preferring the most recent data
          mergeStates(savedState, profileState);
        } else if (savedState) {
          // Apply localStorage state
          setCompletedModules(savedState.completed);
          setUnlockedModules(savedState.unlocked);
          setUserProgress(savedState.progress);
          setCompletedResources(savedState.resources);
        } else {
          // Initialize default state if no saved state exists
          initializeDefaultState();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load learning progress');
        // Fall back to initial state
        initializeDefaultState();
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, [publicKey]);

  // Auto-save state changes
  useEffect(() => {
    const saveState = async () => {
      try {
        // Save to localStorage
        saveToLocalStorage();
        // Save to profile if wallet connected
        if (publicKey) {
          await saveToProfile();
        }
      } catch (err) {
        console.error('Failed to save learning progress:', err);
      }
    };

    const debounceTimer = setTimeout(saveState, 1000);
    return () => clearTimeout(debounceTimer);
  }, [completedModules, unlockedModules, userProgress, completedResources]);

  // Helper functions
  const loadFromLocalStorage = () => {
    try {
      const savedCompleted = localStorage.getItem('completed-modules');
      const savedUnlocked = localStorage.getItem('unlocked-modules');
      const savedProgress = localStorage.getItem('module-progress');
      const savedResources = localStorage.getItem('completed-resources');

      return {
        completed: savedCompleted ? JSON.parse(savedCompleted) : [],
        unlocked: savedUnlocked ? JSON.parse(savedUnlocked) : modules.slice(0, 3).map(m => m.id),
        progress: savedProgress ? JSON.parse(savedProgress) : {},
        resources: savedResources ? new Set(JSON.parse(savedResources)) : new Set()
      };
    } catch (err) {
      console.error('Error loading from localStorage:', err);
      return null;
    }
  };

  const loadFromProfile = async (publicKey: string) => {
    try {
      const profile = await userService.getProfile(publicKey);
      return profile?.learningProgress;
    } catch (err) {
      console.error('Error loading from profile:', err);
      return null;
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('completed-modules', JSON.stringify(completedModules));
      localStorage.setItem('unlocked-modules', JSON.stringify(unlockedModules));
      localStorage.setItem('module-progress', JSON.stringify(userProgress));
      localStorage.setItem('completed-resources', JSON.stringify(Array.from(completedResources)));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };

  const saveToProfile = async () => {
    if (!publicKey) return;

    try {
      await userService.updateProfile(publicKey, {
        learningProgress: {
          completedModules,
          unlockedModules,
          progress: userProgress,
          completedResources: Array.from(completedResources)
        }
      });
    } catch (err) {
      console.error('Error saving to profile:', err);
    }
  };

  const mergeStates = (localState: any, profileState: any) => {
    if (!localState && !profileState) {
      initializeDefaultState();
      return;
    }

    const state = {
      completed: new Set([
        ...(localState?.completed || []),
        ...(profileState?.completedModules || [])
      ]),
      unlocked: new Set([
        ...(localState?.unlocked || []),
        ...(profileState?.unlockedModules || [])
      ]),
      progress: {
        ...(localState?.progress || {}),
        ...(profileState?.progress || {})
      },
      resources: new Set([
        ...(localState?.resources || []),
        ...(profileState?.completedResources || [])
      ])
    };

    setCompletedModules(Array.from(state.completed));
    setUnlockedModules(Array.from(state.unlocked));
    setUserProgress(state.progress);
    setCompletedResources(state.resources);
  };

  const initializeDefaultState = () => {
    const initialUnlocked = modules.slice(0, 3).map(m => m.id);
    setCompletedModules([]);
    setUnlockedModules(initialUnlocked);
    setUserProgress({});
    setCompletedResources(new Set());
  };

  const value = {
    completedModules,
    unlockedModules,
    userProgress,
    completedResources,
    pendingUnlocks,
    isLoading,
    error,
    handleModuleComplete: async (moduleId: string) => {
      // Implementation
    },
    handleProgressUpdate: (moduleId: string, progress: number) => {
      // Implementation
    },
    handleResourceComplete: (moduleId: string, resourceIndex: number) => {
      // Implementation
    },
    isModuleCompleted: (moduleId: string) => {
      // Implementation
      return false;
    },
    isModuleLocked: (moduleId: string, index: number) => {
      // Implementation
      return false;
    }
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
} 
export interface Resource {
  title: string;
  url: string;
  type: 'course' | 'article' | 'research' | 'documentation' | 'interactive' | 'guide' | 'tool' | 'video';
  provider: string;
  summary: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  topics: string[];
  source: 'a16z' | 'platform';
  resources: Resource[];
} 
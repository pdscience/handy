// Alphabet Model
export interface AlphabetItem {
  letter: string;
  word: string;
  icon: string;
}

// Routine Models
export interface RoutineItem {
  icon: string;
  text: string;
  period: 'morning' | 'afternoon' | 'night';
  index: number;
}

export interface RoutineProgress {
  period: string;
  completedCount: number;
  totalCount: number;
  completedItems: boolean[];
  progress: number;
  progressText: string;
  isCompleted: boolean;
}

// Conversation Models
export interface ConversationItem {
  icon: string;
  text: string;
  category: string;
  color?: string;
}

export type ConversationCategory = 'greetings' | 'needs' | 'health' | 'activities' | 'family' | 'places';

// Interactive Models
export interface InteractiveItem {
  name: string;
  icon: string;
  category: string;
  color?: string;
  type?: string;
}

export type InteractiveCategory = 'shapes' | 'colors' | 'animals' | 'fruits' | 'foods' | 'numbers' | 'vegetables' | 'household';

// Navigation
export type TabName = 'home' | 'conversation' | 'routines' | 'writer' | 'interactive';

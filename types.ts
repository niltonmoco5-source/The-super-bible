
export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type RecurrenceType = 'daily' | 'weekdays' | 'weekends';
export type NotificationSound = 'harp' | 'bell' | 'nature' | 'none';

export interface RoutineItem {
  id: string;
  title: string;
  type: 'leitura' | 'oração';
  time: string;
  completed: boolean;
  reminderActive: boolean;
  sound: NotificationSound;
  recurrence: RecurrenceType;
}

export type ExperienceCategory = 'fé' | 'cura' | 'gratidão' | 'superação' | 'provisão' | 'paz' | 'família';

export interface Experience {
  id: string;
  author: string;
  text: string;
  reference?: string;
  likes: number;
  timestamp: number;
  category: ExperienceCategory;
}

export type UserTier = 'trial' | 'pro' | 'blessed';

export interface SubscriptionInfo {
  tier: UserTier;
  startDate: number;
  isExpired: boolean;
}

export enum AppSection {
  CHAT = 'chat',
  ROUTINE = 'routine',
  SITUATIONS = 'situations',
  RESOURCES = 'resources',
  BIBLE_SEARCH = 'bible_search',
  FAVORITES = 'favorites',
  COMMUNITY = 'community',
  PRICING = 'pricing'
}

export interface Situation {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

export interface FavoritePassage {
  id: string;
  query: string;
  content: string;
  timestamp: number;
}

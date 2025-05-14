
export type MediaType = 'image' | 'audio' | 'video';

export interface Media {
  type: MediaType;
  url: string;
  caption?: string;
}

export interface Answer {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'media-first';
  media?: Media;
  answers?: Answer[];
  correctAnswer?: string; // For open-ended questions
  multipleCorrect?: boolean;
  mediaAnswer?: Media; // Optional media for answer slide
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
}

export interface Round {
  id: number;
  title: string;
  description: string;
  isSpecial: boolean; // Whether it's a "Choose Yourself" round
  isRapidFire?: boolean; // New property for Rapid Fire rounds
  questions?: Question[]; // For regular rounds
  subjects?: Subject[]; // For "Choose Yourself" rounds
}

export type SlideType = 
  | 'authentication'
  | 'welcome'
  | 'roundSelection'
  | 'roundIntroduction'
  | 'rules'
  | 'question'
  | 'question-media' // New slide type for media first
  | 'answer'
  | 'endOfRound'
  | 'subjectSelection';

export interface SlideState {
  type: SlideType;
  roundId?: number;
  questionIndex?: number;
  subjectId?: string;
  showMedia?: boolean;
}

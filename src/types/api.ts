export interface User {
  id: string;
  name: string | null;
  email: string | null;
  specialty: string | null;
  hospital: string | null;
  phone: string;
}

export interface Guideline {
  id: string;
  title: string;
  description: string;
  specialty: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  specialty: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Calculator {
  id: string;
  title: string;
  description: string;
  specialty: string;
  formula: string;
  parameters: {
    name: string;
    type: 'number' | 'select';
    options?: string[];
    unit?: string;
    min?: number;
    max?: number;
  }[];
  tags: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  specialty: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  tags: string[];
} 
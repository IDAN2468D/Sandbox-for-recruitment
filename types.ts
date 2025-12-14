export interface JobDescription {
  title: string;
  summary: string; // Keep for backward compatibility or use as "Role Summary"
  aboutUs: string; // New
  keySellingPoints: string[]; // New
  responsibilities: string[];
  hardSkills: string[]; // Includes placeholder logic
  niceToHaves: string[]; // New
  softSkills: string[];
  whatWeOffer: string[]; // New: Culture & Benefits broken down
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface InterviewQuestion {
  id: string;
  question: string;
  targetSkill: string;
  type: "Hard Skill" | "Soft Skill" | "Problem Solving" | "Conflict Resolution" | "DEI";
}

export interface CandidateProfile {
  id: string;
  type: "High-Potential Junior" | "Core Mid-Level" | "Veteran Specialist";
  description: string;
  keySellingPoint: string;
  redFlag: string;
}

// --- Advanced Assets ---

export interface OutreachMessage {
  headline: string;
  content: string;
}

export interface KPI {
  timeframe: string;
  goal: string;
}

export interface BiasItem {
  originalText: string;
  biasType: string;
  suggestion: string;
}

// Feature 6
export interface HiringChallenge {
  objective: string;
  deliverables: string[];
  duration: string;
  evaluationCriteria: string[];
}

// Feature 7
export interface ScreeningQuestion {
  category: string; // e.g. "Compensation", "Availability"
  question: string;
}

// Feature 8
export interface OnboardingPlan {
  week1: string[];
  day30Milestone: string;
}

// Feature 9
export interface CompAnalysis {
  competitiveAdvantages: string[];
  negotiationTactic: string;
}

// Feature 10
export interface Stakeholder {
  role: string;
  collaborationGoal: string;
}

export interface AdvancedAssets {
  outreachMessage: OutreachMessage;
  successMetrics: KPI[];
  biasAnalysis: BiasItem[];
  hiringChallenge: HiringChallenge;
  screeningQuestions: ScreeningQuestion[];
  onboardingPlan: OnboardingPlan;
  compAnalysis: CompAnalysis;
  stakeholderMap: Stakeholder[];
}

export interface GeneratedAssets {
  jobDescription?: JobDescription;
  interviewQuestions?: InterviewQuestion[];
  candidateProfiles?: CandidateProfile[];
  advancedAssets?: AdvancedAssets;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
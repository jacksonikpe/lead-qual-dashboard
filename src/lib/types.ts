export type LeadSource = "email" | "typeform" | "whatsapp" | "linkedin";

export type QualificationStatus =
  | "pending"
  | "qualified"
  | "disqualified"
  | "reviewing";

export interface Lead {
  id: string;
  source: LeadSource;
  timestamp: Date;
  rawData: {
    name?: string;
    email?: string;
    company?: string;
    message: string;
    phone?: string;
  };
  // AI-generated fields (nullable until processed)
  qualification?: {
    score: number; // 0-100
    status: QualificationStatus;
    reasoning: string;
    signals: {
      hasBudget: boolean;
      hasTimeline: boolean;
      hasAuthority: boolean;
      hasNeed: boolean;
    };
    extractedData: {
      budgetRange?: string;
      timeline?: string;
      role?: string;
      painPoints: string[];
    };
  };
  // User overrides
  manualOverride?: {
    status: QualificationStatus;
    reason: string;
    timestamp: Date;
  };
  notes?: string;
}

export interface LeadStats {
  total: number;
  pending: number;
  qualified: number;
  disqualified: number;
  avgScore: number;
}

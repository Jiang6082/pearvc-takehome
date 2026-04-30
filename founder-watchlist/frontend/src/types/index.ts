export type Status = "WATCHING" | "WARM" | "ACTIVE" | "PASSED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type SignalType = "JOB_CHANGE" | "COMPANY_STARTED" | "PRODUCT_LAUNCH" | "FUNDRAISING" | "HIRING" | "COFOUNDER_SEARCH" | "SOCIAL_TRACTION" | "COMPANY_PIVOT" | "MANUAL";

export type User = { id: string; name: string; email: string; role?: string };
export type Tag = { id: string; name: string };
export type Tracking = { id: string; userId: string; founderId: string; status: Status; priority: Priority; privateNotes?: string | null; lastContactedAt?: string | null; isOwner: boolean; user?: User };
export type UpdateSignal = { id: string; founderId: string; signalType: SignalType; title: string; description: string; sourceName?: string | null; sourceUrl?: string | null; confidenceScore: number; isDismissed: boolean; isImportant: boolean; detectedAt: string; founder?: Founder };
export type SharedNote = { id: string; founderId: string; authorId: string; body: string; createdAt: string; updatedAt: string; author: User };

export type Founder = {
  id: string;
  fullName: string;
  linkedinUrl?: string | null;
  email?: string | null;
  currentTitle?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  bio?: string | null;
  createdAt: string;
  tags: Tag[];
  trackingRelationships?: Tracking[];
  sharedNotes?: SharedNote[];
  updates?: UpdateSignal[];
  trackingCount?: number;
  primaryOwner?: User | null;
  latestUpdate?: UpdateSignal | null;
  myTracking?: Tracking | null;
};

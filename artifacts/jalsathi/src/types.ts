export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Pending' | 'Assigned' | 'Resolved';
export type ProblemType = 'Handpump Broken' | 'Borewell Failure' | 'No Water Supply' | 'Tanker Required';

export interface Issue {
  id: string;
  village: string;
  region: string;
  regionZone: string;
  problem: ProblemType;
  urgency: UrgencyLevel;
  status: Status;
  details?: string;
  reportedAt: Date;
  priorityScore: number;
  suggestedAction: string;
  peopleAffected: number;
}

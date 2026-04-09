import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Issue, ProblemType, UrgencyLevel, Status } from '../types';

const REGION_ZONES: Record<string, string> = {
  'Rajasthan': 'Drought-Prone Zone',
  'Haryana': 'High Groundwater Usage',
  'Delhi NCR': 'Urban Water Stress',
};

const SUGGESTED_ACTIONS: Record<UrgencyLevel, string> = {
  'Critical': 'Deploy water tanker immediately',
  'High': 'Repair within 24 hours',
  'Medium': 'Schedule inspection this week',
  'Low': 'Monitor situation',
};

const PEOPLE_AFFECTED: Record<UrgencyLevel, [number, number]> = {
  'Critical': [600, 1200],
  'High': [200, 500],
  'Medium': [80, 200],
  'Low': [20, 80],
};

const SCORE_RANGES: Record<UrgencyLevel, [number, number]> = {
  'Critical': [90, 100],
  'High': [70, 89],
  'Medium': [40, 69],
  'Low': [10, 39],
};

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function computePriorityScore(urgency: UrgencyLevel): number {
  const [min, max] = SCORE_RANGES[urgency];
  return randInt(min, max);
}

export function computePeopleAffected(urgency: UrgencyLevel): number {
  const [min, max] = PEOPLE_AFFECTED[urgency];
  return randInt(min, max);
}

const MOCK_ISSUES: Issue[] = [
  {
    id: 'JL-8492',
    village: 'Ramgarh',
    region: 'Rajasthan',
    regionZone: 'Drought-Prone Zone',
    problem: 'Handpump Broken',
    urgency: 'Medium',
    status: 'Pending',
    details: 'The main handpump near the panchayat building is completely dry.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    priorityScore: 54,
    suggestedAction: 'Schedule inspection this week',
    peopleAffected: 130,
    reportsCount: 2,
  },
  {
    id: 'JL-1029',
    village: 'Nangal',
    region: 'Haryana',
    regionZone: 'High Groundwater Usage',
    problem: 'No Water Supply',
    urgency: 'Critical',
    status: 'Assigned',
    details: 'Entire village has not received piped water for 4 days.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    priorityScore: 96,
    suggestedAction: 'Deploy water tanker immediately',
    peopleAffected: 980,
    reportsCount: 6,
  },
  {
    id: 'JL-5531',
    village: 'Mandawar',
    region: 'Delhi NCR',
    regionZone: 'Urban Water Stress',
    problem: 'Borewell Failure',
    urgency: 'High',
    status: 'Pending',
    details: 'Motor seems burnt out. Needs urgent replacement.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    priorityScore: 81,
    suggestedAction: 'Repair within 24 hours',
    peopleAffected: 340,
    reportsCount: 3,
  },
  {
    id: 'JL-2294',
    village: 'Pataudi',
    region: 'Haryana',
    regionZone: 'High Groundwater Usage',
    problem: 'Tanker Required',
    urgency: 'Medium',
    status: 'Resolved',
    details: 'Summer shortage, need weekly tanker delivery for the outer wards.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    priorityScore: 47,
    suggestedAction: 'Schedule inspection this week',
    peopleAffected: 95,
    reportsCount: 1,
  },
  {
    id: 'JL-9930',
    village: 'Lalsot',
    region: 'Rajasthan',
    regionZone: 'Drought-Prone Zone',
    problem: 'No Water Supply',
    urgency: 'Critical',
    status: 'Pending',
    details: 'Pipeline broke during road construction.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 30),
    priorityScore: 93,
    suggestedAction: 'Deploy water tanker immediately',
    peopleAffected: 1150,
    reportsCount: 8,
  },
  {
    id: 'JL-4122',
    village: 'Khekra',
    region: 'Delhi NCR',
    regionZone: 'Urban Water Stress',
    problem: 'Handpump Broken',
    urgency: 'Low',
    status: 'Assigned',
    details: 'Handle is loose, needs minor repair.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    priorityScore: 22,
    suggestedAction: 'Monitor situation',
    peopleAffected: 35,
    reportsCount: 1,
  },
  {
    id: 'JL-7718',
    village: 'Rewari',
    region: 'Haryana',
    regionZone: 'High Groundwater Usage',
    problem: 'Borewell Failure',
    urgency: 'High',
    status: 'Resolved',
    details: 'Silt accumulation blocking the pump.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    priorityScore: 75,
    suggestedAction: 'Repair within 24 hours',
    peopleAffected: 270,
    reportsCount: 2,
  },
  {
    id: 'JL-3055',
    village: 'Faridpur',
    region: 'Haryana',
    regionZone: 'High Groundwater Usage',
    problem: 'Tanker Required',
    urgency: 'Critical',
    status: 'Assigned',
    details: 'Emergency requested for the upcoming village festival due to sudden well drying.',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    priorityScore: 91,
    suggestedAction: 'Deploy water tanker immediately',
    peopleAffected: 820,
    reportsCount: 5,
  },
];

interface IssueContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'status' | 'reportedAt' | 'region' | 'regionZone' | 'priorityScore' | 'suggestedAction' | 'peopleAffected' | 'reportsCount'>) => string;
  updateIssueStatus: (id: string, newStatus: Status) => void;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);

  const getRandomRegion = (): string => {
    const regions = ['Rajasthan', 'Haryana', 'Delhi NCR'];
    return regions[Math.floor(Math.random() * regions.length)];
  };

  const addIssue = (issueData: Omit<Issue, 'id' | 'status' | 'reportedAt' | 'region' | 'regionZone' | 'priorityScore' | 'suggestedAction' | 'peopleAffected' | 'reportsCount'>) => {
    const id = `JL-${Math.floor(1000 + Math.random() * 9000)}`;
    const region = getRandomRegion();
    const newIssue: Issue = {
      ...issueData,
      id,
      region,
      regionZone: REGION_ZONES[region],
      status: 'Pending',
      reportedAt: new Date(),
      priorityScore: computePriorityScore(issueData.urgency as UrgencyLevel),
      suggestedAction: SUGGESTED_ACTIONS[issueData.urgency as UrgencyLevel],
      peopleAffected: computePeopleAffected(issueData.urgency as UrgencyLevel),
      reportsCount: 1,
    };
    setIssues((prev) => [newIssue, ...prev]);
    return id;
  };

  const updateIssueStatus = (id: string, newStatus: Status) => {
    setIssues(prev => prev.map(issue =>
      issue.id === id ? { ...issue, status: newStatus } : issue
    ));
  };

  return (
    <IssueContext.Provider value={{ issues, addIssue, updateIssueStatus }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}

export interface TargetWorkItem {
    workItemId: number;
    assignedToUserSK: string;
    title: string;
    state: string;
    originalEstimate: number | null;
    remainingWork: number | null;
    completedWork: number | null;
  }
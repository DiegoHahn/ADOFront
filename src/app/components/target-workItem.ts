export interface TargetWorkItem {
    workItemId: number;
    assignedToAzureUserID: string;
    title: string;
    state: string;
    originalEstimate: number | null;
    remainingWork: number | null;
    completedWork: number | null;
  }
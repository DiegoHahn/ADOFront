export interface TargetWorkItem {
    workItemId: number;
    assignedToUserSK: string;
    title: string;
    state: string;
    originalEstimate: number | null;
  }
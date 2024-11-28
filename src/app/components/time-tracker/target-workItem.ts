export interface TargetWorkItem {
  workItemId: number;
  title: string;
  state: string;
  originalEstimate: number | null;
  remainingWork: number | null;
  completedWork: number | null;
}
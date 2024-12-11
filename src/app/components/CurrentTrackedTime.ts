import { TargetWorkItem } from "./time-tracker/target-workItem";

export interface CurrentTrackedTime {
  board: string;
  userStoryId: string;
  concluded: boolean;
  task: TargetWorkItem;
  originalEstimate: number;
  remainingWork: number;
  startTime: string;
  currentTrackedTime: string;
  userId: number;
}
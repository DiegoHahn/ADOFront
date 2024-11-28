export interface ActivityRecord {
    id?: number;
    board: string;
    userStoryId: string;
    concluded: boolean;
    workItemId: number;
    title: string;
    state: string;
    originalEstimate?: number;
    remainingWork?: number;
    startTime: string;
    completedWork?: string;
    currentTrackedTime?: string;
    status: number;
    userId: number;
}
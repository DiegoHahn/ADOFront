export interface ActivityRecord {
    id?: number;
    board: string;
    userStoryId: string;
    concluded: boolean;
    workItemId: number;
    assignedToUserSK: string;
    title: string;
    state: string;
    originalEstimate: number;
    remainingWork: number;
    startTime: string;
    completedWork: string;
    status: number;
    userId: number;
}
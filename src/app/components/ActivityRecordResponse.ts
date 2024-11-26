import { ActivityRecord } from './ActivityRecord';

export interface ActivityRecordResponse {
    content: ActivityRecord[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
}
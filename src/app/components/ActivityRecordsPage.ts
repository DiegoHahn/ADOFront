import { ActivityRecord } from './ActivityRecord';

export interface ActivityRecordsPage {
    content: ActivityRecord[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
}
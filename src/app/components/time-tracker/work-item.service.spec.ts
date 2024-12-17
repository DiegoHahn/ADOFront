import { TestBed } from '@angular/core/testing';
import { WorkItemService } from './work-item.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TargetWorkItem } from './target-workItem';
import { CurrentTrackedTime } from '../CurrentTrackedTime';
import { HttpErrorResponse } from '@angular/common/http';

describe('WorkItemService', () => {
    let service: WorkItemService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [WorkItemService],
        });
        service = TestBed.inject(WorkItemService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve work items for a user story', () => {
        const mockWorkItems: TargetWorkItem[] = [
            {
                workItemId: 1,
                title: 'Sample Work Item',
                state: 'New',
                originalEstimate: 5,
                completedWork: 0,
                remainingWork: 5
            },
        ];

        service.getWorkItemsForUserStory('us123', 'user456', 'board789', false).subscribe(workItems => {
            expect(workItems).toEqual(mockWorkItems);
        });

        const req = httpMock.expectOne('http://localhost:8080/workitems/userstory');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            userStoryId: 'us123',
            userId: 'user456',
            board: 'board789',
            concluded: false,
        });
        req.flush(mockWorkItems);
    });

    it('should save activity record', () => {
        const record: CurrentTrackedTime = {
            board: 'board123',
            userStoryId: 'us123',
            concluded: false,
            task:{
                workItemId: 1,
                title: 'Sample Work Item',
                state: 'New',
                originalEstimate: 5,
                completedWork: 0,
                remainingWork: 5
            },
            startTime: '01/11/1991',
            originalEstimate: 5,
            remainingWork: 5,
            currentTrackedTime: '00:01:00',
            userId: 1
        };

        service.saveRecord(record).subscribe(response => {
            expect(response).toEqual(record);
        });

        const req = httpMock.expectOne('http://localhost:8080/activityrecord');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(record);
        req.flush(JSON.stringify(record));
    });

    it('should return null when the server response is null', () => {
        const mockRecord: CurrentTrackedTime = {
            board: 'board123',
            userStoryId: 'us123',
            concluded: false,
            task:{
                workItemId: 1,
                title: 'Sample Work Item',
                state: 'New',
                originalEstimate: 5,
                completedWork: 0,
                remainingWork: 5
            },
            startTime: '01/11/1991',
            originalEstimate: 5,
            remainingWork: 5,
            currentTrackedTime: '00:01:00',
            userId: 1
        };

        service.saveRecord(mockRecord).subscribe(response => {
            expect(response).toBeNull();
        });

        const req = httpMock.expectOne('http://localhost:8080/activityrecord');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockRecord);

        req.flush('null', { status: 200, statusText: 'OK' });
    });

    it('should handle error when saving activity record', () => {
        const record: CurrentTrackedTime = {
            board: 'board123',
            userStoryId: 'us123',
            concluded: false,
            task:{
                workItemId: 1,
                title: 'Sample Work Item',
                state: 'New',
                originalEstimate: 5,
                completedWork: 0,
                remainingWork: 5
            },
            startTime: '01/11/1991',
            originalEstimate: 5,
            remainingWork: 5,
            currentTrackedTime: '00:01:00',
            userId: 1
        };
        const mockError = new HttpErrorResponse({
            error: 'Error saving record',
            status: 500,
            statusText: 'Internal Server Error',
        });

        service.saveRecord(record).subscribe({
            next: () => fail('Expected an error'),
            error: error => {
                expect(error).toEqual(mockError);
            },
        });

        const req = httpMock.expectOne('http://localhost:8080/activityrecord');
        req.flush('Error saving record', { status: 500, statusText: 'Internal Server Error' });
    });
});
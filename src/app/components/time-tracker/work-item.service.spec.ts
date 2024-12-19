import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CurrentTrackedTime } from '../CurrentTrackedTime';
import { TargetWorkItem } from './target-workItem';
import { WorkItemService } from './work-item.service';

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

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getWorkItemsForUserStory', () => {
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

        it('should handle error when retrieving work items for a user story', () => {
            const errorResponse = new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: 'Server error',
            });

            service.getWorkItemsForUserStory('us123', 'user456', 'board789', false).subscribe(
                () => fail('should have failed with the 500 error'),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                    expect(error.statusText).toBe('Internal Server Error');
                }
            );

            const req = httpMock.expectOne('http://localhost:8080/workitems/userstory');
            expect(req.request.method).toBe('POST');
            req.flush('Something went wrong', { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('saveActivityRecord', () => {
        it('should save activity record successfully', () => {
            const mockRecord: CurrentTrackedTime = {
                board: 'Development Board',
                userStoryId: 'US123',
                concluded: false,
                task: {
                    workItemId: 456,
                    title: 'Implement Login Feature',
                    state: 'In Progress',
                    originalEstimate: 5,
                    remainingWork: 3,
                    completedWork: 2,
                },
                originalEstimate: 5,
                remainingWork: 3,
                startTime: '10:00:00',
                currentTrackedTime: '02:00:00',
                userId: 123,
            };

            service.saveRecord(mockRecord).subscribe(response => {
                expect(response).toEqual(mockRecord);
            });

            const req = httpMock.expectOne('http://localhost:8080/activityrecord');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockRecord);
            req.flush(mockRecord);
        });

        it('should handle error when saving activity record', () => {
            const mockRecord: CurrentTrackedTime = {
                board: 'Development Board',
                userStoryId: 'US123',
                concluded: false,
                task: {
                    workItemId: 456,
                    title: 'Implement Login Feature',
                    state: 'In Progress',
                    originalEstimate: 5,
                    remainingWork: 3,
                    completedWork: 2,
                },
                originalEstimate: 5,
                remainingWork: 3,
                startTime: '10:00:00',
                currentTrackedTime: '02:00:00',
                userId: 123,
            };

            const errorResponse = new HttpErrorResponse({
                status: 400,
                statusText: 'Bad Request',
                error: 'Invalid data',
            });

            service.saveRecord(mockRecord).subscribe(
                () => fail('should have failed with the 400 error'),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(400);
                    expect(error.statusText).toBe('Bad Request');
                }
            );

            const req = httpMock.expectOne('http://localhost:8080/activityrecord');
            expect(req.request.method).toBe('POST');
            req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
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
    });
});
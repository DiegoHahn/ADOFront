import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivityRecord } from '../ActivityRecord';
import { ActivityRecordService } from './activity-record.service';

describe('ActivityRecordService', () => {
    let service: ActivityRecordService;
    let httpMock: HttpTestingController;
    let datePipe: DatePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ActivityRecordService, DatePipe]
        });
        service = TestBed.inject(ActivityRecordService);
        httpMock = TestBed.inject(HttpTestingController);
        datePipe = TestBed.inject(DatePipe);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getActivitiesRecordsByDate', () => {
        it('should get activities records by date', () => {
            const userId = 1;
            const date = '2023-01-01';
            const mockResponse: ActivityRecord[] = [];
            const formattedDate = datePipe.transform(date, 'yyyy-MM-dd');

            service.getActivitiesRecordsByDate(userId, date).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(
                `http://localhost:8080/activityRecord/byDate?userId=${userId}&date=${formattedDate}`
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('getActivitiesRecordsByWorkItemID', () => {
        it('should get activities records by work item ID', () => {
            const userId = 1;
            const workItemId = 100;
            const mockResponse: ActivityRecord[] = [];

            service.getActivitiesRecordsByWorkItemId(userId, workItemId).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(
                `http://localhost:8080/activityRecord/byWorkItemId?userId=${userId}&workItemId=${workItemId}`
            );
            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });
});
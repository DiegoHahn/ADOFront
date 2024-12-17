import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivityRecordService } from './activity-record.service';
import { DatePipe } from '@angular/common';
import { ActivityRecord } from '../ActivityRecord';

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

    it('should get activities records by date', () => {
        const userId = 1;
        const date = '2023-01-01';
        const mockResponse: ActivityRecord[] = [];
        const formattedDate = datePipe.transform(date, 'yyyy-MM-dd');

        service.getActivitiesRecordsByDate(userId, date).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
            `http://localhost:8080/activityrecord/byDate?userId=${userId}&date=${formattedDate}`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get activities records by work item ID', () => {
        const userId = 1;
        const workItemId = 100;
        const mockResponse: ActivityRecord[] = [];

        service.getActivitiesRecordsByWorkItemID(userId, workItemId).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
            `http://localhost:8080/activityrecord/byWorkItemID?userId=${userId}&workItemID=${workItemId}`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});
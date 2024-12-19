import { TestBed } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('TimerService', () => {
    jest.useFakeTimers();
    let service: TimerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimerService],
        });
        service = TestBed.inject(TimerService);
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('startTimer', () => {
        it('should emit startTime$ when startTimer is called', () => {
            let emittedStartTime: string | undefined;

            service.startTime$.subscribe(time => {
                emittedStartTime = time;
            });

            service.startTimer();

            expect(emittedStartTime).toBeTruthy();
        });

        it('should emit updated currentTrackedTime$ every second', () => {
            const emittedTimes: string[] = [];
            service.currentTrackedTime$.subscribe(time => emittedTimes.push(time));
        
            service.startTimer();
        
            jest.advanceTimersByTime(4000);
        
            expect(emittedTimes).toContain('00:00:01');
            expect(emittedTimes).toContain('00:00:02');
            expect(emittedTimes).toContain('00:00:03');
        });
    });

    describe('stopTimer', () => {
        it('should stop emitting currentTrackedTime$ when stopTimer is called', () => {
            const emittedTimes: string[] = [];
            service.currentTrackedTime$.subscribe(time => emittedTimes.push(time));

            service.startTimer();

            jest.advanceTimersByTime(3000);

            service.stopTimer();

            jest.advanceTimersByTime(2000);

            expect(emittedTimes.length).toBe(4);
        });
    });

    describe('resetTimer', () => {
        it('should reset startTime$ and currentTrackedTime$ when resetTimer is called', () => {
            let emittedStartTime: string | undefined;
            let emittedTime: string | undefined;

            service.startTime$.subscribe(time => {
                emittedStartTime = time;
            });
            service.currentTrackedTime$.subscribe(time => {
                emittedTime = time;
            });

            service.startTimer();
            jest.advanceTimersByTime(3000);

            service.resetTimer();

            expect(emittedStartTime).toBe('');
            expect(emittedTime).toBe('00:00:00');
        });
    });
});
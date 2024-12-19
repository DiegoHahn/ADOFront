import { ControlButtonsComponent } from './control-buttons.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimerService } from '../timer.service';
import { WorkItemService } from './../work-item.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CurrentTrackedTime } from '../../CurrentTrackedTime';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlContainer } from '@angular/forms';

describe('ControlButtonsComponent', () => {
  let component: ControlButtonsComponent;
  let fixture: ComponentFixture<ControlButtonsComponent>;
  let timerServiceMock: jest.Mocked<TimerService>;
  let workItemServiceMock: jest.Mocked<WorkItemService>;

  class MockControlContainer extends ControlContainer {
    form: FormGroup;

    constructor() {
      super();
      this.form = new FormGroup({
        board: new FormControl('Development Board'),
        userStoryId: new FormControl('US123'),
        task: new FormControl('Implement Login Feature'),
        originalEstimate: new FormControl(5),
        remainingWork: new FormControl(3),
        startTime: new FormControl('10:00:00'),
        currentTrackedTime: new FormControl('02:00:00'),
        userId: new FormControl(123),
      });
    }

    get control(): FormGroup {
      return this.form;
    }
  }

  beforeEach(async () => {
    timerServiceMock = {
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      resetTimer: jest.fn(),
      currentTrackedTime$: of('00:00:00'),
    } as unknown as jest.Mocked<TimerService>;

    workItemServiceMock = {
      saveRecord: jest.fn(),
    } as unknown as jest.Mocked<WorkItemService>;

    await TestBed.configureTestingModule({
      declarations: [ControlButtonsComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: TimerService, useValue: timerServiceMock },
        { provide: WorkItemService, useValue: workItemServiceMock },
        { provide: ControlContainer, useClass: MockControlContainer },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('start', () => {
    it('should start the timer and set isTimerRunning to true when it is not running', () => {
      component.isTimerRunning = false;
      component.start();

      expect(timerServiceMock.startTimer).toHaveBeenCalled();
      expect(component.isTimerRunning).toBe(true);
    });

    it('should not start the timer if it is already running', () => {
      component.isTimerRunning = true;
      component.start();

      expect(timerServiceMock.startTimer).not.toHaveBeenCalled();
      expect(component.isTimerRunning).toBe(true);
    });
  });

  describe('stop', () => {
    let statusChangedSpy: jest.SpyInstance;

    beforeEach(() => {
      statusChangedSpy = jest.spyOn(component.statusChanged, 'emit');
    });

    afterEach(() => {
      statusChangedSpy.mockRestore();
    });

    it('should stop timer and save record when timer is running', () => {
      component.isTimerRunning = true;
      const mockCurrentTrackedTime: CurrentTrackedTime = {
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
      workItemServiceMock.saveRecord.mockReturnValue(of(mockCurrentTrackedTime));

      component.stop();

      expect(timerServiceMock.stopTimer).toHaveBeenCalled();
      expect(component.isTimerRunning).toBeFalsy();
      expect(component.form.get('board')?.enabled).toBe(true);
      expect(workItemServiceMock.saveRecord).toHaveBeenCalledWith(component.form.value);
      expect(statusChangedSpy).toHaveBeenCalledWith({ type: 'success', message: 'Registro salvo com sucesso!' });
    });

    it('should not stop timer if it is not running', () => {
      component.isTimerRunning = false;
      const mockCurrentTrackedTime: CurrentTrackedTime = {
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
      workItemServiceMock.saveRecord.mockReturnValue(of(mockCurrentTrackedTime));

      component.stop();

      expect(timerServiceMock.stopTimer).not.toHaveBeenCalled();
      expect(component.isTimerRunning).toBeFalsy();
      expect(workItemServiceMock.saveRecord).toHaveBeenCalledWith(component.form.value);
    });

    it('should emit error message on 401 error', () => {
      component.isTimerRunning = true;
      workItemServiceMock.saveRecord.mockReturnValue(throwError(() => ({
        status: 401,
        statusText: 'Unauthorized',
        error: 'Invalid token',
        url: 'http://localhost:8080/saveRecord',
      } as HttpErrorResponse)));

      component.stop();

      expect(component.statusChanged.emit).toHaveBeenCalledWith({
        type: 'error',
        message: 'Token expirado. Ao atualizar os dados de usuário esse registro sera salvo automaticamente'
      });
    });

    it('should handle non-401 errors gracefully', () => {
      component.isTimerRunning = true;
      workItemServiceMock.saveRecord.mockReturnValue(throwError(() => ({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Server error',
        url: 'http://localhost:8080/saveRecord',
      } as HttpErrorResponse)));

      component.stop();

      expect(component.statusChanged.emit).not.toHaveBeenCalledWith({
        type: 'error',
        message: 'Token expirado. Ao atualizar os dados de usuário esse registro sera salvo automaticamente'
      });
    });

    it('should reset form after successful save', fakeAsync(() => {
      component.isTimerRunning = true;
      const mockCurrentTrackedTime: CurrentTrackedTime = {
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
      workItemServiceMock.saveRecord.mockReturnValue(of(mockCurrentTrackedTime));
      jest.spyOn(component, 'resetForm');

      component.stop();
      tick(2000);

      expect(component.resetForm).toHaveBeenCalled();
    }));
  });

  describe('cancel', () => {
    it('should stop timer and reset form when cancel is called', () => {
      component.isTimerRunning = true;
      jest.spyOn(component, 'resetForm');

      component.cancel();

      expect(component.isTimerRunning).toBe(false);
      expect(component.resetForm).toHaveBeenCalled();
    });

    it('should reset form when cancel is called and timer is not running', () => {
      component.isTimerRunning = false;
      jest.spyOn(component, 'resetForm');

      component.cancel();

      expect(timerServiceMock.stopTimer).not.toHaveBeenCalled();
      expect(component.isTimerRunning).toBe(false);
      expect(component.resetForm).toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset the form and emit clear status', () => {
      jest.spyOn(component.statusChanged, 'emit');

      component.resetForm();

      expect(timerServiceMock.resetTimer).toHaveBeenCalled();
      expect(component.form.get('board')?.value).toBe('Development Board');
      expect(component.form.get('board')?.disabled).toBe(true);
      expect(component.form.get('userStoryId')?.value).toBe('');
      expect(component.form.get('task')?.value).toBeNull();
      expect(component.form.get('originalEstimate')?.value).toBe('');
      expect(component.form.get('remainingWork')?.value).toBe('');
      expect(component.form.get('startTime')?.value).toBe('');
      expect(component.form.get('currentTrackedTime')?.value).toBe('00:00:00');
      expect(component.form.get('userId')?.value).toBe(123);
      expect(component.statusChanged.emit).toHaveBeenCalledWith({ type: 'clear', message: '' });
    });

    it('should maintain the board and userId values after reset', () => {
      jest.spyOn(component.statusChanged, 'emit');
      component.resetForm();
    
      expect(component.form.get('board')?.value).toBe('Development Board');
      expect(component.form.get('userId')?.value).toBe(123);
      expect(component.statusChanged.emit).toHaveBeenCalledWith({ type: 'clear', message: '' });
    });
  });
});
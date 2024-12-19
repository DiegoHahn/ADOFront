import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityComponent } from './user-activity.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonalDataService } from '../../time-tracker/personal-data.service';
import { ActivityRecordService } from '../activity-record.service';
import { of, throwError } from 'rxjs';
import { UserInformation } from '../../time-tracker/user-information';
import { ActivityRecord } from '../../ActivityRecord';

describe('UserActivityComponent', () => {
  let component: UserActivityComponent;
  let fixture: ComponentFixture<UserActivityComponent>;
  let mockActivityRecordService: jest.Mocked<ActivityRecordService>;
  let mockPersonalDataService: jest.Mocked<PersonalDataService>;
  let mockRouter: jest.Mocked<Router>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const activityRecordServiceSpy = {
      getActivitiesRecordsByDate: jest.fn(),
      getActivitiesRecordsByWorkItemID: jest.fn(),
    };

    const personalDataServiceSpy = {
      getUserInformation: jest.fn(),
    };

    const routerSpy = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [UserActivityComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ActivityRecordService, useValue: activityRecordServiceSpy },
        { provide: PersonalDataService, useValue: personalDataServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    mockActivityRecordService = TestBed.inject(ActivityRecordService) as jest.Mocked<ActivityRecordService>;
    mockPersonalDataService = TestBed.inject(PersonalDataService) as jest.Mocked<PersonalDataService>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(UserActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set userId from localStorage and initialize form', () => {
      const mockUserInformation = {
        userId: '123',
        email: 'user@example.com',
        hasToken: true,
        board: 'default-board',
      };

      (window.localStorage.getItem as jest.Mock).mockReturnValue('user@example.com');
      mockPersonalDataService.getUserInformation.mockReturnValue(of(mockUserInformation));

      component.ngOnInit();

      expect(component.userId).toEqual('123');
      expect(component.filterForm.get('userId')?.value).toEqual('123');
      expect(component.isLoadingUser).toBe(false);
    });

    it('should navigate to activity-tracker if no email in localStorage', () => {
      (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

      component.ngOnInit();

      expect(component.isLoadingUser).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['activity-tracker']);
    });

  
    it('should handle error when getting user information', () => {
      const mockError = new Error('Test error');
      (window.localStorage.getItem as jest.Mock).mockReturnValue('user@example.com');
      mockPersonalDataService.getUserInformation.mockReturnValue(throwError(() => mockError));
      const consoleSpy = jest.spyOn(console, 'error');

      component.ngOnInit();

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao obter o usuário:', mockError);
      expect(component.isLoadingUser).toBe(false);
      expect(component.userId).toBeNull();

      consoleSpy.mockRestore();
    });

    
  });

  describe('emptyRows and displayRows', () => {
    it('should return correct number of display rows when records are less than DEFAULT_PAGE_SIZE', () => {
      const mockRecords = Array(5).fill({
        workItemId: '123',
        title: 'Test',
        startTime: '2023-10-05', 
        currentTrackedTime: '01:00:00'
      });
      component.activityRecords = mockRecords;
      
      const result = component.displayRows;
      
      expect(result.length).toBe(component.DEFAULT_PAGE_SIZE);
  
      mockRecords.forEach((record, index) => {
        expect(result[index]).toEqual(record);
      });
  
      for (let i = mockRecords.length; i < component.DEFAULT_PAGE_SIZE; i++) {
        expect(result[i]).toEqual({
          workItemId: '',
          title: '',
          startTime: '',
          currentTrackedTime: ''
        });
      }
    });
  
    it('should return only actual records when records equal or exceed DEFAULT_PAGE_SIZE', () => {
      const mockRecords = Array(12).fill({
        workItemId: '123',
        title: 'Test',
        startTime: '2023-10-05', 
        currentTrackedTime: '01:00:00'
      });
      component.activityRecords = mockRecords;
      
      const result = component.displayRows;
      
      expect(result.length).toBe(12);
      expect(result).toEqual(mockRecords);
    });
  
    it('should return default page size empty rows when emptyRows is called', () => {
      const emptyRow = {
        workItemId: '',
        title: '',
        startTime: '',
        currentTrackedTime: ''
      };
      const expectedRows = Array(component.DEFAULT_PAGE_SIZE).fill(emptyRow);
      
      const result = component.emptyRows;
      
      expect(result).toEqual(expectedRows);
    });
  });
  
  describe('loadRecordsByDate', () => {
    it('should load records by date when form is valid', () => {
      const mockUserInformation = {
        userId: '123',
        email: 'user@example.com',
        hasToken: true,
        board: 'default-board',
      };
      (window.localStorage.getItem as jest.Mock).mockReturnValue('user@example.com');
      mockPersonalDataService.getUserInformation.mockReturnValue(of(mockUserInformation));
      component.ngOnInit();
      component.filterForm.get('date')?.setValue('2023-10-05');
      const mockRecords = [{}] as any[];
      mockActivityRecordService.getActivitiesRecordsByDate.mockReturnValue(of(mockRecords));
      jest.spyOn(component, 'resetDateField');
      jest.spyOn(component, 'calculateTotalTrackedTime');
  
      component.loadRecordsByDate();
  
      expect(mockActivityRecordService.getActivitiesRecordsByDate).toHaveBeenCalledWith('123', '2023-10-05');
      expect(component.activityRecords).toEqual(mockRecords);
      expect(component.resetDateField).toHaveBeenCalled();
      expect(component.calculateTotalTrackedTime).toHaveBeenCalled();
    });

    it('should handle error when loading records by date fails', () => {
      const mockError = new Error('Test error');
      (window.localStorage.getItem as jest.Mock).mockReturnValue('user@example.com');
      mockPersonalDataService.getUserInformation.mockReturnValue(of({
        userId: '123',
        email: 'user@example.com',
        hasToken: true,
        board: 'default-board',
      }));
      component.ngOnInit();
      component.filterForm.get('date')?.setValue('2023-10-05');
      mockActivityRecordService.getActivitiesRecordsByDate.mockReturnValue(throwError(() => mockError));
      const consoleSpy = jest.spyOn(console, 'error');
      jest.spyOn(component, 'calculateTotalTrackedTime');
    
      component.loadRecordsByDate();
    
      expect(mockActivityRecordService.getActivitiesRecordsByDate).toHaveBeenCalledWith('123', '2023-10-05');
      expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar registros por data:', mockError);
      expect(component.errorMessage).toEqual('Erro ao carregar registros. Tente novamente.');
      expect(component.activityRecords).toEqual([]);
      expect(component.calculateTotalTrackedTime).not.toHaveBeenCalled();
    
      consoleSpy.mockRestore();
    });
  
    it('should set errorMessage to "Nenhum registro encontrado" when no records are returned', () => {
      component.userId = '123';
      component.filterForm.get('date')?.setValue('2023-10-05');
      const mockEmptyRecords: ActivityRecord[] = [];
      mockActivityRecordService.getActivitiesRecordsByDate.mockReturnValue(of(mockEmptyRecords));
      jest.spyOn(component, 'resetDateField');
      jest.spyOn(component, 'calculateTotalTrackedTime');
  
      component.loadRecordsByDate();
  
      expect(component.activityRecords).toEqual(mockEmptyRecords);
      expect(component.resetDateField).toHaveBeenCalled();
      expect(component.errorMessage).toEqual('Nenhum registro encontrado');
      expect(component.calculateTotalTrackedTime).toHaveBeenCalled();
    });

    it('should not load records if date is invalid', () => {
      component.userId = '123';
      component.filterForm.get('date')?.setValue('');
  
      component.loadRecordsByDate();
  
      expect(mockActivityRecordService.getActivitiesRecordsByDate).not.toHaveBeenCalled();
    });
  });

  describe('loadRecordsByWorkItemID', () => {
    it('should load records by WorkItemID when form is valid', () => {
      const mockUserInformation: UserInformation = {
        userId: '123',
        email: 'user@example.com',
        hasToken: true,
        board: 'default-board',
      };
      (window.localStorage.getItem as jest.Mock).mockReturnValue('user@example.com');
      mockPersonalDataService.getUserInformation.mockReturnValue(of(mockUserInformation));
      component.ngOnInit();
      component.filterForm.get('workItemId')?.setValue('456');
      const mockRecords = [{}] as any[];
      mockActivityRecordService.getActivitiesRecordsByWorkItemID.mockReturnValue(of(mockRecords));
      jest.spyOn(component, 'resetWorkItemField');
      jest.spyOn(component, 'calculateTotalTrackedTime');
    
      component.loadRecordsByWorkItemID();
    
      expect(component.activityRecords).toEqual(mockRecords);
      expect(component.resetWorkItemField).toHaveBeenCalled();
      expect(component.calculateTotalTrackedTime).toHaveBeenCalled();
    });

    it('should handle error when loading records by WorkItemID fails', () => {
      const mockError = new Error('Test error');
      const mockUserInformation: UserInformation = {
        userId: '123',
        email: 'user@example.com',
        hasToken: true,
        board: 'default-board',
      };
  
      (window.localStorage.getItem as jest.Mock).mockReturnValue('user@example.com');
      mockPersonalDataService.getUserInformation.mockReturnValue(of(mockUserInformation));
      component.ngOnInit();
      component.filterForm.get('workItemId')?.setValue('456');
      mockActivityRecordService.getActivitiesRecordsByWorkItemID.mockReturnValue(throwError(() => mockError));
      const consoleSpy = jest.spyOn(console, 'error');
      jest.spyOn(component, 'calculateTotalTrackedTime');
  
      component.loadRecordsByWorkItemID();
  
      expect(mockActivityRecordService.getActivitiesRecordsByWorkItemID).toHaveBeenCalledWith('123', '456');
      expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar registros por ID da Task:', mockError);
      expect(component.errorMessage).toEqual('Erro ao carregar registros. Tente novamente.');
      expect(component.activityRecords).toEqual([]);
      expect(component.calculateTotalTrackedTime).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
    
    it('should set errorMessage to "Nenhum registro encontrado" when no records are returned', () => {
      component.userId = '123';
      component.filterForm.get('workItemId')?.setValue('456');
      const mockEmptyRecords: ActivityRecord[] = [];
      mockActivityRecordService.getActivitiesRecordsByWorkItemID.mockReturnValue(of(mockEmptyRecords));
      jest.spyOn(component, 'resetWorkItemField');
      jest.spyOn(component, 'calculateTotalTrackedTime');
  
      component.loadRecordsByWorkItemID();
  
      expect(component.activityRecords).toEqual(mockEmptyRecords);
      expect(component.resetWorkItemField).toHaveBeenCalled();
      expect(component.errorMessage).toEqual('Nenhum registro encontrado');
      expect(component.calculateTotalTrackedTime).toHaveBeenCalled();
    });

    it('should not load records if WorkItemID is invalid', () => {
      component.userId = '123';
      component.filterForm.get('workItemId')?.setValue('');
  
      component.loadRecordsByWorkItemID();
  
      expect(mockActivityRecordService.getActivitiesRecordsByWorkItemID).not.toHaveBeenCalled();
    });
  });

  describe('calculateTotalTrackedTime', () => {
    it('should calculate the total tracked time correctly', () => {
      component.activityRecords = [
        { currentTrackedTime: '01:20:30' },
        { currentTrackedTime: '02:10:15' },
      ] as any[];
  
      component.calculateTotalTrackedTime();
  
      expect(component.totalTrackedTime).toEqual('03:30:45');
    });
  
    it('should handle empty activityRecords', () => {
      component.activityRecords = [];
  
      component.calculateTotalTrackedTime();
  
      expect(component.totalTrackedTime).toEqual('00:00:00');
    });
  });

  describe('isDateSearchDisabled', () => {
    it('should return true when date is invalid', () => {
      component.filterForm.get('date')?.setValue('');
  
      const result = component.isDateSearchDisabled();
  
      expect(result).toBe(true);
    });
  
    it('should return false when date is valid', () => {
      component.filterForm.get('date')?.setValue('2023-10-05');
  
      const result = component.isDateSearchDisabled();
  
      expect(result).toBe(false);
    });
  });
  
  describe('isWorkItemSearchDisabled', () => {
    it('should return true when WorkItemID is invalid', () => {
      component.filterForm.get('workItemId')?.setValue('');
  
      const result = component.isWorkItemSearchDisabled();
  
      expect(result).toBe(true);
    });
  
    it('should return false when WorkItemID is valid', () => {
      component.filterForm.get('workItemId')?.setValue('456');
  
      const result = component.isWorkItemSearchDisabled();
  
      expect(result).toBe(false);
    });
  });

  describe('resetDateField', () => {
    it('should reset the date field', () => {
      component.filterForm.get('date')?.setValue('2023-10-05');
  
      component.resetDateField();
  
      expect(component.filterForm.get('date')?.value).toBe('');
    });
  });
  
  describe('resetWorkItemField', () => {
    it('should reset the workItemId field', () => {
      component.filterForm.get('workItemId')?.setValue('456');
  
      component.resetWorkItemField();
  
      expect(component.filterForm.get('workItemId')?.value).toBe('');
    });
  });
  
  describe('padWithZero', () => {
    it('should pad single digit numbers with zero', () => {
      expect(component.padWithZero(5)).toEqual('05');
    });
  
    it('should not pad double digit numbers', () => {
      expect(component.padWithZero(12)).toEqual('12');
    });
  });
});
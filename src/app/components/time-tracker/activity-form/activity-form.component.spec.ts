// import { HttpErrorResponse } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { BehaviorSubject, of, throwError } from 'rxjs';
// import { PersonalDataService } from '../personal-data.service';
// import { TargetWorkItem } from '../target-workItem';
// import { TimerService } from '../timer.service';
// import { UserInformation } from '../user-information';
// import { WorkItemService } from '../work-item.service';
// import { ActivityFormComponent } from './activity-form.component';

// describe('ActivityFormComponent', () => {
//   let component: ActivityFormComponent;
//   let fixture: ComponentFixture<ActivityFormComponent>;
//   let timerServiceMock: Partial<TimerService>;
//   let workItemServiceMock: Partial<WorkItemService>;
//   let personalDataServiceMock: Partial<PersonalDataService>;
//   let routerMock: Partial<Router>;
//   let ngZoneMock: Partial<NgZone>;

//   beforeAll(() => {
//     Object.defineProperty(window, 'localStorage', {
//       value: {
//         getItem: jest.fn().mockReturnValue('user@example.com'),
//         setItem: jest.fn(),
//         removeItem: jest.fn(),
//         clear: jest.fn(),
//       },
//       writable: true
//     });
//   });

//   beforeEach(async () => {
//     // Criar BehaviorSubjects para simular Observables reais
//     const startTimeSubject = new BehaviorSubject<string>('10:00:00');
//     const currentTrackedTimeSubject = new BehaviorSubject<string>('02:00:00');

//     // Mock do TimerService
//     timerServiceMock = {
//         resetTimer: jest.fn(),
//         stopTimer: jest.fn(),
//         startTimer: jest.fn().mockImplementation(() => {
//           // Opcionalmente, atualize os subjects aqui se necessário
//         }),
//         startTime$: startTimeSubject.asObservable(),
//         currentTrackedTime$: currentTrackedTimeSubject.asObservable(),
//       };

//     // Mock do WorkItemService
//     workItemServiceMock = {
//       getWorkItemsForUserStory: jest.fn().mockReturnValue(of([])),
//       saveRecord: jest.fn(),
//     };
//     // Mock do PersonalDataService
//     const mockUserInformation: UserInformation = {
//       userId: '123',
//       email: 'user@example.com',
//       hasToken: true,
//       board: 'default-board',
//     };
//     personalDataServiceMock = {
//       getUserInformation: jest.fn().mockReturnValue(of(mockUserInformation)),
//     };

//     // Mock do Router
//     routerMock = {
//       navigate: jest.fn(),
//     };

//     // Mock do NgZone
//     ngZoneMock = {
//       run: jest.fn((fn: Function) => fn()),
//     };

//     await TestBed.configureTestingModule({
//       declarations: [ActivityFormComponent],
//       imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
//       providers: [
//         FormBuilder,
//         { provide: TimerService, useValue: timerServiceMock },
//         { provide: WorkItemService, useValue: workItemServiceMock },
//         { provide: PersonalDataService, useValue: personalDataServiceMock },
//         { provide: Router, useValue: routerMock },
//         { provide: NgZone, useValue: ngZoneMock },
//       ],
//       schemas: [NO_ERRORS_SCHEMA], // Ignora elementos desconhecidos
//     }).compileComponents();

//     fixture = TestBed.createComponent(ActivityFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   // it('should create', () => {
//   //   console.trace('Verificando se o componente foi criado', );
//   //   expect(component).toBeTruthy();
//   // });

//   describe('ngOnInit', () => {
//     let loadUserInfoSpy: jest.SpyInstance;
//     let setupTimerSpy: jest.SpyInstance;
//     let formGroupSpy: jest.SpyInstance;

//     beforeEach(() => {
//       loadUserInfoSpy = jest.spyOn(component as any, 'loadUserInformationFromDatabase');
//       setupTimerSpy = jest.spyOn(component as any, 'setupTimerSubscriptions');
//       formGroupSpy = jest.spyOn(component.formBuilder, 'group');
//     });

//     afterEach(() => {
//       loadUserInfoSpy.mockRestore();
//       setupTimerSpy.mockRestore();
//       formGroupSpy.mockRestore();
//     });

//     it('should initialize the form and call necessary methods', () => {
//       component.ngOnInit();

//       expect(formGroupSpy).toHaveBeenCalledWith({
//         board: [''],
//         userStoryId: [''],
//         concluded: [false],
//         task: [null],
//         originalEstimate: [''],
//         remainingWork: [''],
//         startTime: [''],
//         currentTrackedTime: [''],
//         userId: ['']
//       });
//       expect(component.form.get('board')?.disabled).toBe(true);
//       expect(setupTimerSpy).toHaveBeenCalled();
//       expect(loadUserInfoSpy).toHaveBeenCalled();
//       expect(timerServiceMock.resetTimer).toHaveBeenCalled();
//     });

//     it('should subscribe to concluded value changes', () => {
//       const onConcludedChangeSpy = jest.spyOn(component as any, 'onConcludedChange');

//       component.ngOnInit();

//       component.form.get('concluded')?.setValue(true);
//       expect(onConcludedChangeSpy).toHaveBeenCalled();
//     });
//   });

//   describe('ngOnDestroy', () => {
//     it('should stop and reset the timer', () => {
//       component.ngOnDestroy();

//       expect(timerServiceMock.stopTimer).toHaveBeenCalled();
//       expect(timerServiceMock.resetTimer).toHaveBeenCalled();
//     });
//   });

//   describe('loadUserInformationFromDatabase', () => {
//     let consoleErrorSpy: jest.SpyInstance;

//     beforeEach(() => {
//       consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//     });

//     afterEach(() => {
//       consoleErrorSpy.mockRestore();
//     });

//     it('should patch form with user information and navigate if board is empty', () => {
//       const mockUserInfo: UserInformation = {
//         userId: '123',
//         email: 'user@example.com',
//         hasToken: true,
//         board: 'default-board',
//       };
//       (personalDataServiceMock.getUserInformation as jest.Mock).mockReturnValue(of(mockUserInfo));

//       component['loadUserInformationFromDatabase']('user@example.com');

//       expect(personalDataServiceMock.getUserInformation).toHaveBeenCalledWith('user@example.com');
//       expect(component.form.get('board')?.value).toBe('default-board');
//       expect(component.form.get('userId')?.value).toBe('123');
//       expect(routerMock.navigate).not.toHaveBeenCalled();
//     });

//     it('should navigate to personal-data if board is empty after patching', () => {
//       const mockUserInfo: UserInformation = {
//         userId: '123',
//         email: 'user@example.com',
//         hasToken: true,
//         board: '', // Board vazio
//       };
//       (personalDataServiceMock.getUserInformation as jest.Mock).mockReturnValue(of(mockUserInfo));

//       component['loadUserInformationFromDatabase']('user@example.com');

//       expect(personalDataServiceMock.getUserInformation).toHaveBeenCalledWith('user@example.com');
//       expect(routerMock.navigate).toHaveBeenCalledWith(['/activity-tracker', 'personal-data']);
//     });

//     it('should handle error gracefully and set errorMessage', () => {
//       const mockError = new HttpErrorResponse({
//         status: 500,
//         statusText: 'Internal Server Error',
//         error: 'Server error',
//       });
//       (personalDataServiceMock.getUserInformation as jest.Mock).mockReturnValue(throwError(() => mockError));

//       component['loadUserInformationFromDatabase']('user@example.com');

//       expect(personalDataServiceMock.getUserInformation).toHaveBeenCalledWith('user@example.com');
//       expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao carregar informações do usuário:', mockError);
//       expect(component.errorMessage).toBe('Erro ao carregar informações do usuário.');
//     });

//     it('should set errorMessage if email is not provided', () => {
//       component['loadUserInformationFromDatabase']('');

//       expect(personalDataServiceMock.getUserInformation).not.toHaveBeenCalled();
//       expect(component.errorMessage).toBe('Erro ao carregar informações do usuário.');
//     });
//   });

//   describe('onUserStoryChange', () => {
//     let attemptLoadWorkItemsSpy: jest.SpyInstance;

//     beforeEach(() => {
//       attemptLoadWorkItemsSpy = jest.spyOn(component as any, 'attemptLoadWorkItems');
//     });

//     afterEach(() => {
//       attemptLoadWorkItemsSpy.mockRestore();
//     });

//     it('should reset form fields and attempt to load work items', () => {
//       component.onUserStoryChange();

//       expect(component.errorMessage).toBeNull();
//       expect(component.workItems).toEqual([]);
//       expect(component.form.get('task')?.value).toBeNull();
//       expect(component.form.get('originalEstimate')?.value).toBe('');
//       expect(component.form.get('remainingWork')?.value).toBe('');
//       expect(attemptLoadWorkItemsSpy).toHaveBeenCalled();
//     });
//   });

//   describe('onConcludedChange', () => {
//     let attemptLoadWorkItemsSpy: jest.SpyInstance;

//     beforeEach(() => {
//       attemptLoadWorkItemsSpy = jest.spyOn(component as any, 'attemptLoadWorkItems');
//     });

//     afterEach(() => {
//       attemptLoadWorkItemsSpy.mockRestore();
//     });

//     it('should attempt to load work items when concluded changes', () => {
//       component.onConcludedChange();

//       expect(attemptLoadWorkItemsSpy).toHaveBeenCalled();
//     });
//   });

//   describe('attemptLoadWorkItems', () => {
//     let loadWorkItemsSpy: jest.SpyInstance;

//     beforeEach(() => {
//       loadWorkItemsSpy = jest.spyOn(component as any, 'loadWorkItems');
//     });

//     afterEach(() => {
//       loadWorkItemsSpy.mockRestore();
//     });

//     it('should call loadWorkItems if all required fields are present', () => {
//       component.form.setValue({
//         board: 'Development Board',
//         userStoryId: 'US123',
//         concluded: false,
//         task: null,
//         originalEstimate: '',
//         remainingWork: '',
//         startTime: '',
//         currentTrackedTime: '',
//         userId: '123',
//       });

//       component['attemptLoadWorkItems']();

//       expect(loadWorkItemsSpy).toHaveBeenCalledWith('US123', '123', 'Development Board', false);
//     });

//     it('should not call loadWorkItems if any required field is missing', () => {
//       component.form.setValue({
//         board: '',
//         userStoryId: 'US123',
//         concluded: false,
//         task: null,
//         originalEstimate: '',
//         remainingWork: '',
//         startTime: '',
//         currentTrackedTime: '',
//         userId: '123',
//       });

//       component['attemptLoadWorkItems']();

//       expect(loadWorkItemsSpy).not.toHaveBeenCalled();
//     });
//   });

//   describe('loadWorkItems', () => {
//     let consoleErrorSpy: jest.SpyInstance;

//     beforeEach(() => {
//       consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//     });

//     afterEach(() => {
//       consoleErrorSpy.mockRestore();
//     });

//     it('should load work items and set selectedWorkItem if items are found', () => {
//       const mockWorkItems: TargetWorkItem[] = [
//         {
//           workItemId: 456,
//           title: 'Implement Login Feature',
//           state: 'In Progress',
//           originalEstimate: 5,
//           remainingWork: 3,
//           completedWork: 2,
//         }
//       ];
//       (workItemServiceMock.getWorkItemsForUserStory as jest.Mock).mockReturnValue(of(mockWorkItems));

//       component['loadWorkItems']('US123', '123', 'Development Board', false);

//       expect(workItemServiceMock.getWorkItemsForUserStory).toHaveBeenCalledWith('US123', '123', 'Development Board', false);
//       expect(component.workItems).toEqual(mockWorkItems);
//       expect(component.selectedWorkItem).toEqual(mockWorkItems[0]);
//       expect(component.form.get('task')?.value).toEqual(mockWorkItems[0]);
//     });

//     it('should set errorMessage if no work items are found', () => {
//       const mockWorkItems: TargetWorkItem[] = [];
//       (workItemServiceMock.getWorkItemsForUserStory as jest.Mock).mockReturnValue(of(mockWorkItems));

//       component['loadWorkItems']('US123', '123', 'Development Board', false);

//       expect(workItemServiceMock.getWorkItemsForUserStory).toHaveBeenCalledWith('US123', '123', 'Development Board', false);
//       expect(component.workItems).toEqual([]);
//       expect(component.selectedWorkItem).toBeNull();
//       expect(ngZoneMock.run).toHaveBeenCalled();
//       expect(component.errorMessage).toBe('Nenhuma task encontrada para a User Story informada.');
//     });

//     it('should handle HTTP errors and set errorMessage', () => {
//       const mockError = new HttpErrorResponse({
//         status: 500,
//         statusText: 'Internal Server Error',
//         error: 'Server error',
//       });
//       (workItemServiceMock.getWorkItemsForUserStory as jest.Mock).mockReturnValue(throwError(() => mockError));

//       component['loadWorkItems']('US123', '123', 'Development Board', false);

//       expect(workItemServiceMock.getWorkItemsForUserStory).toHaveBeenCalledWith('US123', '123', 'Development Board', false);
//       expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar dados:', mockError);
//       expect(ngZoneMock.run).toHaveBeenCalled();
//       expect(component.errorMessage).toBe('Erro ao buscar tasks. Verifique os dados de usuário informados');
//     });
//   });

//   describe('onWorkItemSelect', () => {
//     it('should update form fields based on selected work item', () => {
//       const selectedWorkItem: TargetWorkItem = {
//         workItemId: 456,
//         title: 'Implement Login Feature',
//         state: 'In Progress',
//         originalEstimate: 5,
//         remainingWork: 3,
//         completedWork: 2,
//       };
//       component.selectedWorkItem = selectedWorkItem;
//       component.form.get('task')?.setValue(selectedWorkItem);

//       component.onWorkItemSelect();

//       expect(component.form.get('originalEstimate')?.value).toBe(5);
//       expect(component.form.get('remainingWork')?.value).toBe(3);
//     });

//     it('should not update form fields if no work item is selected', () => {
//       component.selectedWorkItem = null;
//       component.form.get('task')?.setValue(null);

//       component.onWorkItemSelect();

//       expect(component.form.get('originalEstimate')?.value).toBe('');
//       expect(component.form.get('remainingWork')?.value).toBe('');
//     });
//   });

//   describe('handleStatus', () => {
//     it('should set successMessage and clear errorMessage on success status', () => {
//       component.handleStatus({ type: 'success', message: 'Operação bem-sucedida!' });

//       expect(component.successMessage).toBe('Operação bem-sucedida!');
//       expect(component.errorMessage).toBeNull();
//     });

//     it('should set errorMessage and clear successMessage on error status', () => {
//       component.handleStatus({ type: 'error', message: 'Ocorreu um erro.' });

//       expect(component.errorMessage).toBe('Ocorreu um erro.');
//       expect(component.successMessage).toBeNull();
//     });

//     it('should clear both messages on clear status', () => {
//       component.successMessage = 'Mensagem de sucesso';
//       component.errorMessage = 'Mensagem de erro';

//       component.handleStatus({ type: 'clear', message: '' });

//       expect(component.successMessage).toBeNull();
//       expect(component.errorMessage).toBeNull();
//     });
//   });
// });
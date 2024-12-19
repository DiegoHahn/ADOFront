import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PersonalDataService } from '../personal-data.service';
import { LoginComponent } from './login.component';
import { UserInformation } from '../user-information';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let formBuilder: FormBuilder;
  let mockService: jest.Mocked<PersonalDataService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(waitForAsync(() => {
    const serviceMock = {
      getUserInformation: jest.fn(),
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: PersonalDataService, useValue: serviceMock },
        { provide: Router, useValue: routerMock },
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      formBuilder = TestBed.inject(FormBuilder);
      mockService = TestBed.inject(PersonalDataService) as jest.Mocked<PersonalDataService>;
      mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the login form with email control', () => {
      const expectedFormGroup = formBuilder.group({
        email: ['', [Validators.required, Validators.email]]
      });

      component.ngOnInit();

      expect(component.loginForm.value).toEqual(expectedFormGroup.value);
    });

    it('should subscribe to email value changes and call updateEmailErrors', fakeAsync(() => {
      const updateErrorsSpy = jest.spyOn(component, 'updateEmailErrors');
      component.ngOnInit();
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');
      tick(1000);

      expect(updateErrorsSpy).toHaveBeenCalled();
    }));
  });

  describe('updateEmailErrors', () => {
    it('should populate emailErrors with required error message when email is empty', () => {
      component.loginForm.setValue({ email: '' });

      component.updateEmailErrors();

      expect(component.emailErrors).toContain('Email é obrigatório.');
      expect(component.emailErrors).not.toContain('Por favor, insira um email válido.');
    });

    it('should populate emailErrors with invalid email message when email format is incorrect', () => {
      component.loginForm.setValue({ email: 'invalid-email' });

      component.updateEmailErrors();

      expect(component.emailErrors).toContain('Por favor, insira um email válido.');
      expect(component.emailErrors).not.toContain('Email é obrigatório.');
    });

    it('should have no emailErrors when email is valid', () => {
      component.loginForm.setValue({ email: 'valid@example.com' });

      component.updateEmailErrors();

      expect(component.emailErrors.length).toBe(0);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      mockService.getUserInformation.mockClear();
      mockRouter.navigate.mockClear();
      jest.spyOn(Storage.prototype, 'setItem').mockClear();
    });

    it('should call onSubmit and navigate on successful login', () => {
      const navigateSpy = mockRouter.navigate;
      const mockResponse: UserInformation = {
        hasToken: true,
        email: 'test@example.com',
        board: 'default-board',
        userId: '123'
      };
      mockService.getUserInformation.mockReturnValue(of(mockResponse));
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      component.loginForm.setValue({ email: 'test@example.com' });

      component.onSubmit();

      expect(mockService.getUserInformation).toHaveBeenCalledWith('test@example.com');
      expect(setItemSpy).toHaveBeenCalledWith('email', 'test@example.com');
      expect(setItemSpy).toHaveBeenCalledWith('userInformation', JSON.stringify(mockResponse));
      expect(navigateSpy).toHaveBeenCalledWith(['/activity-tracker', 'activity-form']);
    });

    it('should handle 404 error on onSubmit and navigate to personal-data', () => {
      const navigateSpy = mockRouter.navigate;
      mockService.getUserInformation.mockImplementation(() => throwError(() => ({
        status: 404,
        statusText: 'Not Found',
        error: 'User not found',
        url: 'http://localhost:8080/userInformation',
      })));
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      component.loginForm.setValue({ email: 'nonexistent@example.com' });

      component.onSubmit();

      expect(mockService.getUserInformation).toHaveBeenCalledWith('nonexistent@example.com');
      expect(setItemSpy).toHaveBeenCalledWith('email', 'nonexistent@example.com');
      expect(navigateSpy).toHaveBeenCalledWith(['/activity-tracker', '/personal-data']);
    });

    it('should handle unexpected errors on onSubmit', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockService.getUserInformation.mockReturnValue(throwError(() => ({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Server error',
        url: 'http://localhost:8080/userInformation',
      })));
      component.loginForm.setValue({ email: 'error@example.com' });

      component.onSubmit();

      expect(mockService.getUserInformation).toHaveBeenCalledWith('error@example.com');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar informações do usuário:', {
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Server error',
        url: 'http://localhost:8080/userInformation',
      });
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should not call PersonalDataService or navigate if form is invalid', () => {
      const getUserInfoSpy = mockService.getUserInformation;
      const navigateSpy = mockRouter.navigate;
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      component.loginForm.setValue({ email: '' });
      const updateErrorsSpy = jest.spyOn(component, 'updateEmailErrors');

      component.onSubmit();

      expect(updateErrorsSpy).toHaveBeenCalled();
      expect(getUserInfoSpy).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });
});
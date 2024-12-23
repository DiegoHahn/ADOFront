import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PersonalDataService } from '../personal-data.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let personalDataServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    personalDataServiceMock = {
      getUserInformation: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PersonalDataService, useValue: personalDataServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize the form with the email field empty', () => {
      expect(component.loginForm.get('email')?.value).toBe('');
    });

    it('should set up the listener for the email field', () => {
      const setupEmailListenerSpy = jest.spyOn(component, 'setupEmailListener');
      component.ngOnInit();
      expect(setupEmailListenerSpy).toHaveBeenCalled();
    });
  });

  describe('setupEmailListener', () => {
    it('should display an error message when the email is invalid and the control is dirty', fakeAsync(() => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsDirty();
      emailControl?.updateValueAndValidity();
      tick(500);
  
      expect(component.displayError).toBeTruthy();
      expect(component.errorMessage).toBe('Email inválido');
    }));

    it('should not display an error message when the email is invalid but the control is neither dirty nor touched', fakeAsync(() => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');

      emailControl?.updateValueAndValidity();
      tick(500);
  
      expect(component.displayError).toBeFalsy();
      expect(component.errorMessage).toBe('');
    }));

    it('should clear the error message when the email is valid', () => {
      component.loginForm.get('email')?.setValue('valid@example.com');
      fixture.detectChanges();

      expect(component.displayError).toBeFalsy();
      expect(component.errorMessage).toBe('');
    });

    it('should update email errors if the form is invalid', () => {
      const updateEmailErrorsSpy = jest.spyOn(component, 'updateEmailErrors');
      component.loginForm.get('email')?.setValue('');
      const navigateSpy = jest.spyOn(routerMock, 'navigate');
    
      component.onSubmit();
    
      expect(updateEmailErrorsSpy).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('getEmailErrorMessage', () => {
    it('should return "Email é obrigatório" when the field is empty', () => {
      const control = component.loginForm.get('email');
      control?.setErrors({ required: true });

      expect(component.getEmailErrorMessage(control!)).toBe('Email é obrigatório');
    });

    it('should return "Email inválido" when the field is invalid', () => {
      const control = component.loginForm.get('email');
      control?.setErrors({ email: true });

      expect(component.getEmailErrorMessage(control!)).toBe('Email inválido');
    });

    it('should return an empty string when there are no errors', () => {
      const control = component.loginForm.get('email');
      control?.setErrors(null);
  
      expect(component.getEmailErrorMessage(control!)).toBe('');
    });
  });

  describe('onSubmit', () => {
    it('should search user information when the Email is valid', () => {
      personalDataServiceMock.getUserInformation.mockReturnValue(of({ id: 1, email: 'test@example.com' }));

      component.loginForm.get('email')?.setValue('test@example.com');
      component.onSubmit();

      expect(personalDataServiceMock.getUserInformation).toHaveBeenCalledWith('test@example.com');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/activity-tracker', 'activity-form']);
    });

    it('should redirect to the personal data page if the Email dos not exist', () => {
      personalDataServiceMock.getUserInformation.mockReturnValue(throwError({ status: 404 }));

      component.loginForm.get('email')?.setValue('nonexistent@example.com');
      component.onSubmit();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/activity-tracker', '/personal-data']);
    });

    it('should display an error when fetching user information results in an unexpected error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      personalDataServiceMock.getUserInformation.mockReturnValue(throwError({ status: 500 }));

      component.loginForm.get('email')?.setValue('test@example.com');
      component.onSubmit();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar informações do usuário:', expect.anything());
      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateEmailErrors', () => {
    it('should display an error message if the email field is invalid', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setErrors({ email: true });

      component.updateEmailErrors();

      expect(component.displayError).toBeTruthy();
      expect(component.errorMessage).toBe('Email inválido');
    });
  });
});

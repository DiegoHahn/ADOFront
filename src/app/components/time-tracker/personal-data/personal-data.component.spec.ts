import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PersonalDataComponent } from './personal-data.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PersonalDataService } from '../personal-data.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NgZone } from '@angular/core';

describe('PersonalDataComponent', () => {
  let component: PersonalDataComponent;
  let fixture: ComponentFixture<PersonalDataComponent>;
  let personalDataServiceMock: jest.Mocked<PersonalDataService>;
  let routerMock: jest.Mocked<Router>;
  let ngZone: NgZone;

  beforeEach(async () => {
    
    localStorage.setItem('email', 'test@example.com');
    const personalDataService = {
        saveUserInfo: jest.fn(),
        getUserInformation: jest.fn().mockReturnValue(of({ email: 'test@example.com', board: 'board', token: 'token' })),
    } as unknown as jest.Mocked<PersonalDataService>;

    const router = {
        navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [PersonalDataComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: PersonalDataService, useValue: personalDataService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDataComponent);
    component = fixture.componentInstance;
    personalDataServiceMock = TestBed.inject(PersonalDataService) as jest.Mocked<PersonalDataService>;
    routerMock = TestBed.inject(Router) as jest.Mocked<Router>;
    ngZone = TestBed.inject(NgZone);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the form', () => {
      expect(component.form).toBeTruthy();
      expect(component.form.get('email')?.value).toBe('test@example.com');
    });

    it('should subscribe to form value changes and call updateErrors', fakeAsync(() => {
      jest.spyOn(component, 'updateErrors');
      const emailControl = component.form.get('email'); 
      emailControl?.setValue('new@example.com');

      tick(1001);

      expect(component.updateErrors).toHaveBeenCalled();
    }));

    it('should fetch user information', () => {
      const getUserInfoSpy = personalDataServiceMock.getUserInformation;
      expect(getUserInfoSpy).toHaveBeenCalledWith('test@example.com');
    });

    it('should disable the token field when user has a token', () => {
        personalDataServiceMock.getUserInformation.mockReturnValue(
          of({ email: 'test@example.com', board: 'board', userId: '123', hasToken: true })
        );
    
        fixture = TestBed.createComponent(PersonalDataComponent);
        component = fixture.componentInstance;
        jest.spyOn(component, 'updateErrors');
        fixture.detectChanges();
      
        const tokenControl = component.form.get('token');
        expect(tokenControl?.disabled).toBe(true);
      });

      it('should keep the token field enabled when user does not have a token', () => {
        personalDataServiceMock.getUserInformation.mockReturnValue(
            of({ email: 'test@example.com', board: 'board', userId: '123', hasToken: false })
        );
      
        fixture = TestBed.createComponent(PersonalDataComponent);
        component = fixture.componentInstance;
        jest.spyOn(component, 'updateErrors');
        fixture.detectChanges();
      
        const tokenControl = component.form.get('token');
        expect(tokenControl?.enabled).toBe(true);
      });

      it('should handle errors when fetching user information', () => {
        const errorResponse = { status: 500 };
        personalDataServiceMock.getUserInformation.mockReturnValue(
          throwError(() => errorResponse)
        );
      
        fixture = TestBed.createComponent(PersonalDataComponent);
        component = fixture.componentInstance;
        jest.spyOn(component, 'updateErrors');
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        fixture.detectChanges();
      
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao carregar dados:', errorResponse);
        const emailControl = component.form.get('email');
        expect(emailControl?.value).toBe('test@example.com');
        consoleErrorSpy.mockRestore();
      });
      
      it('should call getUserInformation with an empty string when email is an empty string', () => {
        localStorage.setItem('email', '');
        personalDataServiceMock.getUserInformation.mockReturnValue(
          of({ email: '', board: 'board', userId: '123', hasToken: false })
        );
      
        fixture = TestBed.createComponent(PersonalDataComponent);
        component = fixture.componentInstance;
        jest.spyOn(component, 'updateErrors');
        fixture.detectChanges();
      
        expect(personalDataServiceMock.getUserInformation).toHaveBeenCalledWith('');
      });
  });

  describe('updateErrors', () => {
    it('should update errors when the control is empty', () => {
        component.form.get('email')?.setValue('');
        component.updateErrors('email');
        expect(component.errors['email']).toContain('Email é obrigatório.');
      });

    it('should update errors when the control is invalid', () => {
      component.form.get('email')?.setValue('as');
      component.updateErrors('email');
      expect(component.errors['email']).toContain('Por favor, insira um email válido.');
    });

    it('should clear errors when the control is valid', () => {
      component.form.get('email')?.setValue('valid@example.com');
      component.updateErrors('email');
      expect(component.errors['email'].length).toBe(0);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      jest.spyOn(component, 'updateErrors');
    });

    it('should call updateErrors when form is invalid', () => {
      component.form.setErrors({ invalid: true });
      component.onSubmit();
      expect(component.updateErrors).toHaveBeenCalled();
    });

    it('should navigate on successful save', fakeAsync(() => {
      component.form.setValue({ email: 'test@example.com', board: 'board', token: 'token' });
      personalDataServiceMock.saveUserInfo.mockReturnValue(of('true'));
      component.onSubmit();
      tick();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/activity-tracker', 'activity-form']);
    }));

    it('should handle 401 error', fakeAsync(() => {
      component.form.setValue({ email: 'test@example.com', board: 'board', token: 'token' });
      personalDataServiceMock.saveUserInfo.mockReturnValue(
        throwError(() => ({ status: 401 }))
      );
      component.onSubmit();
      tick();
      ngZone.run(() => {
        expect(component.errorMessage).toBe(
          'Token inválido ou expirado. Por favor, insira um token válido.'
        );
        const tokenControl = component.form.get('token');
        expect(tokenControl?.enabled).toBe(true);
        expect(tokenControl?.validator).toBeTruthy();
      });
    }));

    it('should handle 404 error', fakeAsync(() => {
      component.form.setValue({ email: 'test@example.com', board: 'board', token: 'token' });
      personalDataServiceMock.saveUserInfo.mockReturnValue(
        throwError(() => ({ status: 404 }))
      );
      component.onSubmit();
      tick();
      ngZone.run(() => {
        expect(component.errorMessage).toBe('Usuário não encontrado para o email fornecido.');
      });
    }));

    it('should handle other errors', fakeAsync(() => {
      component.form.setValue({ email: 'test@example.com', board: 'board', token: 'token' });
      personalDataServiceMock.saveUserInfo.mockReturnValue(
        throwError(() => ({ status: 500 }))
      );
      component.onSubmit();
      tick();
      ngZone.run(() => {
        expect(component.errorMessage).toBe(
          'Erro ao salvar dados. Por favor, tente novamente.'
        );
      });
    }));
  });
});
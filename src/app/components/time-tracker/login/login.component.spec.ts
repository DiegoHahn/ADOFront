import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
  let mockRouter: Router;
  let mockService: PersonalDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        PersonalDataService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    mockService = TestBed.inject(PersonalDataService);
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form', () => {
    const expectedFormGroup = formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    component.ngOnInit();

    expect(component.loginForm.value).toEqual(expectedFormGroup.value);
  });

  it('should update email errors when email is required', () => {
    component.loginForm.setValue({ email: '' });

    component.updateEmailErrors();

    expect(component.emailErrors).toContain('Email é obrigatório.');
  });  

  it('should update email errors when email is invalid', () => {
    component.loginForm.setValue({ email: 'test' });

    component.updateEmailErrors();

    expect(component.emailErrors).toContain('Por favor, insira um email válido.');
  });  

  it('should call updateEmailErrors on email value changes', fakeAsync(() => {
    jest.spyOn(component, 'updateEmailErrors');

    component.ngOnInit();
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    tick(1000);

    expect(component.updateEmailErrors).toHaveBeenCalled();
  }));

  it('should call onSubmit and navigate on successful login', () => {
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    const mockResponse: UserInformation = {
      hasToken: true,
      email: 'test@example.com',
      board: 'default-board',
      userId: '123'
    };
    jest.spyOn(mockService, 'getUserInformation').mockReturnValue(of(mockResponse));
    jest.spyOn(localStorage, 'setItem');

    component.loginForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(mockService.getUserInformation).toHaveBeenCalledWith('test@example.com');
    expect(localStorage.setItem).toHaveBeenCalledWith('email', 'test@example.com');
    expect(localStorage.setItem).toHaveBeenCalledWith('userInformation', JSON.stringify(mockResponse));
    expect(navigateSpy).toHaveBeenCalledWith(['/activity-tracker', 'activity-form']);
  });

  it('should handle 404 error on onSubmit and navigate to personal-data', () => {
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    jest.spyOn(mockService, 'getUserInformation').mockImplementation(() => throwError(() => ({ status: 404 })));
    jest.spyOn(localStorage, 'setItem');

    component.loginForm.setValue({ email: 'nonexistent@example.com' });
    component.onSubmit();

    expect(mockService.getUserInformation).toHaveBeenCalledWith('nonexistent@example.com');
    expect(localStorage.setItem).toHaveBeenCalledWith('email', 'nonexistent@example.com');
    expect(navigateSpy).toHaveBeenCalledWith(['/activity-tracker', '/personal-data']);
  });

  it('should handle unexpected errors on onSubmit', () => {
    jest.spyOn(console, 'error');
    jest.spyOn(mockService, 'getUserInformation').mockReturnValue(throwError(() => ({ status: 500 })));

    component.loginForm.setValue({ email: 'error@example.com' });
    component.onSubmit();

    expect(mockService.getUserInformation).toHaveBeenCalledWith('error@example.com');
    expect(console.error).toHaveBeenCalledWith('Erro ao buscar informações do usuário:', { status: 500 });
  });

  it('should not call onSubmit if form is invalid', () => {
    jest.spyOn(component, 'onSubmit');

    component.loginForm.setValue({ email: '' });
    component.onSubmit();

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
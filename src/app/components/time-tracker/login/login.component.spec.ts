import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonalDataService } from '../personal-data.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';

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
        // provideHttpClientTesting(), // Esses módulos deprecated como ficam?
        PersonalDataService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockService = TestBed.inject(PersonalDataService);
    formBuilder = TestBed.inject(FormBuilder);
    mockRouter = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
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

});
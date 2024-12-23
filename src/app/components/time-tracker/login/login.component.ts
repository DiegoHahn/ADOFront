import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, debounceTime, map, tap } from 'rxjs/operators';
import { PersonalDataService } from '../personal-data.service';
import { UserInformation } from '../user-information';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  displayError: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  userInformation!: UserInformation;

  constructor(
    private fb: FormBuilder,
    private personalDataService: PersonalDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.setupEmailListener();
  }

  setupEmailListener() {
    this.loginForm.get('email')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      const emailControl = this.loginForm.get('email');
      if (emailControl?.invalid && (emailControl.dirty || emailControl.touched)) {
        this.displayError = true;
        this.errorMessage = this.getEmailErrorMessage(emailControl);
      } else {
        this.displayError = false;
        this.errorMessage = '';
      }
    });
  }

  getEmailErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'Email é obrigatório';
    }

    if (control.hasError('email')) {
      return 'Email inválido';
    }

    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const email = this.loginForm.get('email')?.value;

      this.personalDataService.getUserInformation(email).pipe(
        map(response => response),
        tap(response => {
          if (response) {
            this.userInformation = response;
            localStorage.setItem('email', email);
            localStorage.setItem('userInformation', JSON.stringify(this.userInformation));
            this.router.navigate(['/activity-tracker', 'activity-form']);
          }
        }),
        catchError(error => {
          this.isLoading = false;
          if (error.status === 404) {
            this.router.navigate(['/activity-tracker', '/personal-data']);
            localStorage.setItem('email', email);
          } else {
            console.error('Erro ao buscar informações do usuário:', error);
          }
          return of(null);
        })
      ).subscribe({
        next: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.updateEmailErrors();
    }
  }

  updateEmailErrors() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.invalid) {
      this.displayError = true;
      this.errorMessage = this.getEmailErrorMessage(emailControl);
    }
  }
}
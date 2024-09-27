import { PersonalDataService } from './../personal-data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, map, of, tap } from 'rxjs';
import { UserInformation } from '../user-information';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  userInformation!: UserInformation
  emailErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private personalDataService: PersonalDataService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.loginForm.get('email')?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(() => {
      this.updateEmailErrors();
    });
  }

  updateEmailErrors(): void {
    const emailControl = this.loginForm.get('email');
    this.emailErrors = [];

    if (emailControl?.errors?.['required']) {
      this.emailErrors.push('Email é obrigatório.');
    }
    if (emailControl?.errors?.['email']) {
      this.emailErrors.push('Por favor, insira um email válido.');
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.personalDataService.getUserInformation(this.loginForm.get('email')?.value).pipe(
        map(response => response),
        tap(response => {
          this.userInformation = response;
          console.log('Informações do usuário:', this.userInformation);

          // Armazena o usuário em um serviço (se for passar o token pro back apenas na tela de login pode ser melhor o service aqui e o localStorage na pagina de configurações)
          // this.personalDataService.setUserInformation(this.userInformation); 
       
          // ou no localStorage
          localStorage.setItem('userInformation', JSON.stringify(this.userInformation));

          this.router.navigate(['/activity-form']);
        }),
        catchError(error => {
          console.error('Erro ao buscar informações do usuário:', error);
          return of(null);
        })
      ).subscribe();
    } else {
      this.updateEmailErrors();
    }
  }
}
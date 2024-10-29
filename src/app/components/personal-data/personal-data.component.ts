import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap, debounceTime } from 'rxjs';
import { PersonalDataService } from '../personal-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {
  form!: FormGroup;
  errors: { [key: string]: string[] } = { email: [], board: [] };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private personalDataService: PersonalDataService,
    private router: Router,
  ) {}

  ngOnInit() {
    const email = localStorage.getItem('email');
    this.form = this.formBuilder.group({
      email: [email || '', [Validators.required, Validators.email]],
      board: [''],
      token: ['']
    });

    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.valueChanges.pipe(
        debounceTime(1000)
      ).subscribe(() => {
        this.updateErrors(key);
      });
    });
  }

  updateErrors(field: string): void {
    const control = this.form.get(field);
    this.errors[field] = [];
    if (control?.errors) {
      if (control.errors['required']) {
        this.errors[field].push(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`);
      }
      if (control.errors['email']) {
        this.errors[field].push('Por favor, insira um email válido.');
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.successMessage = null;
      this.errorMessage = null;

      this.personalDataService.saveUserInfo(this.form.value).pipe(
        tap(() => {
          this.router.navigate(['/activity-form']);
        }),
        catchError(error => {
          console.error('Erro ao salvar dados:', error);
          this.successMessage = null;
          this.errorMessage = error;
          return of(null);
        })
      ).subscribe();
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.updateErrors(key);
      });
    }
  }
}


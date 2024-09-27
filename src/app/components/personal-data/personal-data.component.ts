import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, tap, debounceTime } from 'rxjs';
import { PersonalDataService } from '../personal-data.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {
  form!: FormGroup;
  errors: { [key: string]: string[] } = {
    email: [],
    azureUserID: [],
    board: []
  };

  constructor(
    private formBuilder: FormBuilder,
    private personalDataService: PersonalDataService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      azureUserID: ['', Validators.required],
      board: ['', Validators.required]
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

  getAzureUserID() {
    const email = this.form.get('email')?.value;
    this.personalDataService.getAzureUserIDByEmail(email).pipe(
      tap(azureUserID => {
        this.form.patchValue({ azureUserID: azureUserID });
        this.updateErrors('azureUserID');
      }),
      catchError(error => {
        console.error('Erro ao buscar azureUserID:', error);
        return of('');
      })
    ).subscribe();
  }
 
  onSubmit() {
    if (this.form.valid) {
      this.personalDataService.saveUserInfo(this.form.value).pipe(
        tap(() => {
          console.log('Dados salvos com sucesso');
          // Adicione aqui qualquer lógica adicional após salvar
        }),
        catchError(error => {
          console.error('Erro ao salvar dados:', error);
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalDataService } from '../personal-data.service';
import { catchError, map, of, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private personalDataService: PersonalDataService,
    
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userSK: ['', Validators.required,],
      board: ['', Validators.required]
    });
  }

  getUserSK() {
    const email = this.form.get('email')?.value;
    this.personalDataService.getUserSKByEmail(email).pipe(
      tap(userSK => {
        this.form.patchValue({ userSK: userSK });
      }),
      catchError(error => {
        console.error('Erro ao buscar userSK:', error);
        return of('');
      })
    ).subscribe();
  }
  
  onSubmit() {
  this.personalDataService.saveUserInfo(this.form.value).pipe(
    tap(() => {
      //logar alguma coisa?
    }),
    catchError(error => {
      console.error('Erro ao salvar dados:', error);
      return of(null);
    })
  ).subscribe();
  }
}

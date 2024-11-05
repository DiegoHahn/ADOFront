import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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
  errors: { [key: string]: string[] } = { email: [], board: [], token: [] };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private personalDataService: PersonalDataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
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

    this.personalDataService.getUserInformation(email || '').pipe(
      tap(userInformation => {
        if (userInformation) {
          this.form.patchValue(userInformation);
        }
        if (userInformation.hasToken) {
          this.form.get('token')?.disable();
        }
      }),
      catchError(error => {
        console.error('Erro ao carregar dados:', error);
        return of(null);
      })
    ).subscribe();
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

  // onSubmit(): void {
  //   if (this.form.valid) {
  //     this.successMessage = null;
  //     this.errorMessage = null;
  //     this.personalDataService.saveUserInfo(this.form.value).pipe(
  //       catchError(error => {
  //         console.log('Caught error:', error);
  //         this.ngZone.run(() => {
  //           if (error.status === 401) {
  //             this.errorMessage = 'Token inválido ou expirado. Por favor, insira um token válido.';
  //             const tokenControl = this.form.get('token');
  //             tokenControl?.enable();
  //             tokenControl?.setValidators([Validators.required]);
  //             tokenControl?.updateValueAndValidity();
  //           } else if (error.status === 404) {
  //             this.errorMessage = 'Usuário não encontrado para o email fornecido.';
  //           } else {
  //             this.errorMessage = 'Erro ao salvar dados. Por favor, tente novamente.';
  //           }
  //         });
  //         return of(null);
  //       })
  //     ).subscribe(success => {
  //       if (success) {
  //         this.router.navigate(['/activity-form']);
  //       }
  //     });
  //   } else {
  //     Object.keys(this.form.controls).forEach(key => {
  //       this.updateErrors(key);
  //     });
  //   }
  // }

  // isTokenEnabled(): boolean {
  //   const tokenControl = this.form.get('token');
  //   return !tokenControl?.disabled || this.errors['token'].length > 0;
  // }
  // onSubmit(): void {
  //   if (this.form.valid) {
  //     this.successMessage = null;
  //     this.errorMessage = null;
  //     this.personalDataService.saveUserInfo(this.form.value).pipe(
  //       catchError(error => {
  //         console.log('Caught error:', error);
  //         this.ngZone.run(() => {
  //           if (error.status === 401) {
  //             this.errorMessage = 'Token inválido ou expirado. Por favor, insira um token válido.';
  //             const tokenControl = this.form.get('token');
  //             tokenControl?.enable();
  //             tokenControl?.setValidators([Validators.required]);
  //             tokenControl?.updateValueAndValidity();
  //           } else if (error.status === 404) {
  //             this.errorMessage = 'Usuário não encontrado para o email fornecido.';
  //           } else {
  //             this.errorMessage = 'Erro ao salvar dados. Por favor, tente novamente.';
  //           }
  //         });
  //         return of(null);
  //       })
  //     ).subscribe(success => {
  //       if (success) {
  //         this.router.navigate(['/activity-form']);
  //       }
  //     });
  //   } else {
  //     Object.keys(this.form.controls).forEach(key => {
  //       this.updateErrors(key);
  //     });
  //   }
  // }
  onSubmit(): void {
    if (this.form.valid) {
      this.successMessage = null;
      this.errorMessage = null;
  
      this.personalDataService.saveUserInfo(this.form.value).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/activity-form']);
          }
        },
        error => {
          console.log('Caught error in subscribe:', error);
          this.ngZone.run(() => {
            if (error.status === 401) {
              this.errorMessage = 'Token inválido ou expirado. Por favor, insira um token válido.';
              const tokenControl = this.form.get('token');
              tokenControl?.enable();
              tokenControl?.setValidators([Validators.required]);
              tokenControl?.updateValueAndValidity();
            } else if (error.status === 404) {
              this.errorMessage = 'Usuário não encontrado para o email fornecido.';
            } else {
              this.errorMessage = 'Erro ao salvar dados. Por favor, tente novamente.';
            }
          });
        }
      );
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.updateErrors(key);
      });
    }
  }
  // onSubmit(): void {
  //   if (this.form.valid) {
  //     this.successMessage = null;
  //     this.errorMessage = null;
  
  //     this.personalDataService.saveUserInfo(this.form.value).subscribe(
  //       (success) => {
  //         if (success) {
  //           this.router.navigate(['/activity-form']);
  //         }
  //       },
  //       (error) => {
  //         console.log('Caught error in subscribe:', error);
  //         this.ngZone.run(() => {
  //           if (error.status === 401) {
  //             this.errorMessage = 'Token inválido ou expirado. Por favor, insira um token válido.';
  //             const tokenControl = this.form.get('token');
  //             if (tokenControl) {
  //               tokenControl.enable();
  //               tokenControl.setValue(''); // Limpa o valor do campo
  //               tokenControl.setValidators([Validators.required]); // Adiciona validação
  //               tokenControl.updateValueAndValidity();
  //             }
  //           } else if (error.status === 404) {
  //             this.errorMessage = 'Usuário não encontrado para o email fornecido.';
  //           } else {
  //             this.errorMessage = 'Erro ao salvar dados. Por favor, tente novamente.';
  //           }
  //         });
  //         this.cdr.detectChanges(); 
  //       }
  //     );
  //   } else {
  //     Object.keys(this.form.controls).forEach((key) => {
  //       this.updateErrors(key);
  //     });
  //   }
  // }
}
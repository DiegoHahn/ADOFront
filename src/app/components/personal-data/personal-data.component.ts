import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userSK: ['', Validators.required,],
      board: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Formulário enviado com sucesso:', this.form.value);
    
    } else {
      console.log('Formulário inválido');
    }
  }
}

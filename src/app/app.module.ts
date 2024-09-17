import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ActivityFormComponent } from './components/activity-form/activity-form.component';
import { ControlButtonsComponent } from './components/control-buttons/control-buttons.component';


@NgModule({
  declarations: [
    AppComponent,
    ActivityFormComponent,
    ControlButtonsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
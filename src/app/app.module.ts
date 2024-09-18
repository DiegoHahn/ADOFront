import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivityFormComponent } from './components/activity-form/activity-form.component';
import { ControlButtonsComponent } from './components/control-buttons/control-buttons.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';


@NgModule({
  declarations: [
    AppComponent,
    ActivityFormComponent,
    PersonalDataComponent,
    ControlButtonsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
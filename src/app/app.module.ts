import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
    // HttpClientModule //perguntar
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
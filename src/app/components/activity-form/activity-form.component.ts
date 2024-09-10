import { Component } from '@angular/core';
import { ControlButtonsComponent } from "../control-buttons/control-buttons.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [ControlButtonsComponent, CommonModule],
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent {
  originalEstimate: number = 123;
  workItems: string[] = ['Work Item 1', 'Work Item 2', 'Work Item 3'];

  constructor() { }
  
}

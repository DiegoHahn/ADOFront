import { Component } from '@angular/core';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  // standalone: true,
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent {
  start() {
    console.log("Start");
  }

  stop() {
    console.log("Stop");
  }
  
  exit() {
    console.log("Exit");
  }
}

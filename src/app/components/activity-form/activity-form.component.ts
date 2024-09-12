import { Component, OnInit } from '@angular/core';
import { ControlButtonsComponent } from "../control-buttons/control-buttons.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TargetWorkItem } from '../target-workItem';
import { WorkItemService } from '../work-item.service';

@Component({
  selector: 'app-activity-form',
  // standalone: true,
  // imports: [ControlButtonsComponent, CommonModule, FormsModule],
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {
  originalEstimate: number | null = null;
  workItems: TargetWorkItem[] = [];
  selectedWorkItem: TargetWorkItem | null = null;
  userStoryId: string = '';

  constructor(private workItemService: WorkItemService) { }

  ngOnInit() {
  }

  onUserStoryChange() {
    if (this.userStoryId) {
      this.workItemService.getWorkItemsForUserStory(this.userStoryId).subscribe(
        (items: TargetWorkItem[]) => {
          this.workItems = items;
        },
        (error: any) => {
          console.error('Erro ao buscar work items:', error);
        }
      );
    }
  }

  onWorkItemSelect() {
    if (this.selectedWorkItem) {
      this.originalEstimate = this.selectedWorkItem.originalEstimate;
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { Schedule } from '../schedule';
import { ScheduleService } from '../schedule.service';
import { MessageService } from '../message.service';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {

  constructor(private scheduleService: ScheduleService, private messageService: MessageService) { }

  schedules : Schedule[];

  days: any[];
  types: any[];

  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';

  fileInfos: Observable<any>;

  schedule = {active: true};

  form: FormGroup;
  payLoad = '';
  ngOnInit(): void {
    this.getSchedules();
    this.getDays();
    this.getTypes();
  }

  getSchedules(): void {
    this.scheduleService.getSchedules()
        .subscribe(schedules => this.schedules = schedules);
  }

  getDays(): void {
    this.scheduleService.getDays()
        .subscribe(days => this.days = days);
  }

  getTypes(): void {
    this.scheduleService.getTypes()
        .subscribe(types => this.types = types);
  }

  add(schedule : Schedule) {
    this.scheduleService.addSchedule(schedule)
    .subscribe(schedule => {
      this.schedules.push(schedule);
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload(event) {
    this.progress = 0;

    this.selectedFiles = event.target.files;
    this.currentFile = this.selectedFiles.item(0);
    this.scheduleService.upload(this.currentFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.messageService.add("uploaded "+event.body );
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
        this.messageService.add(this.message );
      });
  
  }
}

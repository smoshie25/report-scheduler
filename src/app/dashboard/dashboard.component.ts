import { Component, OnInit } from '@angular/core';
import { Schedule } from '../schedule';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  schedules: Schedule[] = [];

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.getSchedules();
  }

  getSchedules(): void {
    this.scheduleService.getSchedules()
      .subscribe(schedules => this.schedules = schedules.slice(1, 5));
  }
}
import { Component, OnInit, Input } from '@angular/core';
import { Schedule } from '../schedule';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ScheduleService } from '../schedule.service';


@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit {

  @Input() schedule: Schedule;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getSchedule();
  }

  getSchedule(): void {
    this.scheduleService.getSchedule(this.route.snapshot.paramMap.get('id'))
      .subscribe(schedule => this.schedule = schedule);
  }

  goBack(): void {
    this.location.back();
  }
}

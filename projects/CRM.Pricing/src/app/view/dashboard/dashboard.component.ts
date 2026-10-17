import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'common/services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  constructor(private notificationService: NotificationService) {
    this.notificationService.getMessage();
  }

  ngOnInit(): void { }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notifications } from 'common/entities';
import { NotificationService } from 'common/services';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {

  public notificationActionMStoneFlag: boolean = false;
  public selectedNotification: Notifications = new Notifications();

  constructor(private router: Router, public notificationService: NotificationService) {
    sessionStorage.getItem("userToken") != null
      ? this.notificationService.connectWebsocket(JSON.parse(sessionStorage.getItem("userToken") ?? "").ident)
      : null
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem("fxCredentials"))
      this.router.navigate(["login"]);
  }

  public toggleNotification(event: Notifications) {
    // this.leadId = event.param;
    this.selectedNotification = new Notifications();
    this.selectedNotification = event;
    if (event.action.toLowerCase() == "manualissuemodal")
      this.notificationActionMStoneFlag = !this.notificationActionMStoneFlag;
  }
}
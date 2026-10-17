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

  public notificationActionFlag = false;
  public leadId!: string;

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
    this.leadId = event.param;
    if (event.action)
      this.notificationActionFlag = !this.notificationActionFlag;
  }

  public closeDialogLead(event: boolean) {
    this.notificationActionFlag = event;
  }

}
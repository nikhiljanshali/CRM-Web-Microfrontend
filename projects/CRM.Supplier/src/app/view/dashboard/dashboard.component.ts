import { Component, OnInit } from '@angular/core';
import { Notifications } from 'common/entities';
import { NotificationService } from 'common/services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  public message: Notifications = new Notifications();

  constructor(public notificationService: NotificationService) {
    this.notificationService.getMessage();
  }


  ngOnInit(): void {
    this.message.icon = "icon-info";
    this.message.title = "notify infotmation";
    this.message.categoryType = "information";
    this.message.description = "notify infotmation description";
    this.message.action = "";
    this.message.param = "notify infotmation param";
    this.message.senderId = JSON.parse(sessionStorage.getItem("userToken") ?? "").ident;
    this.message.receiverId = "616657e24768be53845f0aaa";

  }

  public sendMessage() {
    this.notificationService.messages.next(this.message)
  }


}
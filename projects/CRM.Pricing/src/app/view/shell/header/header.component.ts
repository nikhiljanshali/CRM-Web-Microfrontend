import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertdialogService } from 'common/views';
import { fxCredential, Notifications } from 'common/entities';
import { NotificationService, WebsocketService } from 'common/services';
import { NotificationResponse } from 'common/businessobjects';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})

export class HeaderComponent implements OnInit {

  @Input() user: any;
  public notifications!: NotificationResponse;
  public message: Notifications = new Notifications();
  public notificationShow: boolean = false;
  public fxCredentials!: fxCredential;

  constructor(private router: Router,
    private alertDialogService: AlertdialogService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService) {

    notificationService.messageResponse.subscribe(msg => {
      if (msg) {
        let messages = JSON.parse(msg);
        this.notifications.notifications.unshift(messages);
        this.notifications.notifications.splice(-1);
      }
    });

  }

  ngOnInit(): void {
    this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.loadNotifications();
  }

  public async loadNotifications() {
    try {
      this.notifications = await this.notificationService.getMessgeByReceiver(this.fxCredentials.id);
      this.notifications.notifications.reverse();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public async removeNotification(i: number, notification: Notifications) {
    try {
      let id = ""

      if (notification.Id)
        id = notification.Id
      else
        id = notification.id

      if (id)
        await this.notificationService.deleteMessage(id);

      this.notifications.notifications.splice(i, 1);
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show('notification does not delete, try again later.');
    }

  }

  public notificationClick() {
    this.notificationShow = !this.notificationShow;
  }

  public logoutClick(): void {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to Logout?", "Logout").subscribe((res: any) => {
      if (res.flag)
        this.logOut();
    });
  }

  public async logOut(): Promise<void> {
    try {
      await this.notificationService.deleteConnectionSocket(JSON.parse(sessionStorage.getItem("userToken") ?? "").ident);
      this.websocketService.subject = undefined as any;
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(["/login"]);
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);

    }

  }

  public notificationActionClick(i: number, notification: Notifications) {
    if (notification.action.includes('/'))
      this.router.navigate([notification.action]);
    this.removeNotification(i, notification);
  }

  public sendToNotificationPage() {
    this.notificationClick();
    this.router.navigateByUrl("/notifications");
  }

}
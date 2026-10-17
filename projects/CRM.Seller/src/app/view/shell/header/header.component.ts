import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationResponse } from 'common/businessobjects';
import { Notifications, fxCredential } from 'common/entities';
import { NotificationService, WebsocketService } from 'common/services';
import { AlertdialogService } from 'common/views';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})

export class HeaderComponent implements OnInit {

  @Input() user: any;
  @Output() toggleNotification: EventEmitter<any> = new EventEmitter();
  public notifications!: NotificationResponse;
  public message: Notifications = new Notifications();
  public notificationShow: boolean = false;
  public fxCredentials!: fxCredential;
  
  constructor(private router: Router,
    private alertDialogService: AlertdialogService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService
  ) { 
    notificationService.messageResponse.subscribe(msg => {
      if (msg) {
        let messages = JSON.parse(msg);
        this.notifications.notifications.unshift(messages);
        this.notifications.notifications.splice(-1);
      }
    });

  }

  async ngOnInit() {
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

  public notificationClick() {
    this.notificationShow = !this.notificationShow;
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
      this.alertDialogService.show(error.error);

    }

  }

  public logoutClick(): void {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to Logout?", "Logout").subscribe(async (res: any) => {
      if (res.flag)
        await this.logOut();
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

  public notificationActionClick(notification: Notifications) {
    if (notification.action)
      this.toggleNotification.emit(notification);
  }

  public sendToNotificationPage() {
    this.notificationClick();
    this.router.navigateByUrl("/notifications");
  }

}
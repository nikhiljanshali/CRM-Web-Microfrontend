import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'common/services';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {

  constructor(private router: Router, public notificationService: NotificationService) {
    sessionStorage.getItem("userToken") != null
      ? this.notificationService.connectWebsocket(JSON.parse(sessionStorage.getItem("userToken") ?? "").ident)
      : null;
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem("fxCredentials"))
      this.router.navigate(["login"]);

  }

}
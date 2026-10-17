import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertdialogService } from 'common/views';
import { SuggestionService } from 'shared/services';

@Component({
  selector: 'app-customer-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {
  public isLogin: boolean = false;
  public navpanelFlag = false;

  constructor(private router: Router,
    private alertdialogService: AlertdialogService,
    private suggestionSharedService: SuggestionService
  ) {
  }

  public async ngOnInit() {
    this.defaultMethodsLoad();
  }

  defaultMethodsLoad() {
    if (sessionStorage.getItem("userToken"))
      this.isLogin = true;
    //this.loadScripts();
  }

  loadScripts() {
    let documentNotificationBar: any = document;
    // Top Notification
    documentNotificationBar.querySelector(".o-click").addEventListener("click", function () {
      documentNotificationBar.querySelector(".noti-wrap").classList.toggle("active");
    });

  }

  public logoutClick(): void {
    this.alertdialogService.ConfirmYesNo("Are you sure you want to Logout?", "Logout").subscribe((res: any) => {
      if (res.flag)
        this.logOut();
    });
  }

  public logOut(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  // Navigation panel
  public navpanelSidebar() {
    this.navpanelFlag = !this.navpanelFlag;
  }

  public async showSuggestionDialog() {
    this.navpanelFlag = false;
    this.suggestionSharedService.setSuggestion(true);
  }

  public navigateToPage(value: string): void {
    this.navpanelFlag = false;
    this.router.navigate(['/', value]);
  }
}

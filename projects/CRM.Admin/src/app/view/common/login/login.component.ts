import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppPreloadService } from 'common/services/common/apppreload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { LoginModel, LoginResponse } from 'common/entities'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public loginModelObj: LoginModel = new LoginModel();

  public loginLoading: boolean = false;
  public loginError: boolean = false;
  public errorMsg: string = ''

  constructor(private router: Router,
    private appPreloadService: AppPreloadService,
    private spinnerService: NgxSpinnerService,
    private alertDialogService: AlertdialogService,
    private utilityService: UtilityService,
    private accountService: AccountService) { }

  async ngOnInit() {
    this.clearSession();
  }

  public async login(form: NgForm) {
    try {
      this.loginError = false;
      if (form.valid) {
        this.loginModelObj.client_id = 'ngAuthApp';
        this.startLoginLoading();
        let response = await this.accountService.loginUser(this.loginModelObj);
        if (response) {
          if (response.origin.toLowerCase() != "admin") {
            this.utilityService.showNotification("User does not have rights to access this site.", "error");
            this.stopLoginLoading();
            return;
          }
          sessionStorage.setItem("userToken", JSON.stringify(response));
          this.setSession(response);
        }
        else {
          this.stopLoginLoading();
          this.utilityService.showNotification("Something went wrong, Try again later.", "error");
        }
      }
    }
    catch (error: any) {
      this.loginError = true;
      this.stopLoginLoading();

      this.errorMsg = error.error;

      if (error && error.error && error.error.toLowerCase() == 'invalid user')
        this.errorMsg = "This user is invalid!";
      else if (error && error.error && error.error.toLowerCase() == 'password is invalid')
        this.errorMsg = "Password is wrong!";
    }
  }

  private async setSession(authToken: LoginResponse) {
    try {
      var credential = await this.appPreloadService.fetchFxCredentials(authToken.ident);
      if (credential) {
        var userPermission = await this.appPreloadService.fetchUserPermission(authToken.ident);
        if (userPermission) {
          this.stopLoginLoading();
          this.router.navigate(["dashboard"]);
        } else
          this.stopLoginLoading();
      } else
        this.stopLoginLoading();
    }
    catch (error: any) {
      this.loginError = true;
      this.stopLoginLoading();

      this.errorMsg = error.error;
    }
  }

  private startLoginLoading() {
    this.loginLoading = true;
    this.spinnerService.show();
  }

  private stopLoginLoading() {
    this.loginLoading = false;
    this.spinnerService.hide();
  }

  private clearSession(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

}
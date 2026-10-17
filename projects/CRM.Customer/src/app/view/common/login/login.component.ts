import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginModel, LoginResponse } from 'shared/enitites';
import { AccountService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { AppPreloadService } from '../../../services';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
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
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.clearSession();
  }

  public async login(form: NgForm) {
    try {
      if (form.valid) {
        this.loginModelObj.client_id = 'ngAuthApp';
        this.startLoginLoading();
        let response = await this.accountService.loginUser(this.loginModelObj);
        if (response) {
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
        this.stopLoginLoading();
        this.router.navigate(["dashboard"]);
      }
      else {
        this.stopLoginLoading();
        this.utilityService.showNotification("Credential Not Found", "error");
      }
    }
    catch (error: any) {
      this.stopLoginLoading();
      this.utilityService.showNotification(error.error, "error");
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

  public loginClick() {
    let user = {
      email: "sampleUser@gmail.com",
      userName: "sampleUser",
      password: "123564",
      origin: "Admin"
    }
    // this.authenticationService.setLoginUser(user);
    this.router.navigate(['dashboard']);
  }
  public registerClick() {
    this.router.navigate(['register']);
  }
  public forgotClick() {
    this.router.navigate(['forgotpass']);
  }

  public navigateBackward(): void {
    window.history.back();
  }

}

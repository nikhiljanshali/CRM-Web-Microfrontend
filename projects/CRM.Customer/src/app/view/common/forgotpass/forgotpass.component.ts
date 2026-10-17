import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html'
})

export class ForgotpassComponent implements OnInit {
  emailSection: boolean = true;
  codeSection: boolean = false;
  setPasswordSection: boolean = false;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  sendEmail() {
    this.emailSection = !this.emailSection;
    this.codeSection = !this.emailSection;
  }

  verifiedOTP() {
    this.codeSection = !this.codeSection;
    this.setPasswordSection = !this.codeSection;
  }

  public changePasswordClick() {
    this.router.navigate(['login']);
  }

  public navigateBackward(): void {
    window.history.back();
  }

}

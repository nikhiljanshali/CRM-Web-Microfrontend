import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cpassword',
  templateUrl: './cpassword.component.html'
})
export class CpasswordComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public navigateBackward(): void {
    window.history.back();
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-geotracking',
  templateUrl: './geotracking.component.html',
  styles: [
  ]
})
export class GeotrackingComponent implements OnInit {

  public isLoginHistory: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

  public openLoginHistoryDialog() {
    this.isLoginHistory = true;
  }

  public closeLoginHistoryDialog() {
    this.isLoginHistory = false;
  }

}

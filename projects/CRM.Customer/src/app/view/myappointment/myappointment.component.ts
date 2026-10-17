import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myappointment',
  templateUrl: './myappointment.component.html',
  styles: [
  ]
})
export class MyappointmentComponent implements OnInit {

  public filterFlag = false;
  public isAppointment = false;

  constructor() { }

  ngOnInit(): void {
  }

  public filterSidebar() {
    this.filterFlag = !this.filterFlag;
  }

  //Send mail view
  public openAppointmentDialog(): void {
    this.isAppointment = true;
  }

  public closeAppointmentDialog(): void {
    this.isAppointment = false;
  }

}

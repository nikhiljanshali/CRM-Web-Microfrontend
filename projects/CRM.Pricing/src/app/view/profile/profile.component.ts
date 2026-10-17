import { Component, OnInit } from '@angular/core';
import { Employee } from 'common/businessobjects';
import { fxCredential } from 'common/entities';
import { EmployeeService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  public employeeObj: Employee = new Employee();
  public fxCredentials!: fxCredential;

  constructor(private employeeService: EmployeeService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Initialize Data
  async defaultMethodsLoad() {
    this.spinnerService.show();
    
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.getEmployeeData(this.fxCredentials.id);
  }

  public async getEmployeeData(id: string) {
    try {
      this.employeeObj = await this.employeeService.getEmployeeById(id);
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

}

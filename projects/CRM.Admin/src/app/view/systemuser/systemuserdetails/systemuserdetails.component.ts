import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemUser } from '../../../businessobjects';
import { SystemUserService } from '../../../services/systemuser/systemuser.service';

@Component({
  selector: 'app-systemuserdetails',
  templateUrl: './systemuserdetails.component.html',
  styles: [
  ]
})
export class SystemuserdetailsComponent implements OnInit {

  public systemUserObj: SystemUser = new SystemUser();

  constructor(private systemUserService: SystemUserService,
    private alertDialogService: AlertdialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinnerService: NgxSpinnerService) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Initialize Data
  async defaultMethodsLoad() {
    this.spinnerService.show();
    this.activatedRoute.params.subscribe(async params => {
      const id = params['id'];
      await this.getEmployeeData(id);
    });
  }

  public async getEmployeeData(id: string) {
    try {
      this.systemUserObj = await this.systemUserService.getSystemUserById(id);
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

}

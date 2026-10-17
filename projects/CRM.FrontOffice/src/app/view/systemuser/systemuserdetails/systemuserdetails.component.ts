import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterConfig, MasterDNorm } from 'shared/enitites';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemUser, fxCredential, SystemUserDNorm, UserPricingCriteria, EmailConfig } from '../../../entities';
import { MasterConfigService, SystemUserService, UserPricingCriteriaService } from '../../../services';

@Component({
  selector: 'app-systemuserdetails',
  templateUrl: './systemuserdetails.component.html'
})
export class SystemuserdetailsComponent implements OnInit {
  public systemUserObj: SystemUser = new SystemUser;
  public isAddPricingCriteria: boolean = false;

  public masterConfigList!: MasterConfig;

  public ShapesList: MasterDNorm[] = [];
  public LabList: MasterDNorm[] = [];
  public ColorList: MasterDNorm[] = [];
  public ClarityList: MasterDNorm[] = [];
  public FluorList: MasterDNorm[] = [];
  public CPSList: MasterDNorm[] = [];

  public allTheLab: Array<{ name: string; isChecked: boolean }> = [];
  public allTheShapes: Array<{ name: string; isChecked: boolean }> = [];
  public allColors: Array<{ name: string; isChecked: boolean }> = [];
  public allClarities: Array<{ name: string; isChecked: boolean }> = [];
  public allTheFluorescences: Array<{ name: string; isChecked: boolean }> = [];
  public allTheCut: Array<{ name: string; isChecked: boolean }> = [];
  public allTheSymm: Array<{ name: string; isChecked: boolean }> = [];
  public allThePolish: Array<{ name: string; isChecked: boolean }> = [];

  public errWeight: string = '';
  public errDays: string = '';
  public errLimit: string = '';

  public systemUserCriteriaData: UserPricingCriteria[] = [];
  public systemUserCriteriaObj: UserPricingCriteria = new UserPricingCriteria();
  public insertFlag: boolean = true;

  public fxCredentials!: fxCredential | null;

  public lastDivNumber = [3, 7, 11, 15, 19];

  public filterShape: string = '';
  public filterShapeChk: boolean = true;
  public filterLab: string = '';
  public filterLabChk: boolean = true;
  public filterColor: string = '';
  public filterColorChk: boolean = true;
  public filterClarity: string = '';
  public filterClarityChk: boolean = true;
  public filterCut: string = '';
  public filterCutChk: boolean = true;
  public filterPolish: string = '';
  public filterPolishChk: boolean = true;
  public filterSymm: string = '';
  public filterSymmChk: boolean = true;
  public filterFlour: string = '';
  public filterFlourChk: boolean = true;

  public emailConfig: EmailConfig = new EmailConfig();
  public tempEmailConfig: EmailConfig = new EmailConfig();
  public isMarketingEditable = false;

  constructor(private systemUserService: SystemUserService,
    private alertDialogService: AlertdialogService,
    private activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private systemUserCriteriaService: UserPricingCriteriaService,
    private spinnerService: NgxSpinnerService) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Initialize Data
  async defaultMethodsLoad() {
    this.spinnerService.show();
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    this.activatedRoute.params.subscribe(async params => {
      const id = params['id'];
      await this.getSystemUserData(id);
      await this.getMasterConfigData();
      await this.getUserPricingCriteriaData(id);
    });
  }

  public async getSystemUserData(id: string) {
    try {
      this.systemUserObj = await this.systemUserService.getSystemUserById(id);

      this.emailConfig = { ...this.systemUserObj.emailConfig };
      this.tempEmailConfig = { ...this.systemUserObj.emailConfig };

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region Master Config Data
  public async getMasterConfigData() {
    //Master Config
    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();

    this.ShapesList = this.masterConfigList.shape;
    let allTheShapes = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.shape);
    allTheShapes.forEach(z => { this.allTheShapes.push({ name: z.name, isChecked: false }); });

    this.ColorList = this.masterConfigList.colors;
    let allColors = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.colors);
    allColors.forEach(z => { this.allColors.push({ name: z.name, isChecked: false }); });

    this.ClarityList = this.masterConfigList.clarities;
    let allClarities = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.clarities);
    allClarities.forEach(z => { this.allClarities.push({ name: z.name, isChecked: false }); });

    this.FluorList = this.masterConfigList.fluorescence;
    let allTheFluorescences = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.fluorescence);
    allTheFluorescences.forEach(z => { this.allTheFluorescences.push({ name: z.name, isChecked: false }); });

    this.CPSList = this.masterConfigList.cps;
    let allTheCPS = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.cps);
    allTheCPS.forEach(z => { this.allTheCut.push({ name: z.name, isChecked: false }); });
    allTheCPS.forEach(z => { this.allThePolish.push({ name: z.name, isChecked: false }); });
    allTheCPS.forEach(z => { this.allTheSymm.push({ name: z.name, isChecked: false }); });

    this.LabList = this.masterConfigList.lab;
    let allTheLab = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.lab);
    allTheLab.forEach(z => { this.allTheLab.push({ name: z.name, isChecked: false }); });
  }
  //#endregion

  //#region SystemUser Criteria CRUD
  public async getUserPricingCriteriaData(id: string) {
    try {
      this.systemUserCriteriaData = await this.systemUserCriteriaService.getUserPricingCriteriaBySystemUser(id);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async onCriteriaSubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType = '';
        let response!: any;

        if (this.insertFlag) {
          this.setManualDataForInsert();

          messageType = 'inserted';
          response = await this.systemUserCriteriaService.criteriaInsert(this.systemUserCriteriaObj);
        }
        else {
          this.systemUserCriteriaObj.updatedBy = this.fxCredentials?.id ?? '';

          messageType = 'updated';
          response = await this.systemUserCriteriaService.criteriaUpdate(this.systemUserCriteriaObj);
        }

        if (response) {
          this.spinnerService.hide();
          this.clearPricingCriteria();
          if (action)
            this.closeAddPricingCriteria();
          this.utilityService.showNotification(`Record ` + messageType + ` successfully!`);
          await this.getUserPricingCriteriaData(this.systemUserObj.id);
        }
        else {
          this.spinnerService.hide();
          this.utilityService.showNotification(`Something went wrong, Try again later!`)
        }

      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public setManualDataForInsert() {
    let empDNorm: SystemUserDNorm = new SystemUserDNorm();
    empDNorm.id = this.systemUserObj.id;
    empDNorm.name = this.systemUserObj.fullName;
    empDNorm.mobile = this.systemUserObj.mobile;
    empDNorm.email = this.systemUserObj.email;
    empDNorm.address = this.systemUserObj.address;
    this.systemUserCriteriaObj.systemUser = empDNorm;

    this.systemUserCriteriaObj.id = '';
    this.systemUserCriteriaObj.createdBy = this.fxCredentials?.id ?? '';

    this.systemUserCriteriaObj.organizations = [];
  }

  public openDeleteDialog(id: string) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.systemUserCriteriaService.deleteCriteria(id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.spinnerService.hide();
              await this.getUserPricingCriteriaData(this.systemUserObj.id);
              this.utilityService.showNotification(`Record deleted successfully!`)
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region OnChange Function
  public openAddPricingCriteria(form?: NgForm): void {
    this.clearPricingCriteria(form);
    this.isAddPricingCriteria = true;
  }

  public closeAddPricingCriteria(): void {
    this.isAddPricingCriteria = false;
  }

  public editPricingCriteria(obj: UserPricingCriteria, isCopy: boolean = false): void {
    this.insertFlag = isCopy;
    this.systemUserCriteriaObj = new UserPricingCriteria();
    this.systemUserCriteriaObj = { ...obj };
    this.checkForCheckBoxInput();
    this.isAddPricingCriteria = true;
  }

  public checkForCheckBoxInput(): void {
    this.utilityService.onMultiSelectChange(this.allTheShapes, this.systemUserCriteriaObj.shape);
    this.utilityService.onMultiSelectChange(this.allTheLab, this.systemUserCriteriaObj.lab);
    this.utilityService.onMultiSelectChange(this.allColors, this.systemUserCriteriaObj.color);
    this.utilityService.onMultiSelectChange(this.allClarities, this.systemUserCriteriaObj.clarity);
    this.utilityService.onMultiSelectChange(this.allTheCut, this.systemUserCriteriaObj.cut);
    this.utilityService.onMultiSelectChange(this.allThePolish, this.systemUserCriteriaObj.polish);
    this.utilityService.onMultiSelectChange(this.allTheSymm, this.systemUserCriteriaObj.symmetry);
    this.utilityService.onMultiSelectChange(this.allTheFluorescences, this.systemUserCriteriaObj.fluorescence);
  }

  public clearPricingCriteria(form?: NgForm): void {
    this.systemUserCriteriaObj = new UserPricingCriteria();
    form?.reset();
    this.errWeight = '';
    this.errDays = '';
    this.errLimit = '';
    this.checkForCheckBoxInput();
    this.insertFlag = true;
  }

  public tagMapper(tags: any[]): void {
    // This function is used for hide selected items in multiselect box
  }
  //#endregion

  public enableMarketingSaveChanges() {
    this.isMarketingEditable = true;
  }

  public disabledMarketingConfiguration() {
    this.isMarketingEditable = false;
    this.emailConfig = this.tempEmailConfig;
  }

  public async submitMarketingEmail(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let message = '';
        if (JSON.stringify(this.emailConfig) !== JSON.stringify(this.tempEmailConfig)) {
          let responseUpdate = await this.systemUserService.updateMarketingEmail(this.emailConfig, this.systemUserObj.id);
          if (responseUpdate) {
            message = "Email config updated successfully!";
            this.tempEmailConfig = { ...this.emailConfig };
            this.isMarketingEditable = false;
          }
          else
            message = "Something went wrong while updating email config";
        }
        else {
          message = "Email config updated successfully!";
          this.isMarketingEditable = false;
        }

        this.spinnerService.hide();
        this.utilityService.showNotification(message)
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
}

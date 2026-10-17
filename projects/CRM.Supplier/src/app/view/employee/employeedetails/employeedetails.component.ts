import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Employee, EmployeeDNorm, EmployeeCriteria } from 'common/businessobjects';
import { fxCredential, MasterConfig, MasterDNorm } from 'common/entities';
import { EmployeeService, EmployeeCriteriaService, MasterConfigService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employeedetails',
  templateUrl: './employeedetails.component.html'
})
export class EmployeedetailsComponent implements OnInit {

  public employeeObj: Employee = new Employee;
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

  public employeeCriteriaData: EmployeeCriteria[] = [];
  public employeeCriteriaObj: EmployeeCriteria = new EmployeeCriteria();
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


  constructor(private employeeService: EmployeeService,
    private alertDialogService: AlertdialogService,
    private activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private employeeCriteriaService: EmployeeCriteriaService,
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
      await this.getEmployeeData(id);
      await this.getMasterConfigData();
      await this.getEmployeeCriteriaData(id);
    });
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

  //#region Employee Criteria CRUD
  public async getEmployeeCriteriaData(id: string) {
    try {
      this.employeeCriteriaData = await this.employeeCriteriaService.getEmpCriteriaByEmp(id);
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
          response = await this.employeeCriteriaService.criteriaInsert(this.employeeCriteriaObj);
        }
        else {
          this.employeeCriteriaObj.updatedBy = this.fxCredentials?.id ?? '';

          messageType = 'updated';
          response = await this.employeeCriteriaService.criteriaUpdate(this.employeeCriteriaObj);
        }

        if (response) {
          this.spinnerService.hide();
          this.clearPricingCriteria();
          if (action)
            this.closeAddPricingCriteria();
          this.utilityService.showNotification(`Record ` + messageType + ` successfully!`);
          await this.getEmployeeCriteriaData(this.employeeObj.id);
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
    let empDNorm: EmployeeDNorm = new EmployeeDNorm();
    empDNorm.id = this.employeeObj.id;
    empDNorm.name = this.employeeObj.fullName;
    empDNorm.department = this.employeeObj.department;
    empDNorm.departmentId = this.employeeObj.departmentId;
    empDNorm.organization = this.employeeObj.organization;
    empDNorm.branch = this.employeeObj.branch.name;
    empDNorm.mobile = this.employeeObj.mobile;
    empDNorm.email = this.employeeObj.email;
    empDNorm.address = this.employeeObj.address;
    this.employeeCriteriaObj.employee = empDNorm;

    this.employeeCriteriaObj.id = '';
    this.employeeCriteriaObj.createdBy = this.fxCredentials?.id ?? '';

    this.employeeCriteriaObj.organizations = [];
    this.employeeCriteriaObj.organizations.push(this.employeeObj.organization.name);
  }

  public openDeleteDialog(id: string) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.employeeCriteriaService.deleteCriteria(id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.spinnerService.hide();
              await this.getEmployeeCriteriaData(this.employeeObj.id);
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

  public editPricingCriteria(obj: EmployeeCriteria, isCopy: boolean = false): void {
    this.insertFlag = isCopy;
    this.employeeCriteriaObj = new EmployeeCriteria();
    this.employeeCriteriaObj = { ...obj };
    this.checkForCheckBoxInput();
    this.isAddPricingCriteria = true;
  }

  public checkForCheckBoxInput(): void {
    this.utilityService.onMultiSelectChange(this.allTheShapes, this.employeeCriteriaObj.shape);
    this.utilityService.onMultiSelectChange(this.allTheLab, this.employeeCriteriaObj.lab);
    this.utilityService.onMultiSelectChange(this.allColors, this.employeeCriteriaObj.color);
    this.utilityService.onMultiSelectChange(this.allClarities, this.employeeCriteriaObj.clarity);
    this.utilityService.onMultiSelectChange(this.allTheCut, this.employeeCriteriaObj.cut);
    this.utilityService.onMultiSelectChange(this.allThePolish, this.employeeCriteriaObj.polish);
    this.utilityService.onMultiSelectChange(this.allTheSymm, this.employeeCriteriaObj.symmetry);
    this.utilityService.onMultiSelectChange(this.allTheFluorescences, this.employeeCriteriaObj.fluorescence);
  }

  public clearPricingCriteria(form?: NgForm): void {
    this.employeeCriteriaObj = new EmployeeCriteria();
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

}

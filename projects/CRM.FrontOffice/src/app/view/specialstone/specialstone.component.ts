import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fxCredential, MasterConfig, MasterDNorm } from 'shared/enitites';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterConfigService, SpecialstonecriteriaService } from '../../services';
import { SpecialStoneCriteria } from '../../entities';

@Component({
  selector: 'app-specialstone',
  templateUrl: './specialstone.component.html'
})
export class SpecialStoneComponent implements OnInit {
  public isAddCriteria: boolean = false;

  public masterConfigList!: MasterConfig;

  public ShapesList: MasterDNorm[] = [];
  public LabList: MasterDNorm[] = [];
  public ColorList: MasterDNorm[] = [];
  public ClarityList: MasterDNorm[] = [];
  public FluorList: MasterDNorm[] = [];
  public CPSList: MasterDNorm[] = [];
  public GreenList: MasterDNorm[] = [];
  public BrownList: MasterDNorm[] = [];
  public MilkyList: MasterDNorm[] = [];

  public allTheLab: Array<{ name: string; isChecked: boolean }> = [];
  public allTheShapes: Array<{ name: string; isChecked: boolean }> = [];
  public allColors: Array<{ name: string; isChecked: boolean }> = [];
  public allClarities: Array<{ name: string; isChecked: boolean }> = [];
  public allTheFluorescences: Array<{ name: string; isChecked: boolean }> = [];
  public allTheCut: Array<{ name: string; isChecked: boolean }> = [];
  public allTheSymm: Array<{ name: string; isChecked: boolean }> = [];
  public allThePolish: Array<{ name: string; isChecked: boolean }> = [];
  public allTheBrown: Array<{ name: string; isChecked: boolean }> = [];
  public allTheGreen: Array<{ name: string; isChecked: boolean }> = [];
  public allTheMilky: Array<{ name: string; isChecked: boolean }> = [];

  public errWeight: string = '';
  public errLimit: string = '';
  public errLength: string = '';
  public errWidth: string = '';
  public errDepth: string = '';
  public errTable: string = '';
  public errRatio: string = '';

  public specialStoneCriteriaData: SpecialStoneCriteria[] = [];
  public specialStoneCriteriaObj: SpecialStoneCriteria = new SpecialStoneCriteria();
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
  public filterBrown: string = '';
  public filterBrownChk: boolean = true;
  public filterGreen: string = '';
  public filterGreenChk: boolean = true;
  public filterMilky: string = '';
  public filterMilkyChk: boolean = true;

  public showRatio = false;

  constructor(private alertDialogService: AlertdialogService,
    private masterConfigService: MasterConfigService,
    public utilityService: UtilityService,
    private specialstonecriteriaService: SpecialstonecriteriaService,
    private spinnerService: NgxSpinnerService) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Initialize Data
  async defaultMethodsLoad() {
    this.spinnerService.show();
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.getMasterConfigData();
    await this.getSpecialStoneCriteriaData();
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

    this.BrownList = this.masterConfigList.inclusions.filter(z => z.type == 'brown');
    let allTheBrown = this.utilityService.sortingMasterDNormPriority(this.BrownList);
    allTheBrown.forEach(z => { this.allTheBrown.push({ name: z.name, isChecked: false }); });

    this.GreenList = this.masterConfigList.inclusions.filter(z => z.type == 'green');
    let allTheGreen = this.utilityService.sortingMasterDNormPriority(this.GreenList);
    allTheGreen.forEach(z => { this.allTheGreen.push({ name: z.name, isChecked: false }); });

    this.MilkyList = this.masterConfigList.inclusions.filter(z => z.type == 'milky');
    let allTheMilky = this.utilityService.sortingMasterDNormPriority(this.MilkyList);
    allTheMilky.forEach(z => { this.allTheMilky.push({ name: z.name, isChecked: false }); });

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
  public editCriteria(obj: SpecialStoneCriteria, isCopy: boolean = false): void {
    this.insertFlag = isCopy;
    this.specialStoneCriteriaObj = new SpecialStoneCriteria();
    this.specialStoneCriteriaObj = { ...obj };
    this.checkForCheckBoxInput();
    this.showRationValidation();
    this.isAddCriteria = true;
  }

  public async getSpecialStoneCriteriaData() {
    try {
      this.specialStoneCriteriaData = await this.specialstonecriteriaService.getAllSpecialStoneCriteria();
      this.spinnerService.hide();
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
          response = await this.specialstonecriteriaService.criteriaInsert(this.specialStoneCriteriaObj);
        }
        else {
          this.specialStoneCriteriaObj.updatedBy = this.fxCredentials?.id ?? '';

          messageType = 'updated';
          response = await this.specialstonecriteriaService.criteriaUpdate(this.specialStoneCriteriaObj);
        }

        if (response) {
          this.spinnerService.hide();
          this.clearCriteria();
          if (action)
            this.closeAddCriteria();
          this.utilityService.showNotification(`Record ` + messageType + ` successfully!`);
          sessionStorage.removeItem("SpecialStoneCriteria");
          await this.getSpecialStoneCriteriaData();
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

  public openDeleteDialog(id: string) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.specialstonecriteriaService.deleteCriteria(id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.spinnerService.hide();
              sessionStorage.removeItem("SpecialStoneCriteria");
              await this.getSpecialStoneCriteriaData();
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

  //#region OnChange Functions
  public showRationValidation() {
    if (this.specialStoneCriteriaObj.shape.length > 0) {
      var fancyStones = this.specialStoneCriteriaObj.shape.filter(z => z.toLowerCase() != "round");
      if (fancyStones.length > 0)
        this.showRatio = true;
      else
        this.showRatio = false;
    }
    else
      this.showRatio = false;
  }

  public openCriteria() {
    this.clearCriteria();
    this.isAddCriteria = true;
  }

  public closeAddCriteria() {
    this.isAddCriteria = false;
  }

  public clearCriteria(form?: NgForm): void {
    this.specialStoneCriteriaObj = new SpecialStoneCriteria();
    form?.reset();
    this.errWeight = '';
    this.errLimit = '';
    this.checkForCheckBoxInput();
    this.insertFlag = true;
  }

  public checkForCheckBoxInput(): void {
    this.utilityService.onMultiSelectChange(this.allTheShapes, this.specialStoneCriteriaObj.shape);
    this.utilityService.onMultiSelectChange(this.allTheLab, this.specialStoneCriteriaObj.lab);
    this.utilityService.onMultiSelectChange(this.allColors, this.specialStoneCriteriaObj.color);
    this.utilityService.onMultiSelectChange(this.allClarities, this.specialStoneCriteriaObj.clarity);
    this.utilityService.onMultiSelectChange(this.allTheCut, this.specialStoneCriteriaObj.cut);
    this.utilityService.onMultiSelectChange(this.allThePolish, this.specialStoneCriteriaObj.polish);
    this.utilityService.onMultiSelectChange(this.allTheSymm, this.specialStoneCriteriaObj.symmetry);
    this.utilityService.onMultiSelectChange(this.allTheFluorescences, this.specialStoneCriteriaObj.fluorescence);
    this.utilityService.onMultiSelectChange(this.allTheBrown, this.specialStoneCriteriaObj.inclusion.brown);
    this.utilityService.onMultiSelectChange(this.allTheGreen, this.specialStoneCriteriaObj.inclusion.green);
    this.utilityService.onMultiSelectChange(this.allTheMilky, this.specialStoneCriteriaObj.inclusion.milky);
  }

  public setManualDataForInsert() {
    this.specialStoneCriteriaObj.id = '';
    this.specialStoneCriteriaObj.createdBy = this.fxCredentials?.id ?? '';
  }
  //#endregion

}

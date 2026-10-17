import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { DataResult, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterDNorm } from 'shared/enitites';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { CartSearchCriteria, ExportToExcelMailData } from '../../businessobjects';
import { Lead } from '../../entities';
import { AppPreloadService, EmailService, InventoryService, LeadService, MasterConfigService } from '../../services';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styles: [
  ]
})
export class MyorderComponent implements OnInit {

  public filterFlag: boolean = false;
  public isSendMail: boolean = false;

  public ShapesList: MasterDNorm[] = [];
  public LabList: MasterDNorm[] = [];
  public ColorList: MasterDNorm[] = [];
  public ClarityList: MasterDNorm[] = [];
  public FluorList: MasterDNorm[] = [];
  public CPSList: MasterDNorm[] = [];

  public searchCriteria: CartSearchCriteria = new CartSearchCriteria();
  public allTheLab: Array<{ name: string; isChecked: boolean }> = [];
  public allTheShapes: Array<{ name: string; isChecked: boolean }> = [];
  public allColors: Array<{ name: string; isChecked: boolean }> = [];
  public allClarities: Array<{ name: string; isChecked: boolean }> = [];
  public allTheFluorescences: Array<{ name: string; isChecked: boolean }> = [];
  public allTheCPS: Array<{ name: string; isChecked: boolean }> = [];

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

  public leads: Lead[] = new Array<Lead>();
  public gridView!: DataResult;
  public gridDetailView!: DataResult[];

  public mySelection: string[] = new Array<string>();
  public selectedLeads: Lead[] = new Array<Lead>();
  public exportToExcelMailObj: ExportToExcelMailData = new ExportToExcelMailData();
  public excelFile: any[] = [];

  public pageSize: number = 25;
  public skip: number = 0;
  public count: number = 0;

  constructor(public utilityService: UtilityService,
    private emailService: EmailService,
    private masterConfigService: MasterConfigService,
    private appPreloadService: AppPreloadService,
    private leadService: LeadService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.loadMasterData();
  }

  public async loadMasterData() {
    try {
      this.spinnerService.show();

      let credential = await this.appPreloadService.fetchFxCredentials("");
      this.searchCriteria.customerId = credential.id;

      //Master Config
      var masterConfigList = await this.masterConfigService.getAllMasterConfig();
      this.ShapesList = masterConfigList.shape;
      let allTheShapes = this.utilityService.sortingMasterDNormPriority(masterConfigList.shape);
      allTheShapes.forEach(z => { this.allTheShapes.push({ name: z.name, isChecked: false }); });

      this.ColorList = masterConfigList.colors;
      let allColors = this.utilityService.sortingMasterDNormPriority(masterConfigList.colors);
      allColors.forEach(z => { this.allColors.push({ name: z.name, isChecked: false }); });

      this.ClarityList = masterConfigList.clarities;
      let allClarities = this.utilityService.sortingMasterDNormPriority(masterConfigList.clarities);
      allClarities.forEach(z => { this.allClarities.push({ name: z.name, isChecked: false }); });

      this.FluorList = masterConfigList.fluorescence;
      let allTheFluorescences = this.utilityService.sortingMasterDNormPriority(masterConfigList.fluorescence);
      allTheFluorescences.forEach(z => { this.allTheFluorescences.push({ name: z.name, isChecked: false }); });

      this.CPSList = masterConfigList.cps;
      let allTheCPS = this.utilityService.sortingMasterDNormPriority(masterConfigList.cps);
      allTheCPS.forEach(z => { this.allTheCPS.push({ name: z.name, isChecked: false }); });
      allTheCPS.forEach(z => { this.allTheCPS.push({ name: z.name, isChecked: false }); });
      allTheCPS.forEach(z => { this.allTheCPS.push({ name: z.name, isChecked: false }); });

      this.LabList = masterConfigList.lab;
      let allTheLab = this.utilityService.sortingMasterDNormPriority(masterConfigList.lab);
      allTheLab.forEach(z => { this.allTheLab.push({ name: z.name, isChecked: false }); });

      this.count = await this.leadService.getCountForCustomerAsync(credential.id);
      this.leads = await this.leadService.getLeadsForCustomerAsync(this.searchCriteria, this.skip, this.pageSize);
      this.gridView = process(this.leads, {});
      this.gridView.total = this.count;

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async loadGridData() {
    try {
      this.spinnerService.show();

      this.count = await this.leadService.getCountForCustomerAsync(this.searchCriteria.customerId);
      this.leads = await this.leadService.getLeadsForCustomerAsync(this.searchCriteria, this.skip, this.pageSize);
      this.gridView.data = this.leads;
      this.gridView.total = this.count;

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadGridData();
  }

  public selectedRowChange(e: any) {
    this.selectedLeads = new Array<Lead>();

    if (e.selectedRows != null && e.selectedRows.length > 0) {
      for (let index = 0; index < e.selectedRows.length; index++) {
        let value: Lead = e.selectedRows[index].dataItem;
        this.selectedLeads.push(JSON.parse(JSON.stringify(value)));
      }
      //let value: Lead = e.selectedRows[0].dataItem;
    }
  }

  private async generateExcelData() {
    this.excelFile = [];
    let i = 0;
    var totalWeight = 0;
    var totalNetAmount = 0;

    for (let index = 0; index < this.selectedLeads.length; index++) {
      let lead: Lead = this.selectedLeads[index];

      lead.leadInventoryItems.forEach(invItem => {
        totalWeight += invItem.weight;
        totalNetAmount += (invItem.price.netAmount ? invItem.price.netAmount : 0);

        var excel = {
          CertificateUrl: invItem.certificateUrl,
          ImageUrl: invItem.imageUrl,
          VideoUrl: invItem.videoUrl,
          'Stock Id': invItem.stoneId,
          'Certificate No': invItem.certificateNo,
          'Shape': invItem.shape,
          Size: invItem.weight,
          Color: invItem.color,
          Clarity: invItem.clarity,
          Cut: invItem.cut,
          Polish: invItem.polish,
          Symmetry: invItem.symmetry,
          Flouresence: invItem.fluorescence,
          Lab: invItem.lab,
          Rap: "$" + invItem.price.rap,
          'Disc%': invItem.price.discount + "%",
          '$/Ct': "$" + invItem.price.perCarat,
          'Net Amount': "$" + invItem.price.netAmount,
          Location: invItem.location
        }

        this.excelFile.push(excel);
        i++;
      });
    }

    let obj: any = {
      CertificateUrl: '',
      ImageUrl: '',
      VideoUrl: '',
      'Stock Id': '',
      'Certificate No': '',
      'Shape': '',
      Size: totalWeight,//.toFixed(2),
      Color: '',
      Clarity: '',
      Cut: '',
      Polish: '',
      Symmetry: '',
      Flouresence: '',
      Lab: '',
      Rap: '',
      'Disc%': '',
      '$/Ct': '',
      'Net Amount': "$" + totalNetAmount,//.toFixed(3),
      Location: ''
    }
    this.excelFile.push(obj);
  }

  public async downLoadExcelFile() {
    try {
      this.spinnerService.show();

      this.generateExcelData();
      if (this.excelFile.length > 0)
        this.utilityService.exportAsExcelFile(this.excelFile, "Cart_Excel_");

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public downloadAttachment() {
    try {
      this.spinnerService.show();

      this.generateExcelData();
      if (this.excelFile.length > 0)
        this.utilityService.exportAsExcelFile(this.excelFile, "Diamond_Excel");

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async sendMail(form: NgForm) {
    try {
      if (!form.valid)
        return;

      let isEmailValid = this.checkValidEmail(this.exportToExcelMailObj.toEmail);
      if (!isEmailValid) {
        this.alertDialogService.show('Not valid email address in Mail To');
        return;
      }

      let isCCValid = this.checkValidEmail(this.exportToExcelMailObj.cC);
      if (!isCCValid) {
        this.alertDialogService.show('Not valid email address in CC');
        return;
      }

      let isBccValid = this.checkValidEmail(this.exportToExcelMailObj.bcc);
      if (!isBccValid) {
        this.alertDialogService.show('Not valid email address in Bcc');
        return;
      }

      this.spinnerService.show();

      let fileName = "Diamond_Excel";
      this.generateExcelData();
      this.exportToExcelMailObj.systemUserId = this.searchCriteria.customerId ?? '';
      this.exportToExcelMailObj.excelBase64String = this.utilityService.exportAsExcelFileBase64(this.excelFile);;
      this.exportToExcelMailObj.excelFileName = this.utilityService.exportFileName(fileName);
      this.exportToExcelMailObj.excelMediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      let res = await this.emailService.sendEmailAsync(this.exportToExcelMailObj);
      if (res && res.isSuccess) {
        this.utilityService.showNotification(res.message);
        this.closeSendMailDialog();
      }
      else {
        console.error(res);
        if (res) {
          this.alertDialogService.show(res.message);
        }
        else
          this.alertDialogService.show("Something went wrong, Try again later");
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show("Something went wrong, Try again later");
      this.spinnerService.hide();
    }
  }
  public checkValidEmail(email: string): boolean {
    let flag = true;
    if (email && email.length > 0) {
      let emailArray = email.split(",");
      if (emailArray && emailArray.length > 0) {
        emailArray.forEach(z => {
          if (flag)
            flag = this.validateEmail(z.trim());
        });
      }
    }
    return flag;
  }
  public validateEmail(email: string): boolean {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
  }

  public async clearSearch() {
    try {
      this.spinnerService.show();

      let customerId = this.searchCriteria.customerId;
      this.searchCriteria = new CartSearchCriteria();
      this.searchCriteria.customerId = customerId;

      this.allTheShapes.map(c => c.isChecked == false);
      this.allClarities.map(c => c.isChecked == false);
      this.allTheCPS.map(c => c.isChecked == false);
      this.allTheFluorescences.map(c => c.isChecked == false);
      this.allTheLab.map(c => c.isChecked == false);

      await this.loadGridData();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public filterSidebar() {
    this.filterFlag = !this.filterFlag;
  }

  //Send mail view
  public openSendMailDialog(): void {
    this.isSendMail = true;
  }

  public closeSendMailDialog(): void {
    this.isSendMail = false;
    this.clearSendMail();
  }
  public clearSendMail(): void {
    this.exportToExcelMailObj = new ExportToExcelMailData();
  }

}

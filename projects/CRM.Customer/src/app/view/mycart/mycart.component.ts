import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataResult, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterDNorm } from 'shared/enitites';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { CartItem, CartSearchCriteria, ExportToExcelMailData } from '../../businessobjects';
import { Scheme } from '../../entities';
import { AppPreloadService, CartService, CustomerService, EmailService, InventoryService, LeadService, MasterConfigService, SchemeService, SystemUserService } from '../../services';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styles: [
  ]
})
export class MycartComponent implements OnInit {

  public filterFlag = false;
  public isDiamondDialog = false;
  public isImageDialog = false;
  public isCertiDialog = false;
  public isSendMail = false;
  public isCheckout = false;
  public pageFrom: string = "MyCart";

  public totalPcs: number = 0;
  public totalWt: number = 0.00;
  public totalAmt: number = 0;
  public selectedPcs: number = 0;
  public selectedWt: number = 0.00;
  public selectedAmt: number = 0;

  public lastPurchase: number = 0.00;
  public totalVowValue: number = 0.00;
  public appliedVowDisc: number = 0.00;
  public appliedVowAmt: number = 0.00;
  public paybleAmount: number = 0.00;

  public isCompareDialog: boolean = false;
  public showDiamonddetailModal: boolean = false;
  public invId: string = "";
  public mediaSrc: string = "";
  public mediaType: string = "";
  public isShowMedia: boolean = false;

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

  private scheme: Scheme = new Scheme();

  public gridView!: DataResult;

  public mySelection: string[] = new Array<string>();
  public invIds: string[] = new Array<string>();
  public exportToExcelMailObj: ExportToExcelMailData = new ExportToExcelMailData();
  public excelFile: any[] = [];

  constructor(public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private appPreloadService: AppPreloadService,
    private cartService: CartService,
    private leadService: LeadService,
    private schemeService: SchemeService,
    private inventoryService: InventoryService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private emailService: EmailService) { }

  ngOnInit(): void {
    this.getMasterConfigData();
  }

  public async getMasterConfigData() {
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

      //Online Vow Disocount
      this.scheme = await this.schemeService.getOnlineSchemeAsync(true);
      this.lastPurchase = await this.leadService.getLastPurchaseAmountForVow(credential.id);

      await this.LoadCartItemsAsync();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async LoadCartItemsAsync() {
    try {
      let response: CartItem[] = await this.cartService.getCartItemsByCriteriaAsync(this.searchCriteria);
      this.gridView = process(response, {});
      this.gridView.total = response.length;

      this.totalPcs = response.length;
      this.totalWt = Number(parseFloat(response.reduce((ty, u) => ty + u.invItem.weight, 0).toFixed(2)));
      this.totalAmt = Number(parseFloat(response.reduce((ty, u) => ty + (u.invItem.price.netAmount ? u.invItem.price.netAmount : 0), 0).toFixed(2)));

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getMyCartItem() {
    try {
      this.spinnerService.show();
      await this.LoadCartItemsAsync();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
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

      await this.LoadCartItemsAsync();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async generateExcelData() {
    this.excelFile = [];
    let i = 0;
    var totalWeight = 0;
    var totalNetAmount = 0;
    this.gridView.data.forEach(element => {
      totalWeight += element.invItem.weight;
      totalNetAmount += (element.invItem.price.netAmount ? element.invItem.price.netAmount : 0);

      var excel = {
        CertificateUrl: element.invItem.certificateUrl,
        ImageUrl: element.invItem.imageUrl,
        VideoUrl: element.invItem.videoUrl,
        'Stock Id': element.invItem.stoneId,
        'Certificate No': element.invItem.certificateNo,
        'Shape': element.invItem.shape,
        Size: element.invItem.weight,
        Color: element.invItem.color,
        Clarity: element.invItem.clarity,
        Cut: element.invItem.cut,
        Polish: element.invItem.polish,
        Symmetry: element.invItem.symmetry,
        Flouresence: element.invItem.fluorescent,
        Lab: element.invItem.lab,
        Rap: "$" + element.invItem.price.rap,
        'Disc%': element.invItem.price.discount + "%",
        '$/Ct': "$" + element.invItem.price.perCarat,
        'Net Amount': "$" + element.invItem.price.netAmount,
        Location: element.invItem.location
      }
      this.excelFile.push(excel);

      i++;
    });

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

  public removeCart() {
    try {
      if (this.mySelection && this.mySelection.length > 0) {
        this.alertDialogService.ConfirmYesNo("You Sure You Want To Remove From Cart", "Cart").subscribe(async (result: any) => {
          if (result.flag) {
            this.spinnerService.show();
            if (this.mySelection && this.mySelection.length > 0) {
              for (let index = 0; index < this.mySelection.length; index++) {
                let cartId = this.mySelection[index];
                var flag = await this.cartService.deleteCartAsync(cartId);
                if (flag)
                  this.gridView.data.splice(this.gridView.data.findIndex(c => c.id == cartId), 1);
              }
            }

            this.spinnerService.hide();
          }
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public getSelectedRowID(event: any): void {
    if (this.mySelection.length > 0) {
      this.selectedPcs = this.mySelection.length;
      this.selectedWt = Number(parseFloat(this.gridView.data.filter(c => this.mySelection.includes(c.id)).reduce((ty, u) => ty + u.invItem.weight, 0).toFixed(2)));
      this.selectedAmt = Number(parseFloat(this.gridView.data.filter(c => this.mySelection.includes(c.id)).reduce((ty, u) => ty + u.invItem.price.netAmount, 0).toFixed(2)));
      this.invIds = this.gridView.data.filter(c => this.mySelection.includes(c.id)).map(j => j.invItem.invId);
      this.CalculateVow();
    }
    else {
      this.selectedPcs = 0;
      this.selectedWt = 0;
      this.selectedAmt = 0;
      this.appliedVowDisc = 0;
      this.appliedVowAmt = 0;
      this.paybleAmount = 0;
      this.invIds = new Array<string>();
    }
  }

  public async CalculateVow() {
    try {
      if (this.mySelection && this.mySelection.length > 0) {
        this.appliedVowDisc = 0;
        this.appliedVowAmt = 0;
        this.paybleAmount = 0;

        if (this.scheme) {
          var cartItems = this.gridView.data.filter(c => this.mySelection.includes(c.id));
          if (cartItems && cartItems.length > 0) {

            let todayAmount = cartItems.reduce((ty, u) => ty + u.invItem.price.netAmount, 0);
            let todayPurchase = Number(todayAmount.toFixed(2));
            this.totalVowValue = Number((todayPurchase + this.lastPurchase).toFixed(2));

            let schemeDetail = this.scheme.details.find(c => c.from <= this.totalVowValue && this.totalVowValue <= c.to);
            if (schemeDetail)
              this.appliedVowDisc = schemeDetail?.discount;

            this.paybleAmount = Number((todayPurchase - ((todayPurchase * this.appliedVowDisc) / 100)).toFixed(2));
            this.appliedVowAmt = Number((todayPurchase - this.paybleAmount).toFixed(2));
          }
        }
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public filterSidebar() {
    this.filterFlag = !this.filterFlag;
  }

  public openCompareDialog(): void {
    this.isCompareDialog = true;
  }

  public closeCompareDialog(): void {
    this.isCompareDialog = false;
  }

  public openDiamonddetailSidebar(invId: string) {
    this.invId = invId;
    this.showDiamonddetailModal = true;
  }

  public openMediaDialog(src: string, type: string): void {
    this.mediaSrc = src;
    this.mediaType = type;
    this.isShowMedia = true;
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

  // Checkout
  public openCheckoutDialog(): void {
    this.isCheckout = true;
  }

  public parentMethodCall(): void {
    this.isCheckout = false;
    this.invIds = new Array<string>();
    this.LoadCartItemsAsync();
  }

}

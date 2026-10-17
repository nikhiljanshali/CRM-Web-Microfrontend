import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterDNorm } from 'shared/enitites';
import { AppPreloadService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { InvDetailData, WatchListResponse, WatchListSearchCriteria } from '../../businessobjects';
import { Cart, Customer } from '../../entities';
import { CartService, CustomerService, MasterConfigService, WatchlistService } from '../../services';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styles: [
  ]
})
export class WatchlistComponent implements OnInit {

  public customerId!:string;
  public watchListData: WatchListResponse = new WatchListResponse();
  public watchLists: WatchListResponse[] = new Array<WatchListResponse>();
  public selectedWatch: string[] = new Array<string>();
  public invItemObj: InvDetailData = new InvDetailData();
  public searchCriteria: WatchListSearchCriteria = new WatchListSearchCriteria();
  public totalRecord: number = 0;
  public addCart: Cart = new Cart();
  public excelFile: any[] = [];

  public allTheLab: Array<{ name: string; isChecked: boolean }> = [];
  public allTheShapes: Array<{ name: string; isChecked: boolean }> = [];
  public allColors: Array<{ name: string; isChecked: boolean }> = [];
  public allClarities: Array<{ name: string; isChecked: boolean }> = [];
  public allTheFluorescences: Array<{ name: string; isChecked: boolean }> = [];
  public allTheCPS: Array<{ name: string; isChecked: boolean }> = [];

  public shapesList: MasterDNorm[] = [];
  public labList: MasterDNorm[] = [];
  public colorList: MasterDNorm[] = [];
  public clarityList: MasterDNorm[] = [];
  public fluorList: MasterDNorm[] = [];
  public CPSList: MasterDNorm[] = [];

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

  public filterFlag = false;
  public showDiamonddetailModal = false;

  constructor(private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private watchlistService: WatchlistService,
    private customerService: CustomerService,
    private cartService: CartService,
    public utilityService: UtilityService,
    private appPreloadService: AppPreloadService,
    private masterConfigService: MasterConfigService) { }

  async ngOnInit() {
    await this.getMasterConfigData();
  }

  public async getMasterConfigData() {
    try {
      this.spinnerService.show();
      let credential = await this.appPreloadService.fetchFxCredentials("", "customer");
      this.customerId = credential.id;
      //Master Config
      var masterConfigList = await this.masterConfigService.getAllMasterConfig();
      this.shapesList = masterConfigList.shape;
      let allTheShapes = this.utilityService.sortingMasterDNormPriority(masterConfigList.shape);
      allTheShapes.forEach(z => { this.allTheShapes.push({ name: z.name, isChecked: false }); });

      this.colorList = masterConfigList.colors;
      let allColors = this.utilityService.sortingMasterDNormPriority(masterConfigList.colors);
      allColors.forEach(z => { this.allColors.push({ name: z.name, isChecked: false }); });

      this.clarityList = masterConfigList.clarities;
      let allClarities =this.utilityService.sortingMasterDNormPriority(masterConfigList.clarities);
      allClarities.forEach(z => { this.allClarities.push({ name: z.name, isChecked: false }); });

      this.fluorList = masterConfigList.fluorescence;
      let allTheFluorescences = this.utilityService.sortingMasterDNormPriority(masterConfigList.fluorescence);
      allTheFluorescences.forEach(z => { this.allTheFluorescences.push({ name: z.name, isChecked: false }); });

      this.CPSList = masterConfigList.cps;
      let allTheCPS = this.utilityService.sortingMasterDNormPriority(masterConfigList.cps);
      allTheCPS.forEach(z => { this.allTheCPS.push({ name: z.name, isChecked: false }); });

      this.labList = masterConfigList.lab;
      let allTheLab = this.utilityService.sortingMasterDNormPriority(masterConfigList.lab);
      allTheLab.forEach(z => { this.allTheLab.push({ name: z.name, isChecked: false }); });

      await this.getAllWatchlist();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getAllWatchlist() {
    try {
      if(this.customerId){
        this.spinnerService.show();
        this.searchCriteria.customerId = this.customerId;
        this.watchLists = await this.watchlistService.getAllWatchLists(this.searchCriteria);
        this.spinnerService.hide();
      }
    } catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public selectWatch(id: string) {
    if (!this.selectedWatch.some(x => x == id))
      this.selectedWatch.push(id);
    else {
      let index = this.selectedWatch.findIndex(x => x == id);
      this.selectedWatch.splice(index, 1);
    }
  }

  public async addToCart(invItemId: string) {
    try {
      if (invItemId && this.watchLists.some(c => c.invItemId == invItemId)) {
        this.alertDialogService.ConfirmYesNo("Are you sure you want to add to cart?", "Cart")
          .subscribe(async (res: any) => {
            if (res.flag) {
              this.spinnerService.show();
              this.addCart = new Cart();
              let watch = this.watchLists.find(c => c.invItemId == invItemId);
              if (watch) {
                this.addCart.customer = watch.customer;
                this.addCart.invId = watch.invItemId;
                this.addCart.stoneId = watch.invItemNumber;
                this.addCart.WebPlatform = "Online";

                // get seller details
                let customerDetail: Customer = await this.customerService.getCustomerById(watch.customer.id);
                if (customerDetail && customerDetail.seller)
                  this.addCart.seller = customerDetail.seller;

                //call add to cart
                let id = await this.cartService.insertCartAsync(this.addCart);
                if (id) {
                  this.selectedWatch = [watch.id];
                  let flag = await this.watchlistService.removeFromWatchList(this.selectedWatch);
                  if (flag) {
                    await this.getAllWatchlist();
                    this.selectedWatch = [];
                    this.spinnerService.hide();
                  }
                  this.utilityService.showNotification(`Successfully added in Cart`);
                }
              }
              this.spinnerService.hide();
            }
          });
      }
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      if (error && error.error && error.error.includes('hold proccess'))
        this.alertDialogService.show(error.error);
      else
        this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }

  public removeWatchlist() {
    try {
      if (this.selectedWatch.length > 0) {
        this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
          .subscribe(async (res: any) => {
            if (res.flag) {
              this.spinnerService.show();
              let flag = await this.watchlistService.removeFromWatchList(this.selectedWatch);
              if (flag) {
                await this.getAllWatchlist();
                this.selectedWatch = [];
                this.spinnerService.hide();
              }
            }
          });
      }
    } catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  private async generateExcelData() {
    this.excelFile = [];
    let i = 0;
    var totalWeight = 0;
    var totalNetAmount = 0;
    this.watchLists.forEach(element => {
      totalWeight += element.inventoryDetail.weight;
      totalNetAmount += (element.inventoryDetail.price.netAmount ? element.inventoryDetail.price.netAmount : 0);

      var excel = {
        CertificateUrl: element.inventoryDetail.certificateUrl,
        ImageUrl: element.inventoryDetail.imageUrl,
        VideoUrl: element.inventoryDetail.videoUrl,
        'Stock Id': element.inventoryDetail.stoneId,
        'Certificate No': element.inventoryDetail.certificateNo,
        'Shape': element.inventoryDetail.shape,
        Size: element.inventoryDetail.weight,
        Color: element.inventoryDetail.color,
        Clarity: element.inventoryDetail.clarity,
        Cut: element.inventoryDetail.cut,
        Polish: element.inventoryDetail.polish,
        Symmetry: element.inventoryDetail.symmetry,
        Flouresence: element.inventoryDetail.fluorescence,
        Length: element.inventoryDetail.measurement.length,
        Width: element.inventoryDetail.measurement.width,
        Height: element.inventoryDetail.measurement.height,
        Depth: element.inventoryDetail.measurement.depth,
        Table: element.inventoryDetail.measurement.table,
        Lab: element.inventoryDetail.lab,
        Rap: element.inventoryDetail.price.rap,
        'Disc%': element.inventoryDetail.price.discount + "%",
        '$/Ct': element.inventoryDetail.price.perCarat,
        'Net Amount': element.inventoryDetail.price.netAmount,
        Location: element.inventoryDetail.location
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
      Length: '',
      Width: '',
      Height: '',
      Depth: '',
      Table: '',
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
        this.utilityService.exportAsExcelFile(this.excelFile, "WatchList_Excel_");

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

      this.searchCriteria = new WatchListSearchCriteria();
      this.allTheShapes.map(c => c.isChecked == false);
      this.allClarities.map(c => c.isChecked == false);
      this.allTheCPS.map(c => c.isChecked == false);
      this.allTheFluorescences.map(c => c.isChecked == false);
      this.allTheLab.map(c => c.isChecked == false);

      await this.getAllWatchlist();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public openDiamonddetailSidebar(invObj: InvDetailData) {
    this.invItemObj = invObj;
    this.showDiamonddetailModal = true;
  }

  public filterSidebar() {
    this.filterFlag = !this.filterFlag;
  }

}

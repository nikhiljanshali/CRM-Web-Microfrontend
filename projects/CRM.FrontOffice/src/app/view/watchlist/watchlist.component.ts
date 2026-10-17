import { Component, OnInit } from '@angular/core';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, MasterDNorm } from 'shared/enitites';
import { AppPreloadService, ConfigService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { WatchListResponse, WatchListSearchCriteria } from '../../businessobjects';
import { GridPropertiesService, MasterConfigService, WatchListService } from '../../services';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: []
})
export class WatchlistComponent implements OnInit {

  public watchListSearchCriteria: WatchListSearchCriteria = new WatchListSearchCriteria();
  public watchListItems: WatchListResponse[] = new Array<WatchListResponse>();
  public selectedWatchlist: WatchListResponse[] = new Array<WatchListResponse>();

  public excelFile: any[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public sort!: SortDescriptor[];
  public selectableSettings: SelectableSettings = { mode: 'multiple' };
  public mySelection: string[] = [];
  public isRowSelected!: boolean;
  public gridView!: DataResult;
  public groups: GroupDescriptor[] = [];
  public filterFlag = true;
  public isShowCheckBoxAll:boolean = true;

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

  public isGridConfig: boolean = false;
  private fxCredentials!: fxCredential;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;

  constructor(
    private watchlistService: WatchListService,
    private appPreloadService: AppPreloadService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private gridPropertiesService: GridPropertiesService,
    public utilityService: UtilityService,
    private configService: ConfigService,
    private masterConfigService: MasterConfigService
  ) { }

  async ngOnInit() {
    this.loadDefaultMethods();
    await this.getMasterConfigData();
  }

  public loadDefaultMethods() {
    try {
      this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      if (this.fxCredentials && this.fxCredentials.origin.toLowerCase() == "seller")
        this.watchListSearchCriteria.sellerId = this.fxCredentials.id;

      this.utilityService.filterToggleSubject.subscribe(flag => {
        this.filterFlag = flag;
      });
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getMasterConfigData() {
    try {
      this.spinnerService.show();
      let credential = await this.appPreloadService.fetchFxCredentials("", "seller");
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

      await this.getWatchlistData();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getWatchlistData() {
    try {
      await this.getGridConfiguration();
      this.watchListItems = await this.watchlistService.getAllWatchLists(this.watchListSearchCriteria);
      this.loadData();
    } catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
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

  private async generateExcelData() {
    this.excelFile = [];
    let i = 0;
    var totalWeight = 0;
    var totalNetAmount = 0;
    this.watchListItems.filter(c => this.mySelection.includes(c.id)).forEach(element => {
      totalWeight += element.inventoryDetail.weight;
      totalNetAmount += (element.inventoryDetail.price.netAmount ? element.inventoryDetail.price.netAmount : 0);

      var excel = {
        CompanyName: element.customer.companyName,
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
      CompanyName: '',
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

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials.id, "SystemUser", "SystemUserGrid");
      if (this.gridConfig && this.gridConfig.id != '') {
        let dbObj: GridDetailConfig[] = this.gridConfig.gridDetail;
        if (dbObj && dbObj.some(c => c.isSelected)) {
          this.fields = dbObj;
          this.fields.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        }
        else
          this.fields.forEach(c => c.isSelected = true);
      }
      else {
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("SystemUser", "SystemUserGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getWatclistItems();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public setNewGridConfig(gridConfig: GridConfig) {
    if (gridConfig) {
      this.fields = gridConfig.gridDetail;
      this.gridConfig = new GridConfig();
      this.gridConfig.id = gridConfig.id
      this.gridConfig.gridDetail = gridConfig.gridDetail;
      this.gridConfig.gridName = gridConfig.gridName;
      this.gridConfig.pageName = gridConfig.pageName;
      this.gridConfig.empID = gridConfig.empID;
    }
  }

  private loadData(): void {
    this.gridView = {
      data: this.watchListItems.slice(this.skip, this.skip + this.pageSize),
      total: this.watchListItems.length
    };
  }

  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public async openDeleteDialog() {
    try {
      if (this.mySelection.length > 0) {
        this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
          .subscribe(async (res: any) => {
            if (res.flag) {
              this.spinnerService.show();
              let flag = await this.watchlistService.deleteWatchList(this.mySelection);
              if (flag) {
                this.utilityService.showNotification(`Watchlist item has been removed successfully!`);
                await this.getWatchlistData();
              }
              this.spinnerService.hide();
            }
          });
      }
    } catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.spinnerService.show();
    this.skip = skip;
    this.pageSize = take;
    this.loadData();
    this.spinnerService.hide();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridView = {
      data: orderBy(this.gridView.data, this.sort),
      total: this.watchListItems.length
    };
  }

  public async groupChange(groups: GroupDescriptor[]) {
    try {
      this.groups = groups;
      await this.getWatchlistData();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public async clearSearch() {
    try {
      this.spinnerService.show();

      this.watchListSearchCriteria = new WatchListSearchCriteria();
      this.watchListSearchCriteria.sellerId = this.fxCredentials.id;
      this.allTheShapes.map(c => c.isChecked == false);
      this.allClarities.map(c => c.isChecked == false);
      this.allTheCPS.map(c => c.isChecked == false);
      this.allTheFluorescences.map(c => c.isChecked == false);
      this.allTheLab.map(c => c.isChecked == false);

      await this.getWatchlistData();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

}

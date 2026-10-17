import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings, } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process, } from '@progress/kendo-data-query';
import { UtilityService, MasterConfigService, ConfigService, GridPropertiesService, InventoryService, } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'common/businessobjects';
import { StockOnHandService } from '../../services/inventory/stockonhand.service';
import { fxCredential, GridMasterConfig, MasterConfig, MasterDNorm, InventoryItems, Stockonhandsearchcriteria, StoneMedia, } from 'common/entities';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-stonemedia',
  templateUrl: './stonemedia.component.html',
  styleUrls: ['./stonemedia.component.css'],
})
export class StonemediaComponent implements OnInit {
  public groups: GroupDescriptor[] = [];
  public groupsIssue: GroupDescriptor[] = [];
  public pageSize = 7;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public gridViewIssue!: DataResult;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = { mode: 'multiple' };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public InventoryObj: InventoryItems = new InventoryItems();
  public inventoryItems: InventoryItems[] = [];
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  public stockOnHandCriteria: Stockonhandsearchcriteria = new Stockonhandsearchcriteria();
  public listPacketsItems: string[] = [];
  public listStoneItems: Array<{ text: string; value: string }> = [];
  public packetsItems!: InventoryItems[];
  public fxCredentials!: fxCredential;
  public masterConfigList!: MasterConfig;
  public cntStones?: string;
  public sumMnuStonesWeight?: string;
  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public StoneCertificateNo?: string;
  public StoneNo?: string;
  public StoneDescription?: string;
  public isStoneGallery: boolean = false;
  public environment = environment;
  public StoneMediaItems: StoneMedia[] = [];
  public selectedStoneMedia: StoneMedia = new StoneMedia();
  public allTheShapes!: MasterDNorm[];
  public allClarities!: MasterDNorm[];
  public allColors!: MasterDNorm[];
  public allTheFluorescences!: MasterDNorm[];
  public allTheCPS!: MasterDNorm[];
  public filterShape: string = '';
  public filterShapeChk: boolean = true;
  public filterKapan: string = '';
  public filterKapanChk: boolean = true;
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
  public allKapan: string[] = [];
  public listShape: Array<{ name: string; isChecked: boolean }> = [];
  public listKapan: Array<{ name: string; isChecked: boolean }> = [];
  public listColor: Array<{ name: string; isChecked: boolean }> = [];
  public listClarity: Array<{ name: string; isChecked: boolean }> = [];
  public listCut: Array<{ name: string; isChecked: boolean }> = [];
  public listPolish: Array<{ name: string; isChecked: boolean }> = [];
  public listSymm: Array<{ name: string; isChecked: boolean }> = [];
  public listFlour: Array<{ name: string; isChecked: boolean }> = [];

  constructor(
    private gridPropertiesService: GridPropertiesService,
    public utilityService: UtilityService,
    private stockOnHandService: StockOnHandService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private masterConfigService: MasterConfigService,
    private configService: ConfigService,
    private inventoryService: InventoryService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region defaultMethods
  async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem('fxCredentials') ?? '') as fxCredential;
    this.stockOnHandCriteria.employeeId = this.fxCredentials.id;
    await this.getGridConfiguration();
    this.gridView = { data: [], total: 0 };
    await this.loadMasterConfig();

    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async loadStock() {
    try {
      this.spinnerService.show();
      let inventory: any = await this.stockOnHandService.getStockForStoneMedia(this.stockOnHandCriteria, this.skip, this.pageSize);
      if (inventory) {
        this.inventoryItems = inventory.inventories;
        this.StoneMediaItems = this.validateImages(this.inventoryItems);
        this.gridView = process(this.StoneMediaItems, { group: this.groups });
        this.gridView.total = inventory.totalCount;
        this.cntStones = inventory.totalCount;
        this.spinnerService.hide();
      }
      else
        this.spinnerService.hide();
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async loadMasterConfig() {
    try {
      this.spinnerService.show();
      this.masterConfigList = await this.masterConfigService.getAllMasterConfig();
      this.allTheShapes = this.masterConfigList.shape;
      this.allTheShapes.forEach((z) => {
        this.listShape.push({ name: z.name, isChecked: false });
      });
      this.allColors = this.masterConfigList.colors;
      this.allColors.forEach((z) => {
        this.listColor.push({ name: z.name, isChecked: false });
      });
      this.allClarities = this.masterConfigList.clarities;
      this.allClarities.forEach((z) => {
        this.listClarity.push({ name: z.name, isChecked: false });
      });
      this.allTheFluorescences = this.masterConfigList.fluorescence;
      this.allTheFluorescences.forEach((z) => {
        this.listFlour.push({ name: z.name, isChecked: false });
      });
      this.allTheCPS = this.masterConfigList.cps;
      this.allTheCPS.forEach((z) => {
        this.listCut.push({ name: z.name, isChecked: false });
      });
      this.allTheCPS.forEach((z) => {
        this.listPolish.push({ name: z.name, isChecked: false });
      });
      this.allTheCPS.forEach((z) => {
        this.listSymm.push({ name: z.name, isChecked: false });
      });
      let kapanItems = await this.inventoryService.getOrgKapanList(this.fxCredentials.organizationId);
      kapanItems.forEach(z => { this.listKapan.push({ name: z, isChecked: false }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  // public setKapanList(): void {
  //   this.listKapan = [];
  //   this.allKapan = this.packetsItems.map((z) => z.kapan);
  //   this.allKapan = this.allKapan.filter(
  //     this.utilityService.onlyUniqueFromStringArray
  //   );
  //   this.allKapan.forEach((z) => {
  //     this.listKapan.push({ name: z, isChecked: false });
  //   });
  // }
  //#endregion

  //#region validateImages Video
  private validateImages(data: InventoryItems[]): StoneMedia[] {
    let array: StoneMedia[] = [];
    data.forEach((z) => {
      let one: StoneMedia = new StoneMedia();

      if (z.media.isHtmlVideo == true)
        one.videoUrl = (environment.invStoneImageUrl + z.stoneId + environment.invStoneVideoUrl);

      if (z.media.isPrimaryImage == true)
        one.imageUrl = (environment.invStoneImageUrl + z.stoneId + environment.invStoneStillImageUrl);
      else
        one.imageUrl = 'commonAssets/images/image-not-found.jpg';

      if (z.media.isArrowBlack == true)
        one.arrowBlackImageUrl = (environment.invStoneImageUrl + z.stoneId + environment.invStoneArrowBlackImageUrl);
      else
        one.arrowBlackImageUrl = 'commonAssets/images/image-not-found.jpg';

      if (z.media.isHeartBlack == true)
        one.heartBlackImageUrl = (environment.invStoneImageUrl + z.stoneId + environment.invStoneHeartBlackImageUrl);
      else
        one.heartBlackImageUrl = 'commonAssets/images/image-not-found.jpg';

      if (z.media.isAsetWhite == true)
        one.asetWhiteImageUrl = (environment.invStoneImageUrl + z.stoneId + environment.invStoneAsetWhiteImageUrl);
      else
        one.asetWhiteImageUrl = 'commonAssets/images/image-not-found.jpg';

      if (z.media.isIdealWhite == true)
        one.idealWhiteImageUrl = (environment.invStoneImageUrl + z.stoneId + environment.invStoneIdealWhiteImageUrl);
      else
        one.idealWhiteImageUrl = 'commonAssets/images/image-not-found.jpg';

      if (z.media.isOfficeLightBlack == true)
        one.officeLightBlackImageUrl = (environment.invStoneImageUrl + z.stoneId + environment.invStoneOfficeLightBlackImageUrl);
      else
        one.officeLightBlackImageUrl = 'commonAssets/images/image-not-found.jpg';

      if (z.media.isCertificate == true)
        one.certificateUrl = environment.invStoneCertiUrl + z.certificateNo + '.pdf';

      one.stoneId = z.stoneId;
      one.shape = z.shape;
      one.weight = z.weight;
      one.color = z.color;
      one.clarity = z.clarity;
      one.cut = z.cut;
      one.polish = z.polish;
      one.symmetry = z.symmetry;
      one.fluorescence = z.fluorescence;
      one.lab = z.lab;
      array.push(one);
    });
    return array;
  }

  /*
  private checkImg(url: string): string {
    try {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.open('HEAD', url);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status == 200) return url;
        else {
          return 'commonAssets/images/image-not-found.jpg';
        }
      };
    } catch (error: any) {
      return 'commonAssets/images/image-not-found.jpg';
    }
    return 'commonAssets/images/image-not-found.jpg';
  }
  private checkVideo(url: string): string {
    try {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.open('HEAD', url);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status == 200) return url;
        else {
          return url;
        }
      };
    } catch (error: any) {
      return url;
    }
    return url;
  }
  */
  //#endregion

  //#region Filter
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0;
    this.loadStock();
  }

  public clearFilter(form: NgForm) {
    form.reset();
    this.stockOnHandCriteria = new Stockonhandsearchcriteria();
    this.loadStock();
  }
  //#endregion

  //#region Dailog
  public openStoneGalleryDailog(stoneMedia: StoneMedia): void {
    this.selectedStoneMedia = stoneMedia;
    this.isStoneGallery = true;
  }

  public closeStoneGalleryDailog(): void {
    this.isStoneGallery = false;
  }
  //#endregion

  //#region Grid Config
  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials.id, 'StoneMedia', 'StoneMediaGrid');
      if (this.gridConfig && this.gridConfig.id != '') {
        let dbObj: GridDetailConfig[] = this.gridConfig.gridDetail;
        if (dbObj && dbObj.some((c) => c.isSelected)) {
          this.fields = dbObj;
          this.fields.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        } else this.fields.forEach((c) => (c.isSelected = true));
      } else {
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig('StoneMedia', 'StoneMediaGrid');
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else this.fields = await this.gridPropertiesService.getStoneMediaGrid();
      }
      this.spinnerService.hide();
    } catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadStock();
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public setNewGridConfig(gridConfig: GridConfig) {
    if (gridConfig) {
      this.fields = gridConfig.gridDetail;
      this.gridConfig = new GridConfig();
      this.gridConfig.id = gridConfig.id;
      this.gridConfig.gridDetail = gridConfig.gridDetail;
      this.gridConfig.gridName = gridConfig.gridName;
      this.gridConfig.pageName = gridConfig.pageName;
      this.gridConfig.empID = gridConfig.empID;
    }
  }

  public selectedRowChange(e: any) {
    this.InventoryObj = new InventoryItems();
    let value: any = e.selectedRows[0].dataItem;
    this.InventoryObj = { ...value };

    this.StoneCertificateNo = this.InventoryObj.certificateNo;
    this.StoneNo = this.InventoryObj.stoneId;
    this.StoneDescription =
      this.InventoryObj.shape +
      '   |   ' +
      this.InventoryObj.weight +
      '   |   ' +
      this.InventoryObj.color +
      '   |   ' +
      this.InventoryObj.clarity +
      '   |   ' +
      this.InventoryObj.cut +
      '   |   ' +
      this.InventoryObj.polish +
      '   |   ' +
      this.InventoryObj.symmetry +
      '   |   ' +
      this.InventoryObj.fluorescence +
      '   |   ' +
      this.InventoryObj.lab;
  }
  //#endregion

  //#region Function
  public onMultiSelectChange(
    val: Array<{ name: string; isChecked: boolean }>,
    selectedData: string[]
  ): void {
    val.forEach((element) => {
      element.isChecked = false;
    });

    if (selectedData && selectedData.length > 0) {
      val.forEach((element) => {
        selectedData.forEach((item) => {
          if (element.name.toLocaleLowerCase() == item.toLocaleLowerCase())
            element.isChecked = true;
        });
      });
    }
  }

  public getCommaSapratedString(vals: any[], isAll: boolean = false): string {
    let name = vals.join(',');
    if (!isAll) if (name.length > 15) name = name.substring(0, 15) + '...';

    return name;
  }

  public onOpenDropdown(
    list: Array<{ name: string; isChecked: boolean }>,
    e: boolean,
    selectedData: string[]
  ): boolean {
    if (selectedData?.length == list.map((z) => z.name).length) e = true;
    else e = false;
    return e;
  }

  public handleFilter(e: any): string {
    return e;
  }

  public filterKapanDropdownSearch(
    allData: string[],
    e: any,
    selectedData: string[]
  ): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    allData.forEach((z) => {
      filterData.push({ name: z, isChecked: false });
    });
    filterData.forEach((z) => {
      if (selectedData?.includes(z.name)) z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter((z) =>
        z.name?.toLowerCase().includes(e?.toLowerCase())
      );
    else return filterData;
  }

  public checkAllListItems(
    list: Array<{ name: string; isChecked: boolean }>,
    e: boolean,
    selectedData: string[]
  ): string[] {
    if (e) {
      selectedData = [];
      selectedData = list.map((z) => z.name);
      list.forEach((element) => {
        element.isChecked = true;
      });
    } else {
      selectedData = [];
      list.forEach((element) => {
        element.isChecked = false;
      });
    }
    return selectedData;
  }

  public filterDropdownSearch(
    allData: MasterDNorm[],
    e: any,
    selectedData: string[]
  ): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    allData.forEach((z) => {
      filterData.push({ name: z.name, isChecked: false });
    });
    filterData.forEach((z) => {
      if (selectedData?.includes(z.name)) z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter((z) =>
        z.name?.toLowerCase().includes(e?.toLowerCase())
      );
    else return filterData;
  }
  //#endregion
}

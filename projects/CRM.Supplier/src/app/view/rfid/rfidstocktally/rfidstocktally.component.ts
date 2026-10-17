import { Component, HostListener, OnInit } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { DataResult, process } from '@progress/kendo-data-query';
import { ComponentCanDeactivate } from 'common/auth/pendingchanges.guard';
import { fxCredential, InventoryItems, InventorySearchCriteria } from 'common/entities';
import { InventoryService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { StockTally } from '../../../businessobjects';
import { StocktallyService } from '../../../services';
declare var Spacecode: any;

@Component({
  selector: 'app-rfidstocktally',
  templateUrl: './rfidstocktally.component.html',
  styleUrls: ['./rfidstocktally.component.css']
})
export class RfidstocktallyComponent implements OnInit, ComponentCanDeactivate {

  // RFID doc spacecode
  // https://www.spacecode.com/HtmlDoc/docs/jsdoc/
  public fxCredential?: fxCredential;
  public device: any;
  // public scannedTags: string[] = ["AMT-898", "AMT-5468", "AMT-546", "AMT-204", "AMT-205", "AMT-206", "AMT-207", "AMT-208", "AMT-209", "AMT-210"];
  public scannedTags: string[] = [];
  public statusText: string = "ERROR";
  public statusTextBgClass: string = "bg-danger";
  public foundTags: any[] = [];
  public notAllocatedTags: any[] = [];
  public filterFoundTags!: DataResult;
  public filterNotAllocatedTags!: DataResult;
  public isScanCompleted: boolean = false;
  public isAllNotAllocatedLighting: boolean = false;
  public isAllFoundLighting: boolean = false;
  public foundSkip = 0;
  public notAllocatedSkip = 0;
  public rfIdGridPageSize = 6;
  public tagArr: any = [];
  public inventoryObj: InventoryItems = new InventoryItems();
  public inventorySearchCriteriaObj: InventorySearchCriteria = new InventorySearchCriteria();

  public stockTallyList: StockTally[] = new Array<StockTally>();
  public totalWeight: number = 0;
  public totalPics: number = 0;
  public totalStokOnHandPics: number = 0;
  public totalStockOnHandWeight: number = 0;
  public totalMemoPics: number = 0;
  public totalMemoWeight: number = 0;
  public totalStockTallyPics: number = 0;
  public totalStockTallyWeight: number = 0;
  public isViewRFIDModal: boolean = false;

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): Observable<boolean> | boolean | any {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
  }

  constructor(private stockTallyService: StocktallyService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    private inventoryService: InventoryService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    let deviceUrl: string = '';
    this.fxCredential = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    this.inventorySearchCriteriaObj.organizationId = this.fxCredential.organizationId;
    if (environment.production)
      deviceUrl = "wss://" + this.fxCredential.deviceRFIDUrl;
    else
      deviceUrl = "ws://" + this.fxCredential.deviceRFIDUrl;

    this.device = new Spacecode.Device(deviceUrl);
    this.loadSpaceCodeScan();
    await this.loadStockTallyAsync();
  }

  /* #region  RFID machine methods */
  public loadSpaceCodeScan() {
    try {
      // var device = new Device("192.168.1k.20");
      this.getRFIDStatus(this.device._status);
      let that = this;
      this.device.connect();

      this.device.on('connected', function () {
        that.getRFIDStatus(that.device.getStatus());
      });

      this.device.on('disconnected', function () {
        that.getRFIDStatus(that.device.getStatus());
      });

      this.device.on('scanstarted', function () {
        that.spinnerService.show()
        that.getRFIDStatus(that.device.getStatus());
      });

      this.device.on('tagadded', function (tagUid: any) {
        let index = that.scannedTags.findIndex(x => x == tagUid);
        if (index < 0)
          that.scannedTags.push(tagUid);
      });

      this.device.on('scancompleted', async function () {
        that.spinnerService.hide();

        if (!that.isScanCompleted) {
          that.getRFIDStatus(that.device.getStatus());
          that.isScanCompleted = true;
        }
        //#region scan code old
        if (that.scannedTags.length > 0) {
          that.spinnerService.show();
          that.cleanScan();

          let scanInventories: any = await that.inventoryService.getInventoryItemsByRFids(that.scannedTags);

          if (scanInventories && scanInventories.length > 0) {
            for (let index = 0; index < that.scannedTags.length; index++) {
              const element = that.scannedTags[index];

              let findingRFID = scanInventories.find((x: InventoryItems) => x.rfid == element);
              if (findingRFID)
                that.foundTags.push(findingRFID);
              else
                that.notAllocatedTags.push(element);
            }
            that.foundTags = that.foundTags.map((str: any) => ({ stoneId: str.stoneId, rfid: str.rfid, isLighting: false }));
            that.notAllocatedTags = that.notAllocatedTags.map((str: any) => ({ rfid: str, isLighting: false }));

            //Init Filter data in RFId Grids
            let event: any = { skip: 0 };
            that.filterFoundTags = that.rfIdGridPageChange(event, that.foundTags);
            that.filterNotAllocatedTags = that.rfIdGridPageChange(event, that.notAllocatedTags);
          }
          that.spinnerService.hide();
          //#endregion

        }
      });
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public getRFIDStatus(status: string) {
    status = status.toUpperCase();
    this.statusText = status;
    if (status == "NOT_READY" || status == "ERROR")
      this.statusTextBgClass = "bg-danger";
    else if (status == "READY")
      this.statusTextBgClass = "bg-success";
    else if (status == "SCANNING")
      this.statusTextBgClass = "bg-info";
    else if (status == "LIGHTING")
      this.statusTextBgClass = "bg-warning";

  }

  public async startScan() {
    try {
      this.spinnerService.show();
      this.cleanScan();
      this.scannedTags = [];

      this.isScanCompleted = false;
      if (this.device.getStatus().toUpperCase() == "READY")
        this.device.requestScan();
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public refreshDevice() {
    this.spinnerService.show();
    if (!this.device.isConnected()) {
      this.device.connect();
      this.spinnerService.hide();

    }
    this.scannedTags = [];

    this.cleanScan()
    this.getRFIDStatus(this.device.getStatus());
    this.spinnerService.hide();

  }

  public startLighting(id: any, index: number, type: string) {
    try {
      this.spinnerService.show();

      if (type.toLowerCase() == 'notallocated') {
        this.notAllocatedTags[index].isLighting = !this.notAllocatedTags[index].isLighting
        if (this.notAllocatedTags.length == 1 && this.notAllocatedTags[index].isLighting)
          this.isAllNotAllocatedLighting = true
        else
          this.isAllNotAllocatedLighting = false
      }
      if (type.toLowerCase() == 'found') {
        this.foundTags[index].isLighting = !this.foundTags[index].isLighting
        if (this.foundTags.length == 1 && this.foundTags[index].isLighting)
          this.isAllFoundLighting = true
        else
          this.isAllFoundLighting = false
      }


      let findLightIndex = this.tagArr.findIndex((x: any) => x == id.rfid);
      if (findLightIndex >= 0)
        this.tagArr.splice(findLightIndex, 1)
      else
        this.tagArr.push(id.rfid);

      this.stopLighting(false);

      if (this.tagArr && this.tagArr.length > 0)
        this.subMethodLighting()
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show("Something went wrong, Please try again later");
    }
  }

  public startAllLighting(type: string) {
    try {


      if (type.toLowerCase() == 'notallocated') {
        let notallocated = this.notAllocatedTags.map(x => x.rfid);
        if (!this.isAllNotAllocatedLighting) {
          this.notAllocatedTags.map(x => x.isLighting = true);
          this.tagArr.push(...notallocated)
        }
        else {
          this.notAllocatedTags.map(x => x.isLighting = false);
          this.tagArr = this.tagArr.filter((val: any) => !notallocated.includes(val));
        }
        this.isAllNotAllocatedLighting = !this.isAllNotAllocatedLighting
      }
      if (type.toLowerCase() == 'found') {
        let foundrfid = this.foundTags.map(x => x.rfid);
        if (!this.isAllFoundLighting) {
          this.foundTags.map(x => x.isLighting = true);
          this.tagArr.push(...foundrfid)
        }
        else {
          this.foundTags.map(x => x.isLighting = false);
          this.tagArr = this.tagArr.filter((val: any) => !foundrfid.includes(val));
        }
        this.isAllFoundLighting = !this.isAllFoundLighting
      }

      let that = this;
      this.tagArr = this.tagArr.filter(function (item: any, pos: any) {
        return that.tagArr.indexOf(item) == pos;
      });

      this.stopLighting(false);
      if (this.tagArr && this.tagArr.length > 0)
        this.subMethodLighting()

    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show("Something went wrong, Please try again later");
    }
  }

  public subMethodLighting() {
    try {
      this.spinnerService.show();
      this.device.startLightingTagsLed(null, this.tagArr);
      this.device.setLightIntensity(null, 300)
      let that = this;


      this.device.on('lightingstarted', function (tagsNotLighted: any) {
        that.getRFIDStatus(that.device.getStatus());
        that.spinnerService.hide();

      });
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show("Something went wrong, Please try again later");
    }


  }

  public stopLighting(isAllRemove: boolean = true) {
    try {
      this.spinnerService.show();
      this.device.stopLightingTagsLed();
      let that = this;
      this.device.on('lightingstopped', function () {
        that.getRFIDStatus(that.device.getStatus());
        if (isAllRemove) {
          that.isAllFoundLighting = false;
          that.isAllNotAllocatedLighting = false;
          if (that.foundTags && that.foundTags.length > 0)
            for (let index = 0; index < that.foundTags.length; index++) {
              const element = that.foundTags[index];
              element.isLighting = false;
            }

          if (that.notAllocatedTags && that.notAllocatedTags.length > 0)
            for (let index = 0; index < that.notAllocatedTags.length; index++) {
              const element = that.notAllocatedTags[index];
              element.isLighting = false;
            }
        }
        that.spinnerService.hide();

      });
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show("Something went wrong, Please try again later");
    }


  }
  /* #endregion */

  /* #region Scanned Rfid Pagination */
  public rfIdGridPageChange(event: PageChangeEvent, data: any[]): DataResult {
    let skip = event.skip;

    let allData = JSON.parse(JSON.stringify(data));
    let filterData = allData.slice(skip, skip + this.rfIdGridPageSize);

    let dataResult: DataResult = process(filterData, { group: [] });
    dataResult.total = allData.length;
    return dataResult;
  }
  /* #endregion */

  /* #region  List StockTally */
  public async loadStockTallyAsync() {
    try {
      this.spinnerService.show();
      this.stockTallyList = await this.stockTallyService.GetAllStockTallyAsync();
      this.loadCalCulateTotal();
      this.spinnerService.hide();
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public loadCalCulateTotal() {
    this.totalWeight = this.stockTallyList.reduce((acc, cur) => acc + cur.weight, 0);
    this.totalPics = this.stockTallyList.reduce((acc, cur) => acc + cur.count, 0);
    this.totalStokOnHandPics = this.stockTallyList.reduce((acc, cur) => acc + cur.stockOnHandCount, 0);
    this.totalStockOnHandWeight = this.stockTallyList.reduce((acc, cur) => acc + cur.stockOnHandWeight, 0);
    this.totalMemoPics = this.stockTallyList.reduce((acc, cur) => acc + cur.memoCount, 0);
    this.totalMemoWeight = this.stockTallyList.reduce((acc, cur) => acc + cur.memoWeight, 0);
    this.totalStockTallyPics = this.stockTallyList.reduce((acc, cur) => acc + cur.stockTallyCount, 0);
    this.totalStockTallyWeight = this.stockTallyList.reduce((acc, cur) => acc + cur.stockTallyWeight, 0);
  }
  /* #endregion */

  /* #region Submit Section for StockTally  */
  public onRFIDStockTallySubmit() {
    try {

      for (let i = 0; i < this.stockTallyList.length; i++) {
        const element = this.stockTallyList[i];
        for (let j = 0; j < element.stockOnHandList.length; j++) {
          const element1 = element.stockOnHandList[j];
          let data = this.foundTags.find(x => x.stoneId.toLowerCase() == element1.stoneId.toLowerCase());
          if (data) {
            this.stockTallyList[i].stockOnHandList.splice(j, 1);
            this.stockTallyList[i].stockTallyList.push(element1);
          }
        }

      }
      this.stockTallyList = this.stockTallyList.filter(x => {
        x.stockOnHandCount = x.stockOnHandList.length;
        x.stockTallyCount = x.stockTallyList.length;
        x.stockOnHandWeight = x.stockOnHandList.reduce((acc, cur) => acc + cur.weight, 0);
        x.stockTallyWeight = x.stockTallyList.reduce((acc, cur) => acc + cur.weight, 0);
        return x;
      })
      this.loadCalCulateTotal();

      this.toggleRFIDScanDialog();
    }
    catch (error) {

    }
  }
  /* #endregion */

  /* #region Export Remain stock section  */
  public async exportToExcel() {
    try {
      this.spinnerService.show();
      let excelFile: any[] = [];
      let remainTallyStoneAll = this.stockTallyList.map(x => x.stockOnHandList.map(y => y.stoneId));

      let finalRemainStoneList: string[] = [];
      for (let index = 0; index < remainTallyStoneAll.length; index++) {
        const element = remainTallyStoneAll[index];
        finalRemainStoneList.push(...[...element]);
      }

      if (finalRemainStoneList && finalRemainStoneList.length > 0) {
        finalRemainStoneList.forEach(element => {
          excelFile.push({ "StoneId": element });
        });

        let isExport: boolean = this.utilityService.exportAsExcelFile(excelFile, "RemainStone_Excel");
        if (isExport)
          this.spinnerService.hide();
      }

    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  /* #endregion */

  public toggleRFIDScanDialog() {
    this.cleanScan();
    this.isViewRFIDModal = !this.isViewRFIDModal;
  }

  public toggleStockTallyLoadDialog() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to Re-load StockTally?", "StockTally")
        .subscribe(async (res: any) => {
          if (res.flag)
            await this.loadStockTallyAsync();
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public cleanScan() {
    this.tagArr = [];
    this.foundTags = [];
    this.notAllocatedTags = [];
    this.filterFoundTags = undefined as any;
    this.filterNotAllocatedTags = undefined as any;

    this.inventoryObj = new InventoryItems();
  }

}

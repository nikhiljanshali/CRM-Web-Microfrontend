import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DetailExpandEvent, GridComponent, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { Align } from '@progress/kendo-angular-popup';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { GridDetailConfig, LabIssue, LabIssueItem, LabIssueResponse, LabIssueSearchCriteria } from 'common/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig } from 'common/entities';
import { AppPreloadService, CommonService, ConfigService, FileStoreService, GridPropertiesService, LabService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-labissuemaster',
  templateUrl: './labissuemaster.component.html',
  styles: [
  ]
})
export class LabissuemasterComponent implements OnInit {

  //#region LabIssueList
  public labIssueSearchCriteria: LabIssueSearchCriteria = new LabIssueSearchCriteria();
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0
  public detailPageSize = 10;
  public detailSkip = 0
  public fields!: GridDetailConfig[];
  public detailFields!: GridDetailConfig[];
  public gridView!: DataResult;
  public gridDetailView!: DataResult;
  public isRegOrganization: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public labIssueItemDetail: LabIssueItem[] = [];
  public isShowCheckBoxAll: boolean = true;  
  //#endregion

  //#region Grid Configuration
  public isGridConfig: boolean = false;
  private fxCredential!: fxCredential;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  //#endregion

  public showDollarOption = false;
  public anchorAlign: Align = { horizontal: "right", vertical: "bottom" };
  public popupAlign: Align = { horizontal: "center", vertical: "top" };

  @ViewChild("anchor") public anchor!: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup!: ElementRef;

  constructor(private labService: LabService,
    private router: Router,
    private gridPropertiesService: GridPropertiesService,
    private commonService: CommonService,
    public utilityService: UtilityService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private appPreloadService: AppPreloadService,
    private fileStoreService: FileStoreService) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Grid List
  public async defaultMethodsLoad() {  
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);
    await this.getGridConfiguration();
    await this.loadLabIssues();
    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "LabIssueMaster", "LabIssueMasterGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("LabIssueMaster", "LabIssueMasterGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getLabIssueMasterGrid();
      }

      this.detailFields = await this.gridPropertiesService.getLabIssueItems();

    } catch (error: any) {
      this.alertDialogService.show(error.error)
      this.spinnerService.hide();
    }
  }

  public async loadLabIssues() {
    try {
      let labIssues: LabIssueResponse = await this.labService.getLabIssue(this.labIssueSearchCriteria, this.skip, this.pageSize);
      this.gridView = process(labIssues.labIssues, { group: this.groups });
      this.gridView.total = labIssues.totalCount;
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
      this.spinnerService.hide();
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadLabIssues();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(labIssueGrid: GridComponent, event: PageChangeEvent): void {
    this.skip = event.skip;

    for (let index = this.skip; index < this.pageSize + this.skip; index++) {
      labIssueGrid.collapseRow(index);
    }
    this.loadLabIssues();
  }

  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0
    this.loadLabIssues()
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.labIssueSearchCriteria = new LabIssueSearchCriteria()
    this.loadLabIssues();
  }

  //#endregion

  //#region Grid list detail
  public loadDetailGrid(labIssueItems: LabIssueItem[]) {
    this.gridDetailView = process(this.labIssueItemDetail, {});
    this.gridDetailView.total = labIssueItems.length;
    this.spinnerService.hide();

  }

  public pageChangeDetail(index: number, event: PageChangeEvent): void {
    this.spinnerService.show();
    this.labIssueItemDetail = [];
    this.detailSkip = event.skip;


    if (this.gridView.data[index].labIssueItems.length > 0) {
      for (let i = this.detailSkip; i < this.detailPageSize + this.detailSkip; i++) {
        const element = this.gridView.data[index].labIssueItems[i];
        if (element)
          this.labIssueItemDetail.push(element);
      }

      this.loadDetailGrid(this.gridView.data[index].labIssueItems);
    }
  }

  public onDetailExpand(labIssueGrid: GridComponent, e: DetailExpandEvent) {

    this.spinnerService.show();
    this.labIssueItemDetail = [];
    this.detailSkip = 0;

    for (let index = this.skip; index < this.pageSize + this.skip; index++) {
      if (e.index != index)
        labIssueGrid.collapseRow(index);
    }

    if (e.dataItem.labIssueItems.length > 0) {
      for (let index = 0; index < this.detailPageSize; index++) {
        const element = e.dataItem.labIssueItems[index];
        if (element)
          this.labIssueItemDetail.push(element);
      }

      this.loadDetailGrid(e.dataItem.labIssueItems);
    }
  }
  //#endregion

  //#region Grid configuration
  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public async setNewGridConfig(gridConfig: GridConfig) {
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
  //#endregion

  //#region Export to excel

  public async exportExcelForLab() {
    try {
      if (this.mySelection[0]) {
        this.spinnerService.show();       
        let findIssue: LabIssue = this.gridView.data.find(c => c.id == this.mySelection[0]);
        let response = await this.fileStoreService.downloadExcel(this.fxCredential.organizationId, findIssue);
        if (response) {
          var downloadURL = window.URL.createObjectURL(response);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = `${this.utilityService.exportFileName(this.utilityService.replaceSymbols(findIssue.lab.name))}`;
          link.click();

          this.exportGiaCsv(findIssue);
        }
        else
          this.spinnerService.hide();

      }
    } catch (error: any) {
      this.alertDialogService.show("something went wrong, please try again or contact administrator");
      this.spinnerService.hide();
    }
  }

  public async exportGiaCsv(findIssue: LabIssue) {
    try {
      let response = await this.fileStoreService.exportGiaCsvData(this.fxCredential.organizationId, findIssue);
      if (response) {
        var downloadURL = window.URL.createObjectURL(response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `${this.utilityService.exportFileName(this.utilityService.replaceSymbols(findIssue.lab.name + "Csv"))}`;
        link.click();        
        this.spinnerService.hide();
      }
      else
        this.spinnerService.hide();
    } catch (error: any) {
      this.alertDialogService.show("something went wrong, please try again or contact administrator");
      this.spinnerService.hide();
    }
  }
  //#endregion

  //#region Popup Close
  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.showDollarOption = false;
    }
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }
  //#endregion
}

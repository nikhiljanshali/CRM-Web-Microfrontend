import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'shared/businessobjects';
import { AppPreloadService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { MemoResponse, MemoSearchCriteria } from '../../businessobjects';
import { Ledger, Memo } from '../../entities';
import { GridPropertiesService, MemoService, PrintMemoFormat } from '../../services';

@Component({
  selector: 'app-memomaster',
  templateUrl: './memomaster.component.html',
  styleUrls: ['./memomaster.component.css']
})
export class MemomasterComponent implements OnInit {

  public stoneIds!: string;
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public memoSearchCriteria: MemoSearchCriteria = new MemoSearchCriteria();
  public listPartyItems: Array<{ text: string; value: string }> = [];
  public partyItems: Ledger[] = [];
  public selectedPartyItem?: { text: string, value: string };
  public isMemo: boolean = false;
  public isVisiable: boolean = true;
  public isViewOnly: boolean = false;
  public memoObj: Memo = new Memo();
  public allowCustom = false;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  dateToday!: string;
  htmlDate: Date = new Date();
  public memoItem: Memo = new Memo;

  constructor(
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public appPreloadService: AppPreloadService,
    public router: Router,
    private gridPropertiesService: GridPropertiesService,
    public memoService: MemoService,
    public datePipe: DatePipe,
    private printMemoFormat: PrintMemoFormat) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fields = await this.gridPropertiesService.getMemoMasterGrid();
    await this.loadParties();
    await this.loadMemo();

    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async loadMemo() {
    try {
      this.spinnerService.show();
      let memo: MemoResponse = new MemoResponse();
      memo = await this.memoService.getMemos(this.memoSearchCriteria, this.skip, this.pageSize);
      this.gridView = process(memo.memos, { group: this.groups });
      this.gridView.total = memo.totalCount;
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }


  public dateDiffCountValue(expdate: any) {
    let date1 = new Date(expdate);
    let date2 = new Date();
    let diff = Math.floor(date2.getTime() - date1.getTime());
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  }

  public async loadParties() {
    try {
      let ledgerType: string[] = ['Boiler', 'Photography', 'Lab']
      //this.partyItems = await this.memoService.getAllLedgersByType(ledgerType);
      this.listPartyItems = [];
      this.partyItems.forEach(z => { this.listPartyItems.push({ text: z.name, value: z.id }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public partyChange() {
    let fetchParty = this.partyItems.find(x => x.id == this.selectedPartyItem?.value);
    if (fetchParty)
      this.memoSearchCriteria.party = fetchParty.id;
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadMemo();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadMemo();
  }

  public selectedRowChange(e: any) {
    this.memoObj = e.selectedRows[0].dataItem
    this.isViewOnly = true;

  }

  public dblClick() {
    if (this.isViewOnly)
      this.isMemo = true;
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0
    this.loadMemo();
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.memoSearchCriteria = new MemoSearchCriteria();
    this.stoneIds = '';
    this.loadMemo()
  }

  public openMemoDialog(): void {
    this.isViewOnly = false;
    this.isMemo = true;
  }

  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public closeMemoDialog(event: boolean) {
    this.isMemo = event;
    this.isViewOnly = false;
    this.mySelection = []
    this.loadMemo();
  }

  public async memoGet(MemoNo: string) {
    try {      
      this.spinnerService.show();
      this.memoItem = new Memo()
      this.memoItem = await this.memoService.getDataByMemoNo(MemoNo);

      if (this.memoItem && this.memoItem.inventoryItems.length > 0) {
        let printStone: HTMLIFrameElement = document.createElement("iframe");
        printStone.name = "print_detail";
        printStone.style.position = "absolute";
        printStone.style.top = "-1000000px";
        document.body.appendChild(printStone);
        printStone?.contentWindow?.document.open();
        printStone?.contentWindow?.document.write(`<html><head>
              <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <link rel="stylesheet" type="text/css" href="commonAssets/css/printmemo.css" media="print" />
              </head>`);
        let printContents: string;        
        printContents = this.printMemoFormat.getMemoPrint(this.memoItem);          
        printStone?.contentWindow?.document.write(printContents);
        printStone?.contentWindow?.document.close();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

}

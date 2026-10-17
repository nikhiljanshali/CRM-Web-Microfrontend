import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig } from 'shared/enitites';
import { AppPreloadService, CommonService, ConfigService, FileStoreService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { AccountingconfigService, GridPropertiesService, TransactItemService } from '../../services';
import { TaxType, TransactItemGroup } from "../../entities";
import { TransactItem } from '../../entities';
import { TransactItemSearchCriteria } from '../../businessobjects/transactItem/transactItemSearchCriteria';

@Component({
  selector: 'app-transactitem',
  templateUrl: './transactitem.component.html',
  styleUrls: ['./transactitem.component.css']
})
export class TransactitemComponent implements OnInit {

  public pageName: string = 'Tansact Item';
  public isTransctItemMaster: boolean = false;
  public isEditMode: boolean = false;

  public gridView!: DataResult;
  public fields!: GridDetailConfig[];
  public skeletonArray = new Array(18);
  public filterFlag = true;


  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0


  // Grid Configuration
  public isGridConfig: boolean = false;
  private fxCredential!: fxCredential;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;

  public transactItemGroups: TransactItemGroup = new TransactItemGroup();
  public listTransactItems: Array<TransactItemGroup> = [];
  public listTransactName: Array<string> = [];
  public taxTypes: TaxType = new TaxType();
  public listTaxTypeItems: Array<TaxType> = [];

  public transactItemObj: TransactItem = new TransactItem();


  // Filter TransactItme 
  public transactItemSearchCriteria: TransactItemSearchCriteria = new TransactItemSearchCriteria();

  constructor(
    private gridPropertiesService: GridPropertiesService,
    private router: Router,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private appPreloadService: AppPreloadService,
    public utilityService: UtilityService,
    private transactItemService: TransactItemService,
    private accountingconfigService: AccountingconfigService
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);
    await this.getGridConfiguration();
    await this.getTransactItmeGroupDetails();
    await this.getTaxTypeDetails();

    await this.loadTransactItem();
    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async getTransactItmeGroupDetails() {
    let tigData = await this.accountingconfigService.getTransactItemGroups();
    tigData.forEach((item) => {
      this.listTransactItems.push({ id: item.id, name: item.name, parent: item.parent, description: item.description })
    })
  }
  public async getTaxTypeDetails() {
    let ttData = await this.accountingconfigService.getTaxTypesList();
    ttData.forEach((item) => {
      this.listTaxTypeItems.push({ id: item.id, name: item.name, rate: item.rate, type: item.type, isRounding: item.isRounding })
    })
  }

  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "TransactItem", "TransactItemGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("TransactItem", "TransactItemGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getTransactItemGrid();
      }
    } catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public async loadTransactItem() {
    try {
      let transactItemData: any = await this.transactItemService.getTransactItemPaginated(this.skip, this.pageSize);
      transactItemData.forEach((item: any) => {
        this.listTransactName.push(item.name);
      });
      this.gridDataFetcher(transactItemData);
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  private gridDataFetcher(transactItemData: any) {
    this.gridView = process(transactItemData, { group: this.groups });
    this.gridView.total = transactItemData.length;
  }

  //#region Filter section
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public async onFilterSubmit(form: NgForm) {
    try {
      if (form?.valid) {
        if (form?.value.name) {
          let transactItemData = await this.transactItemService.getTransactItemByName(form?.value.name);
          this.gridDataFetcher(transactItemData);
        }
        if (form?.value.group) {
          let transactItemData = await this.transactItemService.getTransactItemByGroup(form?.value.group.name);
          this.gridDataFetcher(transactItemData);
        }
      }
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }

    // this.loadTransactItem()
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.loadTransactItem()
  }
  //#endregion Filter section

  //#region Grid Configuration
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
  //#endregion Grid Configuration

  //#region Transact Itme CRUD
  public selectedRowChange(e: any) {
    this.isEditMode = true;
    this.transactItemObj = new TransactItem();
    let value: any = e.selectedRows[0].dataItem;
    this.transactItemObj = { ...value };
  }

  public async submitTransactItem(form?: NgForm, action?: boolean) {
    try {
      if (form?.valid) {
        this.spinnerService.show();
        let result = await this.transactItemService.insertTransactItem(form?.value);
        if (result) {
          this.spinnerService.hide();
          this.resetForm(form);
          this.utilityService.showNotification(`You have been added record successfully!`)
          this.loadTransactItem();
          if (!action)
            this.isTransctItemMaster = false;
        }
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public async updateTransactItem(form?: NgForm, action?: boolean) {
    try {
      if (form?.valid) {
        this.spinnerService.show();
        let result = await this.transactItemService.updateTransactItem(this.transactItemObj);
        if (result) {
          this.spinnerService.hide();
          this.resetForm(form);
          this.utilityService.showNotification(`You have been updated record successfully!`)
          this.loadTransactItem();
          if (!action)
            this.isTransctItemMaster = false;
        }
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public openTransationItmeEditMode(action: boolean) {
    if (action) {
      this.isTransctItemMaster = true;
    }
  }

  public async addNewTransactItem() {
    this.isTransctItemMaster = true;
    this.resetForm();
  }

  public resetForm(form?: NgForm) {
    this.transactItemObj = new TransactItem();
    this.isEditMode = false;
    form?.reset();
  }

  public closeTransactItemMaster(form: NgForm) {
    this.isTransctItemMaster = false;
    this.resetForm(form);
  }

  public async deleteTransactItem() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.transactItemService.deleteTransactItem(this.transactItemObj.id);
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadTransactItem();
              this.spinnerService.hide();
              this.isEditMode = false;
              this.utilityService.showNotification(`You have been deleted successfully!`)
            }
          }
        })
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion Transact Itme CRUD
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AggregateDescriptor, DataResult, GroupDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { UtilityService, ConfigService } from 'shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, MasterConfig, MasterDNorm } from 'shared/enitites';
import { AlertdialogService } from 'shared/views';
import { CartItem } from '../../businessobjects';
import { CartService, CustomerService, GridPropertiesService, MasterConfigService, SystemUserService } from '../../services';
import { SelectableSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CartSearchCriteria, CustomerDNorm, SystemUserDNorm } from '../../entities';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { NgForm } from '@angular/forms';
import { OriginValue } from 'shared/services';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @ViewChild("gridContext") private gridContext: any;

  private originValue = OriginValue;
  public gridView!: DataResult;
  public pageSize = 50;
  public skip = 0
  public groups: GroupDescriptor[] = [];
  public fields!: GridDetailConfig[];
  public sort!: SortDescriptor[];
  public aggregates: AggregateDescriptor[] = [
    { field: 'customerName', aggregate: 'max' },
    { field: 'netAmount', aggregate: 'sum' },
    { field: 'totalWeight', aggregate: 'sum' },
  ];
  public mySelection: string[] = [];
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
    checkboxOnly: true
  };
  public state: State = {};
  public isGridConfig: boolean = false;
  public isDelete: boolean = false;

  public cartData: CartItem[] = [];
  public clickedRowItem: CartItem = new CartItem();
  public selectedCartItems: CartItem[] = [];

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };

  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public filterFlag = true;
  public fxCredentials?: fxCredential;
  public isSeller: boolean = false;

  //search
  public cartSearchCriteria: CartSearchCriteria = new CartSearchCriteria();
  public filterCustomer: string = '';
  public filterCustomerChk: boolean = true;

  //listing - customer
  public customerItems: CustomerDNorm[] = [];
  public listCustomerItems: Array<{ text: string; value: string }> = [];
  public selectedCustomerId: string = '';
  //listing - seller/systemeuser
  public sellerItems: SystemUserDNorm[] = [];
  public listSellerItems: Array<{ text: string; value: string }> = [];
  public selectedSellereId: string = '';

  public listShape: Array<{ name: string; isChecked: boolean }> = [];
  public listCuts: Array<{ name: string; isChecked: boolean }> = [];
  public listColor: Array<{ name: string; isChecked: boolean }> = [];
  public listClarity: Array<{ name: string; isChecked: boolean }> = [];
  public listPolish: Array<{ name: string; isChecked: boolean }> = [];
  public listSymm: Array<{ name: string; isChecked: boolean }> = [];
  public listFlour: Array<{ name: string; isChecked: boolean }> = [];
  public listLabs: Array<{ name: string; isChecked: boolean }> = [];


  public masterConfigList!: MasterConfig;
  public inclusionData: MasterDNorm[] = [];
  public allTheCuts!: MasterDNorm[];
  public allTheShape!: MasterDNorm[];
  public allTheColors!: MasterDNorm[];
  public allTheClarity!: MasterDNorm[];
  public allTheCPS!: MasterDNorm[];
  public allTheFluorescences!: MasterDNorm[];
  public allTheLabs!: MasterDNorm[];

  // Count
  public totalPcs: number = 0;
  public totalCt: number = 0;
  public totalAmt: number = 0;
  public selectedPcs: number = 0;
  public selectedCt: number = 0;
  public selectedAmt: number = 0;


  constructor(
    private router: Router,
    private cartService: CartService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private gridPropertiesService: GridPropertiesService,
    private alertDialogService: AlertdialogService,
    private customerService: CustomerService,
    private systemUserService: SystemUserService,
    private masterConfigService: MasterConfigService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    if (this.fxCredentials && this.fxCredentials.origin.toLowerCase() == this.originValue.Seller.toString().toLowerCase()) {
      this.isSeller = true;
      this.cartSearchCriteria.sellerId = this.fxCredentials?.id;
    }
    else
      this.isSeller = false;

    if (!this.fxCredentials)
      this.router.navigate(["login"]);

    await this.getGridConfiguration();
    await this.getPreFilterDetails();
    await this.loadCartList();

    this.utilityService.filterToggleSubject.subscribe(flag => { this.filterFlag = flag; });
  }
  //#region Pre-data-for-filter
  public async getPreFilterDetails() {
    //Seller
    this.sellerItems = [];
    let data = await this.systemUserService.getSystemUserByOrigin(this.originValue.Seller.toString());
    data.forEach((item) => {
      this.sellerItems.push({ id: item.id, name: item.fullName.toLowerCase(), mobile: item.mobile, email: item.email, address: item.address });
    });

    // Filter: Drop-downlist
    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();

    this.allTheLabs = this.masterConfigList.lab;
    this.allTheLabs.forEach(z => { this.listLabs.push({ name: z.name, isChecked: false }); });

    this.allTheShape = this.masterConfigList.shape;
    this.allTheShape.forEach(z => { this.listShape.push({ name: z.name, isChecked: false }); });

    this.allTheCuts = this.masterConfigList.cut;
    this.allTheCuts.forEach(z => { this.listCuts.push({ name: z.name, isChecked: false }); });

    this.allTheColors = this.masterConfigList.colors;
    this.allTheColors.forEach(z => { this.listColor.push({ name: z.name, isChecked: false }); });

    this.allTheClarity = this.masterConfigList.clarities;
    this.allTheClarity.forEach(z => { this.listClarity.push({ name: z.name, isChecked: false }); });


    this.allTheCPS = this.masterConfigList.cps;
    this.allTheCPS.forEach(z => { this.listCuts.push({ name: z.name, isChecked: false }); });
    this.allTheCPS.forEach(z => { this.listPolish.push({ name: z.name, isChecked: false }); });
    this.allTheCPS.forEach(z => { this.listSymm.push({ name: z.name, isChecked: false }); });

    this.allTheFluorescences = this.masterConfigList.fluorescence;
    this.allTheFluorescences.forEach(z => { this.listFlour.push({ name: z.name, isChecked: false }); });

  }
  public selectedAssetFromCustomer(event: any) {
    if (event) {
      let fetchCustomer = this.customerItems.find(x => x.name == event);
      if (fetchCustomer) {
        setTimeout(() => {
          this.cartSearchCriteria.customerId = fetchCustomer?.name ?? '' as any;
          this.selectedCustomerId = fetchCustomer?.id.toString() ?? '' as any;
        }, 0);
        this.cartSearchCriteria.customerId = fetchCustomer?.name ?? '' as any;
      }
    }
    else
      this.cartSearchCriteria.customerId = '' as any;

  }

  public async handleCustomerFilter(value: any) {
    try {
      if (value && value.length >= 4) {
        let customers: CustomerDNorm[] = await this.customerService.getAllCustomerDNormsByName(value);
        this.listCustomerItems = [];
        this.customerItems = customers;
        this.customerItems.reverse().forEach(z => { this.listCustomerItems.push({ text: z.name, value: z.name }); });
        this.spinnerService.hide();
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public selectedAssetFromSeller(e: any) {
    if (e) {
      let fetchSeller = this.sellerItems.find(x => x.name == e);
      if (fetchSeller) {
        setTimeout(() => {
          this.cartSearchCriteria.sellerId = fetchSeller?.name ?? '' as any;
          this.selectedSellereId = fetchSeller?.id.toString() ?? null as any;
        }, 0);
        this.cartSearchCriteria.sellerId = fetchSeller?.name ?? '' as any;
      }
    }
    else
      this.cartSearchCriteria.sellerId = '' as any;

  }

  public async handleSellerFilter(value: any) {
    try {
      if (value && value.length >= 4) {
        let seller: SystemUserDNorm[] = this.sellerItems.filter(x => x.name.includes(value));
        this.listSellerItems = [];
        this.sellerItems = seller;
        this.sellerItems.reverse().forEach(z => { this.listSellerItems.push({ text: z.name, value: z.name }); });
        this.spinnerService.hide();
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public getCommaSapratedString(vals: any[], isAll: boolean = false): string {
    let name = vals.join(',')
    if (!isAll)
      if (name.length > 15)
        name = name.substring(0, 15) + '...';

    return name;
  }

  public async onFilterSubmit(form: NgForm) {
    try {
      this.spinnerService.show();
      let searchData: CartSearchCriteria = new CartSearchCriteria();
      searchData.stoneId = form.value.stoneId ? form.value.stoneId : null;
      searchData.customerId = this.selectedCustomerId;
      searchData.sellerId = this.selectedSellereId;
      searchData.certificateNo = form.value.certificateNo ? form.value.certificateNo : null;
      searchData.minSize = form.value.minSize ? form.value.minSize : null;
      searchData.maxSize = form.value.maxSize ? form.value.maxSize : null;
      searchData.shapes = form.value.shapes ? form.value.shapes : [];
      searchData.colors = form.value.colors ? form.value.colors : [];
      searchData.cuts = form.value.cuts ? form.value.cuts : [];
      searchData.clarities = form.value.clarity ? form.value.clarity : [];
      searchData.fluorescences = form.value.fluorescences ? form.value.fluorescences : [];
      searchData.labs = form.value.labs ? form.value.labs : [];
      searchData.polishes = form.value.polishes ? form.value.polishes : [];
      searchData.symmetries = form.value.symmetries ? form.value.symmetries : [];
      let filterData = await this.cartService.getCartItemsByCriteria(searchData);
      if (filterData) {
        this.cartData = [];
        this.cartData = filterData;
        this.cartData.forEach(z => {
          z.customerName = z.customer.name;
          z.netAmount = z.invItem.price.netAmount ?? 0;
          z.totalWeight = z.invItem.weight ?? 0;
        });
        if (!this.state.group || this.state.group.length < 1) {
          this.state.group = [{ field: "customerName", aggregates: this.aggregates }];
        }
        if (this.state.group && this.state.group.length > 0) {
          this.cartData.forEach((_, idx) => {
            this.gridContext.collapseGroup(idx.toString());
          });
        }
        this.spinnerService.hide();
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public ApplyArrayStringFilter(a: string, z: string[]): boolean {
    let filter = true;
    if ((a == null || a == undefined || a?.length == 0) && (z == null || z == undefined || z?.length == 0))
      filter = true;
    else
      if (a == null || a == undefined || a?.length == 0)
        filter = false;
      else
        if ((a && a.length > 0) && (z && z.length > 0))
          filter = z.map(b => b.toLowerCase()).includes(a.toLowerCase());
    return filter;
  }

  public clearFilter(form: NgForm) {
    this.spinnerService.show();
    setTimeout(() => {
      form.reset();
      this.selectedCustomerId = '';
      this.selectedSellereId = '';
      this.cartSearchCriteria = new CartSearchCriteria();
      this.listShape.forEach(z => { z.isChecked = false });
      this.listColor.forEach(z => { z.isChecked = false });
      this.listClarity.forEach(z => { z.isChecked = false });
      this.listCuts.forEach(z => { z.isChecked = false });
      this.listPolish.forEach(z => { z.isChecked = false });
      this.listSymm.forEach(z => { z.isChecked = false });
      this.listLabs.forEach(z => { z.isChecked = false });
      this.listFlour.forEach(z => { z.isChecked = false });
      this.loadCartList();
      this.spinnerService.hide();
    }, 100);
  }

  public onMultiSelectChange(val: Array<{ name: string; isChecked: boolean }>, selectedData: string[]): void {
    val.forEach(element => {
      element.isChecked = false;
    });

    if (selectedData && selectedData.length > 0) {
      val.forEach(element => {
        selectedData.forEach(item => {
          if (element.name.toLocaleLowerCase() == item.toLocaleLowerCase())
            element.isChecked = true;
        });
      });
    }
  }

  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }
  //#endregion

  //#region List  
  public async loadCartList() {
    try {
      this.spinnerService.show();
      let response: CartItem[] = await this.cartService.getCartItemsByCriteria(this.cartSearchCriteria);
      if (response && response.length > 0) {
        this.cartData = [];
        this.cartData = response;
        this.cartData.forEach(z => {
          z.customerName = z.customer.name;
          z.netAmount = z.invItem.price.netAmount ?? 0;
          z.totalWeight = z.invItem.weight ?? 0;
        });
        if (!this.state.group || this.state.group.length < 1) {
          this.state.group = [{ field: "customerName", aggregates: this.aggregates }];
        }
        if (this.state.group && this.state.group.length > 0) {
          this.cartData.forEach((_, idx) => {
            this.gridContext.collapseGroup(idx.toString());
          });
        }
        this.spinnerService.hide();
        await this.calcualteCounter();
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async calcualteCounter() {
    this.totalPcs = this.cartData.length;
    for (var _i = 0; _i < this.cartData.length; _i++) {
      this.totalAmt += this.cartData[_i].invItem.price.netAmount ?? 0;
      this.totalCt += this.cartData[_i].invItem.price.perCarat ?? 0;
    }
  }
  //#endregion List 

  //#region Grid Config
  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "Cart", "CartGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("Cart", "CartGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getCartItems();
      }
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group)
      state.group.map(group => group.aggregates = this.aggregates);
    this.state = state;
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

  public onSelectCart(event: any): void {
    try {
      if (event.selectedRows && event.selectedRows.length > 0) {
        event.selectedRows.forEach((element: any) => {
          let Selectedindex = this.selectedCartItems.findIndex(x => x.id == element.dataItem.id);
          if (Selectedindex < 0) {
            this.selectedCartItems.push(element.dataItem)
            this.clickedRowItem = new CartItem();
            this.clickedRowItem = element.dataItem;
            if (this.clickedRowItem.id && this.selectedCartItems.length == 1)
              this.isDelete = true;

          }
        });
      }
      else {
        event.deselectedRows.forEach((element: any) => {
          if (!element.dataItem.isDisabled) {
            let index = this.selectedCartItems.findIndex(x => x.id == element.dataItem.id);
            if (index >= 0)
              this.selectedCartItems.splice(index, 1)
            if (this.clickedRowItem.id && this.selectedCartItems.length <= 0)
              this.isDelete = false;
          }
        });
      }
      this.calcualteSelectedCounter(this.selectedCartItems);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async calcualteSelectedCounter(data: CartItem[]) {
    this.selectedPcs = 0;
    this.selectedAmt = 0;
    this.selectedCt = 0;
    this.selectedPcs = data.length;
    if (data.length > 0) {
      for (var _i = 0; _i <= data.length; _i++) {
        this.selectedAmt += data[_i].invItem.price.netAmount ?? 0;
        this.selectedCt += data[_i].invItem.price.perCarat ?? 0;
      }
    } else {
      this.selectedAmt = 0;
      this.selectedCt = 0;
    }
  }


  public async deleteCartItem() {
    try {
      if (this.clickedRowItem.id && this.selectedCartItems.length == 1) {
        this.alertDialogService.ConfirmYesNo(`Are you sure you want to delete ${this.clickedRowItem.id}?`, "Delete").subscribe(async (confirm: any) => {
          if (confirm.flag) {
            this.spinnerService.show();
            var res = await this.cartService.deleteCartItem(this.clickedRowItem.id);
            if (res) {
              await this.loadCartList();
              this.isDelete = false;
              this.spinnerService.hide();
              this.utilityService.showNotification('selected card item removed successfully!');
            } else {
              this.isDelete = false;
              this.spinnerService.hide();
              this.alertDialogService.show('Please contact administrator!');
            }
          }
        });
      }
      else {
        this.alertDialogService.show('You have selected multiple reocord, Please select one at a time!');
      }
    }
    catch (error: any) {
      this.isDelete = false;
      this.spinnerService.hide();
      this.alertDialogService.show('Please contact administrator!');
    }
  }

}

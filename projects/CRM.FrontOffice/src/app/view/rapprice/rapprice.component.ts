import { Component, OnInit } from '@angular/core';
import { fxCredential, MasterConfig, MasterDNorm, RapPrice } from 'shared/enitites';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { AlertdialogService } from 'shared/views';
import { UtilityService } from 'shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import * as xlsx from 'xlsx';
import { NgForm } from '@angular/forms';
import { RapPriceExcelItems, RapPriceFilter } from '../../businessobjects';
import { MasterConfigService, RapPriceService, SupplierApiRequestService, SupplierService } from '../../services';
import { Supplier } from '../../entities';

@Component({
  selector: 'app-rapprice',
  templateUrl: './rapprice.component.html',
  styles: [
  ]
})
export class RappriceComponent implements OnInit {
  //#region Grid Data
  public groups: GroupDescriptor[] = [];
  public gridData!: DataResult;
  public filterFlag = true;
  //#endregion

  //#region list & Objects
  public masterConfigList!: MasterConfig;
  public inclusionData: MasterDNorm[] = [];
  public allTheShapes!: MasterDNorm[];
  public allColors!: MasterDNorm[];
  public allClarities!: MasterDNorm[];

  public listShape: Array<{ name: string; isChecked: boolean }> = [];
  public listColor: Array<{ name: string; isChecked: boolean }> = [];
  public listClarity: Array<{ name: string; isChecked: boolean }> = [];

  public RapPriceData: RapPrice[] = [];
  public listRapPrice: RapPriceExcelItems[] = [];

  public fxCredentials?: fxCredential;
  public filterObj: RapPriceFilter = new RapPriceFilter();
  //#endregion

  public errWeight: string = '';

  constructor(private rapPriceService: RapPriceService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private spinnerService: NgxSpinnerService,
    private supplierService: SupplierService,
    private supplierApiRequestService: SupplierApiRequestService) { }

  public async ngOnInit() {
    try {
      this.spinnerService.show();
      await this.defaultMethodsLoad();
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong on get data!');
    }
  }

  //#region Init Data
  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.getMasterConfigData();
    //await this.getRapPriceData();

    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async getMasterConfigData() {
    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();

    this.allTheShapes = this.masterConfigList.shape;
    this.allTheShapes.forEach(z => { this.listShape.push({ name: z.name, isChecked: false }); });

    this.allColors = this.masterConfigList.colors;
    this.allColors.forEach(z => { this.listColor.push({ name: z.name, isChecked: false }); });

    this.allClarities = this.masterConfigList.clarities;
    this.allClarities.forEach(z => { this.listClarity.push({ name: z.name, isChecked: false }); });

    this.spinnerService.hide();
  }

  public async getRapPriceData() {
    this.spinnerService.show();
    let result = await this.rapPriceService.getAllData();
    if (result) {
      this.RapPriceData = result;
      this.loadItems([...this.RapPriceData]);
    }
  }
  //#endregion

  //#region OnChange Functions
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadItems([...this.RapPriceData]);
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public loadItems(grid_data: RapPrice[]) {
    this.gridData = process(grid_data, { group: this.groups });
    this.gridData.total = grid_data.length;
    this.spinnerService.hide();
  }

  public onFilterSubmit(form: NgForm) {
    this.spinnerService.show();
    let allData = [...this.RapPriceData];

    let filterData = allData.filter(a => this.ApplyArrayStringFilter(a.shape, this.filterObj.shape) &&
      this.ApplyArrayStringFilter(a.color, this.filterObj.color) &&
      this.ApplyArrayStringFilter(a.clarity, this.filterObj.clarity) &&
      ((this.filterObj.price != null && this.filterObj.price?.toString() != '') ? (a.price == this.filterObj.price) : true) &&
      ((this.filterObj.minSize != null && this.filterObj.minSize?.toString() != '') ? (a.minSize >= this.filterObj.minSize) : true) &&
      ((this.filterObj.maxSize != null && this.filterObj.maxSize?.toString() != '') ? (a.maxSize <= this.filterObj.maxSize) : true));

    this.loadItems(filterData);
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
      this.filterObj = new RapPriceFilter();
      this.listShape.forEach(z => { z.isChecked = false });
      this.listColor.forEach(z => { z.isChecked = false });
      this.listClarity.forEach(z => { z.isChecked = false });
      this.loadItems([...this.RapPriceData]);
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

  public getCommaSapratedString(vals: any[], isAll: boolean = false): string {
    let name = vals.join(',')
    if (!isAll)
      if (name.length > 15)
        name = name.substring(0, 15) + '...';

    return name;
  }

  public checkMinMaxValidation(min: any, max: any): string {
    if (min && max) {
      if (parseFloat(min) > parseFloat(max))
        return "min value must greater than max value!";
    }
    else if (min && !max)
      return "max value required!";
    else if (min && !max)
      return "min value required!";

    return '';
  }
  //#endregion

  //#region Update Data
  public onSelectExcelFile(event: Event) {
    try {
      let acceptedFiles: string[] = []
      const target = event.target as HTMLInputElement;
      if (target.accept) {
        acceptedFiles = target.accept.split(',').map(function (item) {
          return item.trim();
        });
      }

      if (target.files && target.files.length) {
        if (acceptedFiles.indexOf(target.files[0].type) == -1) {
          this.alertDialogService.show(`Please select valid file.`);
          return;
        }

        let file = target.files[0];
        let fileReader = new FileReader();
        this.spinnerService.show();
        fileReader.onload = async (e) => {

          var arrayBuffer: any = fileReader.result;
          let data = new Uint8Array(arrayBuffer);
          let arr = new Array();

          for (let i = 0; i != data.length; ++i)
            arr[i] = String.fromCharCode(data[i]);

          let workbook = xlsx.read(arr.join(""), { type: "binary" });
          var rapPriceFetchItems = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as any;

          if (rapPriceFetchItems && rapPriceFetchItems.length > 0) {
            this.listRapPrice = new Array<any>();

            for (let j = 0; j < rapPriceFetchItems.length; j++) {

              let newItem = await this.mappingExcelDataToRapPrice(rapPriceFetchItems, j);
              this.listRapPrice.push(newItem);
            }

            this.RapPriceData = this.convertToRapPrice(this.listRapPrice);
            this.loadItems([...this.RapPriceData]);
            this.spinnerService.hide();
          }
        }
        fileReader.readAsArrayBuffer(file);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public mappingExcelDataToRapPrice(excelData: any, excelIndex: number): RapPriceExcelItems {
    let newItem: RapPriceExcelItems = new RapPriceExcelItems();

    let obj = excelData[excelIndex];
    newItem.shape = this.getDisplayNameFromMasterDNorm(obj[Object.keys(obj)[0]]?.toString().trim(), this.allTheShapes);
    newItem.clarity = this.getDisplayNameFromMasterDNorm(obj[Object.keys(obj)[1]]?.toString().trim(), this.allClarities);
    newItem.color = this.getDisplayNameFromMasterDNorm(obj[Object.keys(obj)[2]]?.toString().trim(), this.allColors);
    newItem.minSize = obj[Object.keys(obj)[3]]?.toString().trim();
    newItem.maxSize = obj[Object.keys(obj)[4]]?.toString().trim();
    newItem.price = obj[Object.keys(obj)[5]]?.toString().trim();

    return newItem;
  }

  public getDisplayNameFromMasterDNorm(name: string, list: MasterDNorm[]): string {
    var obj = list.find(c => c.name.toLowerCase() == name.toLowerCase() || c.displayName.toLowerCase() == name.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(name.toLowerCase()));

    return obj?.name ?? null as any;
  }

  public convertToRapPrice(data: RapPriceExcelItems[]): RapPrice[] {
    let rapPrices: RapPrice[] = [];
    data.forEach(z => {
      let rapPrice: RapPrice = new RapPrice();
      rapPrice.shape = z.shape;
      rapPrice.minSize = z.minSize;
      rapPrice.maxSize = z.maxSize;
      rapPrice.color = z.color;
      rapPrice.clarity = z.clarity;
      rapPrice.price = z.price;
      rapPrice.createdBy = this.fxCredentials?.id ?? '';
      rapPrices.push(rapPrice);
    });
    return rapPrices;
  }

  public async uploadInclusionResultFile() {
    try {
      this.spinnerService.show();
      let data = this.updateCriteriaChanges();
      if (data.length > 0) {
        let result = await this.rapPriceService.saveRapPriceFile(data);
        if (result) {
          this.utilityService.showNotification(`Rap Price updated successfully!`);
          this.listRapPrice = [];
          await this.getRapPriceData();
        }
        else {
          this.spinnerService.hide();
          this.alertDialogService.show('Something went wrong on update data, Try again later!');
        }
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong on update data, Try again later!');
    }
  }

  public updateCriteriaChanges(): RapPrice[] {
    let insertData = [...this.RapPriceData];
    //FL Data Criteria
    let existsFLData = insertData.find(z => z.clarity.toLowerCase() == 'fl');
    if (existsFLData == null) {
      let IFData = insertData.filter(z => z.clarity.toLowerCase() == 'if');
      if (IFData.length > 0) {
        IFData.forEach(z => {
          let rapPrice: RapPrice = new RapPrice();
          rapPrice.shape = z.shape;
          rapPrice.minSize = z.minSize;
          rapPrice.maxSize = z.maxSize;
          rapPrice.color = z.color;
          rapPrice.clarity = 'FL';
          rapPrice.price = z.price;
          rapPrice.createdBy = this.fxCredentials?.id ?? '';
          insertData.push(rapPrice);
        });
      }
    }

    //Max Size Changes
    insertData.forEach(z => {
      if (z.maxSize == 5.99)
        z.maxSize = 9.99;
      if (z.maxSize == 10.99)
        z.maxSize = 99.99;
    });

    return insertData;
  }
  //#endregion

  //#region Apply Rap Updation
  public async applyRapUpdate() {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to apply latest rap price?", "Update")
      .subscribe(async (confirm: any) => {
        if (confirm.flag) {
          try {
            this.spinnerService.show();
            var res = await this.rapPriceService.applyRapPrice();
            if (res) {
              await this.updateSupplierRapPrice();
              this.utilityService.showNotification('diamanto rap price apply successfully!');
              this.spinnerService.hide();
            } else {
              this.spinnerService.hide();
              this.alertDialogService.show('Rap price not apply, Please contact administrator!');
            }
          }
          catch (error: any) {
            console.error(error);
            this.alertDialogService.show('Rap price not apply, Please contact administrator!');
          }
        }
      });
  }

  private async updateSupplierRapPrice() {
    try {
      var suppliers = await this.supplierService.getAllSuppliers();
      if (suppliers && suppliers.length > 0) {
        var rapPrice = await this.rapPriceService.getAllData();
        if (rapPrice) {
          for (let i = 0; i < suppliers.length; i++) {
            var supplier = suppliers[i];
            await this.applySupplierRapUpdate(rapPrice, supplier);
          }
        }
      }
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show('Supplier(s) Rap price not apply, Please contact administrator!');
    }
  }

  private async applySupplierRapUpdate(rapPrice: RapPrice[], supplier: Supplier) {
    try {
      if (supplier && supplier.apiPath) {
        var res = await this.supplierApiRequestService.applyRapPrice(rapPrice, supplier.apiPath);
        if (res)
          this.utilityService.showNotification(supplier.name + ' rap price apply successfully!');
        else
          this.utilityService.showNotification(supplier.name + ' rap price not apply!', 'error');
      } else
        this.utilityService.showNotification(supplier.name + ' supplier api path not found!', 'warning');
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show('Supplier(s) Rap price not apply, Please contact administrator!');
    }
  }
  //#endregion

}

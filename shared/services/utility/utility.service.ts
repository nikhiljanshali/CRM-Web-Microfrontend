import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { WeightRange } from 'common/businessobjects';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Address, MfgPricingResponse, PricingDiscountApiResponse, PricingMarketSheetResponse } from 'shared/businessobjects';
import { MasterDNorm } from 'shared/enitites';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})

export class UtilityService {
  public filterToggleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private notificationService: NotificationService, private http: HttpClient) { }

  public showNotification(message: string, typeStyle?: string): void {
    this.notificationService.show({
      content: `${message}`,
      cssClass: "button-notification",
      hideAfter: 3500,
      animation: { type: "slide", duration: 400 },
      position: { horizontal: "right", vertical: "bottom" },
      type: {
        style: this.getStyle(typeStyle ?? "success"), icon: false
      },
    });
  }

  private getStyle(type: string) {
    let style: "success" | "error" | "info" | "warning" | "none" | undefined;
    switch (type.toLowerCase()) {
      case "success":
        style = "success";
        break;
      case "error":
        style = "error";
        break;
      case "info":
        style = "info";
        break;
      case "warning":
        style = "warning";
        break;
      default:
        style = "none";
        break;
    }
    return style;
  }

  public sortingMasterDNormPriority(data: MasterDNorm[]) {
    data = data.sort((n1, n2) => {
      let np1 = parseInt(n1.priority);
      let np2 = parseInt(n2.priority);

      if (np1 > np2)
        return 1;

      if (np1 < np2)
        return -1;

      return 0;
    });
    return data;
  }

  public numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  public numberAddMinusOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && (charCode > 31 && (charCode < 48 || charCode > 57)))
      if (charCode == 45)
        return true;
      else
        return false;
    return true;
  }

  public floatOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && (charCode > 31 && (charCode < 48 || charCode > 57)))
      return false;

    return true;
  }

  public discountfloat(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode != 46 && charCode != 45) && (charCode > 31 && (charCode < 48 || charCode > 57)))
      return false;

    return true;
  }

  public ConvertToFloatWithTwoDecimal(z: number) {
    z = parseFloat(parseFloat(z.toString()).toFixed(2));
    return z;
  }
  public ConvertToFloatWithFourDecimal(z: number) {
    z = parseFloat(parseFloat(z.toString()).toFixed(4));
    return z;
  }

  public setfilterToggleValue(value: boolean) {
    value = !value;
    this.filterToggleSubject.next(value);
  }

  public onlyUniqueFromStringArray(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  public getValidDate(date: any): Date {
    const day = moment(date).date();
    const month = moment(date).month();
    const year = moment(date).year();
    var newDate = new Date(year, month, day);
    return newDate;
  }

  public getValidDateWithFormate(date: any): string {
    const day = moment(date).date();
    const month = moment(date).month();
    const year = moment(date).year();
    var newDate = day + "/" + month + "/" + year;
    return newDate;
  }

  public setUTCDateFilter(date: Date) {
    var newDate = moment(date.setHours(5)).toDate();
    newDate = moment(newDate.setMinutes(30)).toDate();
    return moment(newDate).toDate();
  }

  public CheckStoneIds(StoneId: string): string[] {

    let stoneIds: string[] = [];
    if (StoneId !== undefined && StoneId !== null && StoneId !== "") {
      if (StoneId.indexOf(",") > -1) {
        var obj = StoneId.split(",");
        if (obj.length > 0) {
          for (let i = 0; i < obj.length; i++) {
            let item = obj[i];
            if (StoneId.indexOf(" ") > -1) {
              var spaceObj = item.split(" ");
              for (let index = 0; index < spaceObj.length; index++) {
                const element = spaceObj[index];
                if (element.indexOf("-") > -1)
                  stoneIds.push(element.trim());
                else
                  this.generateStoneIds(element, stoneIds);
              }
            }
            else {
              if (item.indexOf("-") > -1)
                stoneIds.push(item.trim());
              else
                this.generateStoneIds(item, stoneIds);
            }
          }
        }
      }
      else if (StoneId.indexOf(" ") > -1) {
        var obj = StoneId.split(" ");
        if (obj.length > 0) {
          for (let i = 0; i < obj.length; i++) {
            let item = obj[i];
            if (StoneId.indexOf(",") > -1) {
              var spaceObj = item.split(",");
              for (let index = 0; index < spaceObj.length; index++) {
                const element = spaceObj[index];
                if (element.indexOf("-") > -1)
                  stoneIds.push(element.trim());
                else
                  this.generateStoneIds(element, stoneIds);
              }
            }
            else {
              if (item.indexOf("-") > -1)
                stoneIds.push(item.trim());
              else
                this.generateStoneIds(item, stoneIds);
            }
          }
        }
      }
      else {
        if (StoneId.indexOf("-") > -1)
          stoneIds.push(StoneId);
        else
          this.generateStoneIds(StoneId, stoneIds);
      }
    }

    stoneIds = stoneIds.map(x => x.replace("/t", "").trim());
    return stoneIds;
  }

  public checkCertificateIds(certificateId: string): string[] {
    let certificateIds: string[] = [];
    if (certificateId !== undefined && certificateId !== null && certificateId !== "") {
      if (certificateId.indexOf(",") > -1) {
        var obj = certificateId.split(",");
        if (obj.length > 0) {
          for (let i = 0; i < obj.length; i++) {
            let item = obj[i];
            if (item.indexOf(" ") > -1) {
              var objSub = item.split(" ");
              if (objSub.length > 0) {
                for (let i = 0; i < objSub.length; i++) {
                  let itemSub = objSub[i];
                  if (itemSub)
                    certificateIds.push(itemSub.trim());
                }
              }
              else {
                if (item)
                  certificateIds.push(item.trim());
              }
            }
            else {
              if (item)
                certificateIds.push(item.trim());
            }
          }
        }
      }
      else if (certificateId.indexOf(" ") > -1) {
        var obj = certificateId.split(" ");
        if (obj.length > 0) {
          for (let i = 0; i < obj.length; i++) {
            let item = obj[i];
            if (item.indexOf(",") > -1) {
              var objSub = item.split(",");
              if (objSub.length > 0) {
                for (let i = 0; i < objSub.length; i++) {
                  let itemSub = objSub[i];
                  if (itemSub)
                    certificateIds.push(itemSub.trim());
                }
              }
              else {
                if (item)
                  certificateIds.push(item.trim());
              }
            }
            else {
              if (item)
                certificateIds.push(item.trim());
            }
          }
        }
      }
      else
        certificateIds.push(certificateId.trim());
    }
    else
      certificateIds.push(certificateId.trim());

    certificateIds = certificateIds.map(x => x.replace("/t", "").trim());
    return certificateIds;
  }

  public generateStoneIds(item: string, stoneIds: string[]) {
    if (item?.length !== undefined && item?.length !== null && item?.length > 0) {
      let stone: any = item ? item.trim() : null;
      if (stone.match(/\d+/)) {
        let thenum: string = stone.match(/\d+/)[0];
        let arryStoneName = item.split(thenum)
        arryStoneName[1] = thenum + arryStoneName[1]
        let str = arryStoneName.join('-')
        stoneIds.push(str.trim());
      }

    }
  }

  public ApplyStringFilter(a: string, z: string): boolean {
    let filter = true;
    if ((a == null || a == undefined || a?.length == 0) && (z == null || z == undefined || z?.length == 0))
      filter = true;
    else
      if (a == null || a == undefined || a?.length == 0)
        filter = false;
      else
        if ((a && a.length > 0) && (z && z.length > 0)) {
          let array: string[] = [];
          array = this.CheckStoneIds(z);

          if (array.length > 0)
            filter = array.map(b => b.toLowerCase()).includes(a.toLowerCase());
          else
            filter = z.toLowerCase() == a.toLowerCase();
        }
    return filter;
  }

  public setAmtForPricingResponse(target: MfgPricingResponse, weight: number): MfgPricingResponse {
    if (target && target != null && target.rap != null && target.rap != 0) {
      let rap = target.rap;
      let disc = target.discount;
      if (rap && disc) {
        rap = parseFloat(rap.toString());
        disc = parseFloat(disc.toString());

        let stoneRap = weight * rap;
        let calDiscount = 100 + disc;
        let netAmount = (calDiscount * stoneRap) / 100;

        target.oAmount = this.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        target.dcaret = this.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }
    return target;
  }

  public setAmtForPricingDiscountResponse(target: PricingDiscountApiResponse, weight: number): PricingDiscountApiResponse {
    if (target && target != null && target.RapPrice != null && target.RapPrice != 0) {
      let rap = target.RapPrice;
      let disc = target.Discount;
      if (rap && disc) {
        rap = parseFloat(rap.toString());
        disc = parseFloat(disc.toString());

        let stoneRap = weight * rap;
        let calDiscount = 100 + disc;
        let netAmount = (calDiscount * stoneRap) / 100;

        target.Amount = this.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        target.DCaret = this.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }
    return target;
  }

  public setAmtForPricingMarketSheetDiscountResponse(target: PricingMarketSheetResponse, weight: number): PricingMarketSheetResponse {
    if (target && target != null && target.RapPrice != null && target.RapPrice != 0) {
      let rap = target.RapPrice;
      let disc = target.Discount;
      if (rap && disc) {
        rap = parseFloat(rap.toString());
        disc = parseFloat(disc.toString());

        let stoneRap = weight * rap;
        let calDiscount = 100 + disc;
        let netAmount = (calDiscount * stoneRap) / 100;

        target.Amount = this.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        target.DCaret = this.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }
    return target;
  }

  public replaceSymbols(string: string): string {
    string = string.replace(/[^a-zA-Z ]/g, "");
    string = string.replace(/ /g, "_");

    return string;
  }

  public exportFileName(fileName: string): string {
    var today = new Date();
    var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "_";
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    var name = fileName + '_' + date + time;
    return name;
  }

  //#region Export to Excel
  public base64ToArrayBuffer(base64: string) {
    let binaryString = window.atob(base64);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      let ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  public exportAsExcelFile(newArray: any, fileName: string) {
    let flag: boolean = false;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    const workbook: XLSX.WorkBook = { Sheets: { "data": worksheet }, SheetNames: ["data"] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    flag = this.saveAsExcelFile(excelBuffer, fileName);
    return flag;
  }

  public exportAsCsvFile(newArray: any, fileName: string) {
    let flag: boolean = false;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    const workbook: XLSX.WorkBook = { Sheets: { "data": worksheet }, SheetNames: ["data"] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: "csv", type: "array" });
    flag = this.saveAsExcelFile(excelBuffer, fileName, '.csv');
    return flag;
  }

  public saveAsExcelFile(buffer: any, fileName: string, ext: string = ".xlsx") {
    const data: Blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    var name = this.exportFileName(fileName);
    FileSaver.saveAs(data, name + ext);
    return true;
  }

  public exportAsExcelFileBase64(newArray: any) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    const workbook: XLSX.WorkBook = { Sheets: { "data": worksheet }, SheetNames: ["data"] };
    return XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
    // const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
    // let blob = new Blob([excelBuffer], {
    //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // });
    // return this.blobToBase64(blob);
  }

  public blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  //#endregion      Export to Excel

  //#region MultiSelect DDL
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

  public onOpenDropdown(list: Array<{ name: string; isChecked: boolean }>, e: boolean, selectedData: string[]): boolean {
    if (selectedData?.length == list.map(z => z.name).length)
      e = true;
    else
      e = false;
    return e;
  }

  public handleFilter(e: any): string {
    return e;
  }

  public filterDropdownSearch(allData: MasterDNorm[], e: any, selectedData: string[]): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    allData.forEach(z => { filterData.push({ name: z.name, isChecked: false }); });
    filterData.forEach(z => {
      if (selectedData?.includes(z.name))
        z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter(z => z.name?.toLowerCase().includes(e?.toLowerCase()));
    else
      return filterData;
  }

  public filterDropdownSearchDefault(allData: string[], e: any, selectedData: string[]): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    allData.forEach(z => { filterData.push({ name: z, isChecked: false }); });
    filterData.forEach(z => {
      if (selectedData?.includes(z.name))
        z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter(z => z.name?.toLowerCase().includes(e?.toLowerCase()));
    else
      return filterData;
  }

  public checkAllListItems(list: Array<{ name: string; isChecked: boolean }>, e: boolean, selectedData: string[]): string[] {
    if (e) {
      selectedData = [];
      selectedData = list.map(z => z.name);
      list.forEach(element => {
        element.isChecked = true;
      });
    }
    else {
      selectedData = [];
      list.forEach(element => {
        element.isChecked = false;
      });
    }
    return selectedData;
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
  //#endregion MultiSelect DDL

  //#region Filters
  public SetWeightRange(target: string): WeightRange[] {
    let range: WeightRange[] = [];
    if (target != null) {
      if (target.includes(",")) {
        var obj = target.split(",");
        if (obj.length > 0) {
          for (let i = 0; i < obj.length; i++) {
            let item = obj[i];
            let val: WeightRange = new WeightRange();
            if (item.includes("-")) {
              var arr = item.split("-");
              val.minWeight = this.ConvertToFloatWithTwoDecimal(parseFloat(arr[0]));
              val.maxWeight = this.ConvertToFloatWithTwoDecimal(parseFloat(arr[1]));
              range.push(val);
            }
          }
        }
      }
      else {
        if (target.includes("-")) {
          let val: WeightRange = new WeightRange()
          var arr = target.split("-");
          val.minWeight = this.ConvertToFloatWithTwoDecimal(parseFloat(arr[0]));
          val.maxWeight = this.ConvertToFloatWithTwoDecimal(parseFloat(arr[1]));
          range.push(val);
        }
      }
    }
    return range;
  }

  public filterArrayString(target: string, filter: string[], isOptional: boolean = false): boolean {
    if (filter == null || filter.length == 0)
      return true;
    else if (filter != null && filter.length > 0 && (target == null || target.length == 0))
      return isOptional;
    else
      return filter.map(u => u?.toLowerCase()).includes(target.toLowerCase());
  }

  public filterFromToDecimalValues(target: number | null, filterFrom: number | null | undefined, filterTo: number | null | undefined): boolean {
    if ((filterFrom == null || filterFrom == undefined || filterFrom == 0) && (filterTo == null || filterTo == undefined || filterTo == 0))
      return true;
    else if ((filterFrom != null && filterFrom != undefined && filterFrom > 0) && (filterTo != null && filterTo != undefined && filterTo > 0) && (target == null))
      return false;
    else
      return ((filterFrom ?? 0) <= (target ?? 0) && (filterTo ?? 0) >= (target ?? 0));
  }

  public filterFromToNegativeDecimalValues(target: number | null, filterFrom: number | null | undefined, filterTo: number | null | undefined): boolean {
    if ((filterFrom == null || filterFrom == undefined) && (filterTo == null || filterTo == undefined))
      return true;
    else if ((filterFrom != null && filterFrom != undefined) && (filterTo != null && filterTo != undefined) && (target == null))
      return false;
    else
      return ((filterFrom ?? 0) <= (target ?? 0) && (filterTo ?? 0) >= (target ?? 0));
  }

  public filterFromToDateValues(target: Date | null, filterFrom: Date | null | undefined, filterTo: Date | null | undefined): boolean {
    if (filterFrom == null || filterTo == null || filterFrom == undefined || filterTo == undefined)
      return true;
    else if ((filterFrom != null && filterTo != null && filterFrom != undefined && filterTo != undefined) && target == null)
      return false;
    else
      return (filterFrom?.getDate <= (target?.getDate ?? new Date()) && filterTo?.getDate >= (target?.getDate ?? new Date()));
  }

  public filterCommonString(target: string, filter: string | undefined): boolean {
    if (filter == null || filter == undefined)
      return true;
    else if ((!filter) && (target))
      return false;
    else
      return (target.toLowerCase() == filter?.toLowerCase());
  }

  public filterCommonBoolen(target: boolean | null, filter: boolean | null | undefined): boolean {
    if (filter == null || filter == undefined)
      return true;
    else if (filter != null && filter != undefined && target == null)
      return false;
    else
      return (target == filter);
  }
  //#endregion

  async getIPAddress(): Promise<any> {
    return await this.http.get("http://api.ipify.org/?format=json")
      .toPromise() as any;
  }

  public addressDtlNullNConcat(address: Address): string {
    var result: string = "";
    result += address.line1 ? address.line1 + ', ' : '';
    result += address.line2 ? address.line2 + ', ' : '';
    result += address.city ? address.city + ', ' : '';
    result += address.state ? address.state + ', ' : '';
    result += address.country ? address.country + ', ' : '';
    result += address.zipCode ? address.zipCode + '' : '';
    return result.toString();
  }
  
}
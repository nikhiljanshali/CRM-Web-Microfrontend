import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InvDetailData } from '../../../../businessobjects';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { CartService, CustomerService, CustomerInvSearchService, WatchlistService } from '../../../../services';
import { Cart, Customer, CustomerDNorm, WatchList } from '../../../../entities';
import { NgxSpinnerService } from 'ngx-spinner';
import { fxCredential } from 'shared/enitites';

@Component({
  selector: 'app-diamondcompare',
  templateUrl: './diamondcompare.component.html',
  styles: [
  ]
})
export class DiamondCompareComponent implements OnInit {
  @Input() stoneIds: string[] = [];
  @Input() diamondCompareFlag: boolean = false;
  @Output() closeDialog = new EventEmitter();

  public compareInvItemsData: InvDetailData[] = [];
  selectedInvItems: InvDetailData[] = [];
  public fxCredentials?: fxCredential;
  public customer: CustomerDNorm = new CustomerDNorm();

  //#region Custom Models
  public totalCount = '0';
  public totalWeight = '0.00';
  public totalNetAmount = '0.00';
  public avgDiscount = '0.00';
  public avgPerCarat = '0.00';
  public rNetAmount = '0.00';
  //#endregion

  constructor(public sanitizer: DomSanitizer,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    private alertdialogService: AlertdialogService,
    private customerService: CustomerService,
    private inventoryService: CustomerInvSearchService,
    private cartService: CartService,
    private watchlistService: WatchlistService) { }

  public async ngOnInit() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    this.spinnerService.show();
    await this.getCustomer();
    await this.getInvDetailData();
  }

  public async getInvDetailData() {
    try {
      if (this.stoneIds.length > 0) {
        var res = await this.inventoryService.getInvDetailByStoneIdsAsync(this.stoneIds);
        if (res)
          this.compareInvItemsData = res;
        else
          this.alertdialogService.show('Invetory not found, Try again later');
        this.calculateTotalAndAvg();
      }
      this.spinnerService.hide();
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertdialogService.show('Invetory not found, Try again later');
    }
  }

  public async getCustomer() {
    try {
      var res = await this.customerService.getCustomerDNormByIdAsync(this.fxCredentials?.id ?? '');
      if (res)
        this.customer = res;
      else
        this.alertdialogService.show('Customer not found, Try login again');
      console.log(this.customer)
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertdialogService.show('Customer not found, Try login again');
    }
  }

  public calculateTotalAndAvg() {
    if (this.compareInvItemsData.length > 0) {
      this.totalCount = this.compareInvItemsData.length.toString();
      this.totalWeight = this.utilityService.ConvertToFloatWithTwoDecimal(this.compareInvItemsData.map(z => z.weight).reduce((ty, u) => ty + u, 0)).toString();
      this.totalNetAmount = this.utilityService.ConvertToFloatWithTwoDecimal(this.compareInvItemsData.map(z => z.price.netAmount ?? 0).reduce((ty, u) => ty + u, 0)).toString();
      this.avgDiscount = this.utilityService.ConvertToFloatWithTwoDecimal(this.compareInvItemsData.reduce((a, u) => a + (u.price.discount ?? 0), 0) / this.compareInvItemsData.length).toString();
      this.avgPerCarat = this.utilityService.ConvertToFloatWithTwoDecimal(this.compareInvItemsData.reduce((a, u) => a + (u.price.perCarat ?? 0), 0) / this.compareInvItemsData.length).toString();
      this.rNetAmount = this.utilityService.ConvertToFloatWithTwoDecimal(this.compareInvItemsData.map(z => ((z.price.rap ?? 0) * z.weight)).reduce((ty, u) => ty + u, 0)).toString();
    } else {
      this.totalCount = '0';
      this.totalWeight = '0.00';
      this.totalNetAmount = '0.00';
      this.avgDiscount = '0.00';
      this.avgPerCarat = '0.00';
      this.rNetAmount = '0.00';
    }
  }

  public async addToWatchList(inv: InvDetailData) {
    try {
      this.spinnerService.show();
      var obj = this.mappingToWatchList(inv);
      var res = await this.watchlistService.insertWatchList(obj);
      if (res) {
        this.alertdialogService.show(res);
        this.spinnerService.hide();
      } else {
        this.spinnerService.hide();
        this.alertdialogService.show('Something went wrong, Try again later!');
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertdialogService.show('Something went wrong, Try again later!');
    }
  }

  private mappingToWatchList(inv: InvDetailData): WatchList {
    let obj = new WatchList();
    obj.invItemId = inv.invId;
    obj.invItemNumber = inv.stoneId;
    obj.oldDiscount = inv.price?.discount ?? 0;
    obj.customer = this.customer;
    obj.addedAt = new Date();
    return obj;
  }

  public async addToCart(item: InvDetailData) {
    this.alertdialogService.ConfirmYesNo("Are you sure you want to add to cart?", "Cart")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            this.spinnerService.show();
            let cart = new Cart();
            cart.customer = this.customer;
            cart.invId = item.invId;
            cart.stoneId = item.stoneId;
            cart.WebPlatform = "Online";

            // get seller details
            let customerDetail: Customer = await this.customerService.getCustomerById(this.customer.id);
            if (customerDetail && customerDetail.seller)
              cart.seller = customerDetail.seller;

            //call add to cart
            let id = await this.cartService.insertCartAsync(cart);
            if (id)
              this.alertdialogService.show(`Successfully added in Cart`);

            this.spinnerService.hide();
          } catch (error: any) {
            console.error(error);
            this.spinnerService.hide();
            if (error && error.error && error.error.includes('hold proccess'))
              this.alertdialogService.show(error.error);
            else
              this.alertdialogService.show('Something went wrong, Try again later!');
          }
        }
      });
  }

  public selectStone(i: number, e: any) {
    if (e.target.checked)
      this.selectedInvItems.push(JSON.parse(JSON.stringify(this.compareInvItemsData[i])))
    else {
      let index = this.selectedInvItems.findIndex(z => z.stoneId == this.compareInvItemsData[i].stoneId);
      if (index != -1)
        this.selectedInvItems.splice(index, 1);
    }
  }

  public removeItems(type: string) {
    if (type == 'all') {
      this.compareInvItemsData = [];
    }
    else {
      this.selectedInvItems.forEach(z => {
        let index = this.compareInvItemsData.findIndex(a => a.stoneId == z.stoneId);
        if (index != -1)
          this.compareInvItemsData.splice(index, 1);
      });
    }
    this.calculateTotalAndAvg();
  }

  closeMediaDialog() {
    this.closeDialog.emit(false);
  }

  public closeDiamondCompareSidebar() {
    this.closeDialog.emit(false);
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

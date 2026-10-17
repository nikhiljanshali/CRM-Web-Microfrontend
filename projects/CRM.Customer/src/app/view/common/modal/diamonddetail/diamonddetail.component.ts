import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService, CustomerService, CustomerInvSearchService, WatchlistService } from '../../../../services';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { InvDetailData } from '../../../../businessobjects';
import { fxCredential } from 'shared/enitites';
import { Cart, Customer, CustomerDNorm, WatchList } from '../../../../entities';

@Component({
  selector: 'app-diamonddetail',
  templateUrl: './diamonddetail.component.html',
  styles: [
  ]
})
export class DiamondDetailComponent implements OnInit {
  @Input() stoneId: string = '';
  @Input() diamonddetailFlag: boolean = false;
  @Output() closeDialog = new EventEmitter();

  public invItemObj: InvDetailData = new InvDetailData();
  public fxCredentials?: fxCredential;
  public customer: CustomerDNorm = new CustomerDNorm();

  public isCheckout = false;
  public pageFrom: string = "DiamondDetail";

  public invIds: string[] = [];
  public totalAmount: number = 0;

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
      if (this.stoneId.length > 0) {
        var res = await this.inventoryService.getInvDetailByStoneIdAsync(this.stoneId);
        if (res)
          this.invItemObj = res;
        else
          this.alertdialogService.show('Invetory not found, Try again later');
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
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertdialogService.show('Customer not found, Try login again');
    }
  }

  public async addToWatchList() {
    try {
      this.spinnerService.show();
      var obj = this.mappingToWatchList(this.invItemObj);
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

  public async addToCart() {
    this.alertdialogService.ConfirmYesNo("Are you sure you want to add to cart?", "Cart")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            this.spinnerService.show();
            let cart = new Cart();
            cart.customer = this.customer;
            cart.invId = this.invItemObj.invId;
            cart.stoneId = this.invItemObj.stoneId;
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

  public openCheckoutDialog(): void {
    this.totalAmount = (this.invItemObj.price.netAmount ?? 0);
    this.invIds = [];
    this.invIds.push(this.invItemObj.invId)
    this.isCheckout = true;
  }

  public async parentMethodCall() {
    this.isCheckout = false;
  }

  closeMediaDialog() {
    this.closeDialog.emit(false);
  }

  public closeDiamonddetailSidebar() {
    this.closeDialog.emit(false);
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

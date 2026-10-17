import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styles: [
  ]
})
export class TransactionsComponent implements OnInit {

  public isPurchase: boolean = false;
  public isSales: boolean = false;
  public isReceiptDialog = false;
  public isPaymentDialog = false;

  constructor() { }

  ngOnInit(): void {
  }

  public openPurchaseDialog(): void {
    this.isPurchase = true;
  }

  public openSalesDialog(): void {
    this.isSales = true;
  }

  // Receipt
  public openReceiptDialog(): void {
    this.isReceiptDialog = true;
  }

  public closeReceiptDialog(): void {
    this.isReceiptDialog = false;
  }

  // Payment
  public openPaymentDialog(): void {
    this.isPaymentDialog = true;
  }

  public closePaymentDialog(): void {
    this.isPaymentDialog = false;
  }

}

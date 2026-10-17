import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void { 
  }

  public closPurchaseDialog(): void {
    this.toggle.emit(false);
  }

}

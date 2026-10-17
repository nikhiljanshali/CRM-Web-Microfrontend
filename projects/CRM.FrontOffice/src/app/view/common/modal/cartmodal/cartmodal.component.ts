import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridPropertiesService } from '../../../../services';
import { GridDetailConfig } from 'shared/businessobjects';
import { LeadCartItem } from '../../../../businessobjects';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { DataResult, process } from '@progress/kendo-data-query';
import { InvItem } from '../../../../entities';

@Component({
  selector: 'app-cartmodal',
  templateUrl: './cartmodal.component.html',
  styleUrls: ['./cartmodal.component.css']
})
export class CartmodalComponent implements OnInit {

  @Input() public leadCartItem: LeadCartItem = new LeadCartItem();
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  public fields!: GridDetailConfig[];
  public gridViewCartInventory!: DataResult;
  public pageSize = 15;
  public skip = 0;
  public listCartInventoryItems: InvItem[] = [];
  public gridCartInventoryData: InvItem[] = [];

  constructor(
    private gridPropertiesService: GridPropertiesService,
    private spinnerService: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    this.loadDefaultMethods();
  }

  public async loadDefaultMethods() {
    await this.getGridConfig();
    await this.loadCartAllInv();
  }

  public async getGridConfig() {
    this.fields = await this.gridPropertiesService.getLeadInventoryItems();
    this.fields = this.fields.filter(x => x.title.toLowerCase() !== "checkbox" && x.title.toLowerCase() !== "rejected");
  }

  public async loadCartAllInv() {
    this.listCartInventoryItems = this.leadCartItem.invItems;
    this.loadCartPaging();
  }

  public async loadCartPaging() {
    if (this.listCartInventoryItems.length > 0) {
      for (let i = this.skip; i < this.pageSize + this.skip; i++) {
        const element = this.listCartInventoryItems[i];
        if (element)
          this.gridCartInventoryData.push(element);
      }
      this.loadCartInventoryGrid(this.listCartInventoryItems);
    }
  }

  public async loadCartInventoryGrid(inventoryItems: InvItem[]) {
    if (inventoryItems.length > 0) {
      this.gridViewCartInventory = process(this.gridCartInventoryData, {});
      this.gridViewCartInventory.total = inventoryItems.length;
    }
    this.spinnerService.hide();
  }

  public pageChange(event: PageChangeEvent): void {
    this.spinnerService.show();
    this.gridCartInventoryData = [];
    this.skip = event.skip;
    this.loadCartPaging();
  }

  toggleCartDialog() {
    this.toggle.emit(false);
  }

}

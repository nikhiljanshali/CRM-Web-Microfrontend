import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'shared/businessobjects';
import { fxCredential, GridConfig } from 'shared/enitites';
import { AppPreloadService, ConfigService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';

@Component({
  selector: 'app-gridconfiguration',
  templateUrl: './gridconfiguration.component.html',
  styleUrls: ['./gridconfiguration.component.css']
})
export class GridconfigurationComponent implements OnInit {

  @Input() fields: GridDetailConfig[] = [];
  @Input() gridConfigId?: string;
  @Input() pageName!: string;
  @Input() gridName!: string;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @Output() ChildEvent = new EventEmitter();
  private fxCredential!: fxCredential;

  constructor(public utilityService: UtilityService,
    private appPreloadService: AppPreloadService,
    private configService: ConfigService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private router: Router) { }

  async ngOnInit() {
    this.spinnerService.show();
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);

    if (this.fields && this.fields.length > 0) {
      this.fields = JSON.parse(JSON.stringify(this.fields));
    }
    this.spinnerService.hide();
  }

  public async saveGridConfiguration() {
    try {
      this.spinnerService.show();
      let gridConfigItem = new GridConfig();
      if (this.gridConfigId)
        gridConfigItem.id = this.gridConfigId;

      gridConfigItem.empID = this.fxCredential.id;
      gridConfigItem.pageName = this.pageName;
      gridConfigItem.gridName = this.gridName;
      this.fields.forEach((item, i) => {
        item.sortOrder = i + 1;
      });
      gridConfigItem.gridDetail = this.fields;
      let flag: any;
      if (this.gridConfigId) {
        flag = await this.configService.updateGridConfig(gridConfigItem);
        this.utilityService.showNotification(`You have been updated Grid-configuration successfully!`)
      }
      else {
        flag = await this.configService.insertGridConfig(gridConfigItem);
        gridConfigItem.id = flag;
        this.utilityService.showNotification(`You have been added Grid-configuration successfully!`)
      }

      if (flag) {
        let collection = JSON.parse(sessionStorage.getItem("GridConfig") || '[]') as GridConfig[];
        if (collection && collection.length > 0) {
          let index = collection.findIndex(c => c.empID == this.fxCredential.id && c.pageName.toLowerCase() == this.pageName.toLowerCase() && c.gridName.toLowerCase() == this.gridName.toLowerCase());
          if (index >= 0)
            collection[index] = gridConfigItem;
          else
            collection.push(gridConfigItem);
          sessionStorage.setItem("GridConfig", JSON.stringify(collection));
        }
        else {
          collection.push(gridConfigItem);
          sessionStorage.setItem("GridConfig", JSON.stringify(collection));
        }
        this.parentMethodCall(gridConfigItem);
        this.closeGridConfigDialog();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
      this.spinnerService.hide();
    }
  }

  private parentMethodCall(gridConfigItem: GridConfig): void {
    this.ChildEvent.emit(gridConfigItem);
  }

  public closeGridConfigDialog(): void {
    this.toggle.emit(false);
  }
}
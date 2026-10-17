import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { Employee, GridDetailConfig, NotificationResponse, NotificationSearchCriteria } from 'common/businessobjects';
import { fxCredential, Notifications } from 'common/entities';
import { CommonService, UtilityService, AppPreloadService, NotificationService, GridPropertiesService, EmployeeService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  private fxCredentials!: fxCredential;
  public notifications!: NotificationResponse;
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public notificationCriteria = new NotificationSearchCriteria();
  public filterFlag = true;
  public notificationObj = new Notifications();
  public notificationActionMStoneFlag: boolean = false;


  constructor(private router: Router,
    public utilityService: UtilityService,
    public notificationService: NotificationService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private appPreloadService: AppPreloadService,
    private gridPropertiesService: GridPropertiesService,
    private empService: EmployeeService) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    try {
      this.fxCredentials = await this.appPreloadService.fetchFxCredentials();
      if (!this.fxCredentials)
        this.router.navigate(["login"]);

      this.fields = await this.gridPropertiesService.getNotificationGrid();

      await this.loadNotifications();

      this.utilityService.filterToggleSubject.subscribe(flag => {
        this.filterFlag = flag;
      });

    } catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }

  }

  public async loadNotifications() {
    try {

      this.spinnerService.show();
      this.notificationCriteria.ident = this.fxCredentials.id;
      this.notificationCriteria.isReceived = true;
      this.notificationCriteria.isSent = true;

      this.notifications = await this.notificationService.getNotifications(this.notificationCriteria, this.skip, this.pageSize);
      let data: any = this.notifications.notifications;
      for (let i = 0; i < data.length; i++) {
        data[i].senderName = await this.employeeName(data[i].senderId);
        data[i].receiverName = await this.employeeName(data[i].receiverId);
      }
      this.gridView = process(data, { group: this.groups });
      this.gridView.total = this.notifications.totalCount;
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadNotifications();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadNotifications();
  }

  public selectedRowChange(e: any) {
    this.notificationObj = e.selectedRows[0].dataItem
  }

  public deleteNotificationReasonDialog() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            if (this.notificationObj.id) {
              let responseDelete: any = await this.notificationService.deleteMessage(this.notificationObj.id);
              if (responseDelete !== undefined && responseDelete !== null) {
                this.loadNotifications();
                this.utilityService.showNotification(`You have been deleted notification successfully!`)
              }
            }
            this.spinnerService.hide();

          }

        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public dblClickNotification() {
    if (this.notificationObj.action.toLowerCase() == "manualissuemodal")
      this.notificationActionMStoneFlag = !this.notificationActionMStoneFlag;
  }

  public async employeeName(dataItem: any) {
    try {
      if (dataItem == this.fxCredentials.id)
        return this.fxCredentials.fullName;
      else {
        let emp: Employee = await this.empService.getEmployeeById(dataItem);
        if (emp && emp.fullName)
          return emp.fullName;
        else
          return dataItem;
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

}

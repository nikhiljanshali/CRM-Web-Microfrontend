import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { LedgerService } from '../../../services';
import { Ledger } from '../../../entities';

@Component({
  selector: 'app-ledgerdetails',
  templateUrl: './ledgerdetails.component.html',
  styleUrls: ['./ledgerdetails.component.css']
})
export class LedgerdetailsComponent implements OnInit {


  public ledgerId!: string;
  public ledgerData: Ledger = new Ledger();
  public isBrokerDtl: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private ledgerService: LedgerService,
    public utilityService: UtilityService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService
  ) { }

  async ngOnInit() {
    await this.defaultMethods()
  }

  public async defaultMethods() {
    this.spinnerService.show();
    await this.loadLedgerDetail();
  }

  public async loadLedgerDetail() {
    try {
      this.ledgerId = this.route.snapshot.params.id
      this.ledgerData = await this.ledgerService.getLedgerById(this.ledgerId);
      this.spinnerService.hide();
      if (this.ledgerData.broker.brokrage != null && this.ledgerData.broker.brokrage != undefined && this.ledgerData.broker.brokrage != 0)
        this.isBrokerDtl = true;
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Party } from 'common/businessobjects';
import { CommonService, PartyService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-partydetails',
  templateUrl: './partydetails.component.html',
  styleUrls: ['./partydetails.component.css']
})
export class PartydetailsComponent implements OnInit {

  public partyId!: string;
  public partyData: Party = new Party();

  constructor(public router: Router,
    public route: ActivatedRoute,
    private partyService: PartyService,
    private commonService: CommonService,
    public utilityService: UtilityService,    
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService) { }

  async ngOnInit() {
    await this.defaultMethods()
  }

  public async defaultMethods() {
    this.spinnerService.show();
    await this.loadOrganizationDetail();  
    this.spinnerService.hide();  
  }

  public async loadOrganizationDetail() {
    try {
      this.partyId = this.route.snapshot.params.id
      this.partyData = await this.partyService.getPartyById(this.partyId)
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InclusionConfig, InventoryItems, MasterDNorm, MeasurementConfig } from 'common/entities';
import { MasterConfigService } from 'common/services';
@Component({
  selector: 'app-searchdetail',
  templateUrl: './searchdetail.component.html'
})
export class SearchdetailComponent implements OnInit {

  @Input() invItemsSearchResult: InventoryItems = new InventoryItems();
  
  public inclusionData: MasterDNorm[] = [];
  public measurementData: MasterDNorm[] = [];
  public inclusionConfig: InclusionConfig = new InclusionConfig();
  public measurementConfig: MeasurementConfig = new MeasurementConfig();

  constructor(public sanitizer: DomSanitizer,
    private masterConfigService: MasterConfigService) { }

  async ngOnInit() {
    await this.getMasterConfigData();
  }

  public async getMasterConfigData() {
    //Master Config
    let masterConfigList = await this.masterConfigService.getAllMasterConfig();
    
    this.inclusionData = masterConfigList.inclusions;
    this.measurementData = masterConfigList.measurements;

    this.inclusionConfig = masterConfigList.inclusionConfig;
    this.measurementConfig = masterConfigList.measurementConfig;
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
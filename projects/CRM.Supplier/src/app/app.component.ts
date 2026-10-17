import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { keys } from 'common/auth/keys';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public title: string = 'CRMSupplier';

  constructor(private http: HttpClient) {
  }

  async ngOnInit() {
    let obj = await this.http.get('commonAssets/variable/variable.json').toPromise() as any;
    if (obj && obj.apiSupplierUrl) {
      environment.apiBaseUrl = obj.apiBaseUrl;
      environment.apiIdentityUrl = obj.apiIdentityUrl;
      environment.apiFileUploadUrl = obj.apiFileUploadUrl;
      environment.apiSupplierUrl = obj.apiSupplierUrl;
      environment.apiPricingProjectUrl = obj.apiPricingProjectUrl;
      environment.apiPricingUrl = obj.apiPricingUrl;
      environment.apiBasePricingUrl = obj.apiBasePricingUrl;
      environment.apiMarketSheetPricingUrl = obj.apiMarketSheetPricingUrl;
      environment.apiMeasureGradeUrl = obj.apiMeasureGradeUrl;
      environment.invStoneCertiUrl = obj.invStoneCertiUrl;
      environment.invStoneImageUrl = obj.invStoneImageUrl;
      environment.notificationBaseUrl = obj.notificationBaseUrl;
      environment.notificationSocketUrl = obj.notificationSocketUrl;

      keys.apiUrl = environment.apiSupplierUrl;
    }
  }

}

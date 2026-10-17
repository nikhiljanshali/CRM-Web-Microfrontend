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
  public title: string = 'CRMAdmin';

  constructor(private http: HttpClient) {
  }

  async ngOnInit() {
    let obj = await this.http.get('commonAssets/variable/variable.json').toPromise() as any;
    if (obj && obj.apiBaseUrl) {
      environment.apiBaseUrl = obj.apiBaseUrl;
      environment.apiIdentityUrl = obj.apiIdentityUrl;
      environment.apiFileUploadUrl = obj.apiFileUploadUrl;
      environment.apiPricingUrl = obj.apiPricingUrl;
      environment.apiMeasureGradeUrl = obj.apiMeasureGradeUrl;
      environment.notificationBaseUrl = obj.notificationBaseUrl;
      environment.notificationSocketUrl = obj.notificationSocketUrl;

      keys.apiUrl = environment.apiBaseUrl;
    }
  }
}

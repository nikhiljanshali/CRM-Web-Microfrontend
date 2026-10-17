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
  public title: string = 'CRMSeller';

  constructor(private http: HttpClient) {
  }

  async ngOnInit() {
    let obj = await this.http.get('commonAssets/variable/variable.json').toPromise() as any;
    if (obj && obj.apiSellerUrl) {
      environment.apiIdentityUrl = obj.apiIdentityUrl;
      environment.apiFileUploadUrl = obj.apiFileUploadUrl;
      environment.apiSellerUrl = obj.apiSellerUrl;
      environment.notificationBaseUrl = obj.notificationBaseUrl;
      environment.notificationSocketUrl = obj.notificationSocketUrl;
      keys.apiUrl = environment.apiSellerUrl;
    }
  }

}

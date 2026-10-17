import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { keys } from 'shared/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CRM-BackOffice';

  constructor(private http: HttpClient) {
  }

  async ngOnInit() {
    let obj = await this.http.get('commonAssets/variable/variable.json').toPromise() as any;
    if (obj && obj.backOffliceBaseUrl) {
      environment.backOffliceBaseUrl = keys.apiUrl = obj.backOffliceBaseUrl;
      environment.apiIdentityUrl = obj.apiIdentityUrl;
      environment.apiFileUploadUrl = obj.apiFileUploadUrl;
      environment.apiMeasureGradeUrl = obj.apiMeasureGradeUrl;
      environment.notificationBaseUrl = obj.notificationBaseUrl;
      environment.notificationSocketUrl = obj.notificationSocketUrl;
    }
  }
}

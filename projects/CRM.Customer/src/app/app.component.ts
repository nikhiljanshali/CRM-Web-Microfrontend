import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { keys } from 'shared/auth/keys';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'CRMCustomer';

  constructor(private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        var title = this.getTitle(router.routerState, router.routerState.root)[0];
        titleService.setTitle(title);
      }
    });
  }

  async ngOnInit() {
    let obj = await this.http.get('commonAssets/variable/variable.json').toPromise() as any;
    if (obj && obj.frontOfficeBaseUrl) {
      environment.frontOfficeBaseUrl = keys.apiUrl = obj.frontOfficeBaseUrl;
      environment.apiIdentityUrl = obj.apiIdentityUrl;
      environment.apiFileUploadUrl = obj.apiFileUploadUrl;
      environment.apiMeasureGradeUrl = obj.apiMeasureGradeUrl;
      environment.notificationBaseUrl = obj.notificationBaseUrl;
      environment.notificationSocketUrl = obj.notificationSocketUrl;
    }
  }

  getTitle(state: any, parent: any): any {
    var data = [];

    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }

    return data;
  }

}

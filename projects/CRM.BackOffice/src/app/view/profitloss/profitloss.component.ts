import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profitloss',
  templateUrl: './profitloss.component.html',
  styles: [
  ]
})
export class ProfitlossComponent implements OnInit {

  public filterFlag = false;

  constructor() { }

  ngOnInit(): void {
  }

  public filterSidebar() {
    this.filterFlag = !this.filterFlag;
  }

}

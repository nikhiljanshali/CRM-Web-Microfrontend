import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  public closSalesDialog(): void {
    this.toggle.emit(false);
  }

}
import { Component, OnInit } from '@angular/core';
import { listOriginItems } from 'common/services';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  public originItems = listOriginItems;
  public selectedOrigin!: string;
  public pageComeFromPermission!: string
  public isPermission: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  // User Permission
  public rolePermissionDialog(role: string): void {
    this.selectedOrigin = role;
    this.pageComeFromPermission = "Origin";
    this.isPermission = true;
  }

}

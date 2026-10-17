import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem("fxCredentials"))
      this.router.navigate(["login"]);
  }

}

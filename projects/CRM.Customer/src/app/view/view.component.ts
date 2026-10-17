import { Component, OnInit } from '@angular/core';
import { SuggestionService } from 'shared/services';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styles: [
  ]
})
export class ViewComponent implements OnInit {

  public isSuggestion: boolean = false;

  constructor(
    private suggestionSharedService: SuggestionService
  ) { }

  ngOnInit(): void {
    this.suggestionSharedService.selectedSuggestion$.subscribe((res) => {
      this.isSuggestion = res;
    })
  }

}

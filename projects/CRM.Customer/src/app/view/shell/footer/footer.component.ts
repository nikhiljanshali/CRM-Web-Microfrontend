import { Component, OnInit } from '@angular/core';
import { SuggestionService } from 'shared/services';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  constructor(
    private suggestionSharedService: SuggestionService
  ) { }

  ngOnInit(): void {
  }

  public async showSuggestionDialog() {
    this.suggestionSharedService.setSuggestion(true);
  }

}

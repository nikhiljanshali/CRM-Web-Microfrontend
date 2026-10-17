import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styles: [
  ]
})
export class MediaComponent implements OnInit {
  @Input() mediaType: any;
  @Input() mediaSrc: any;

  @Output() closeDialog = new EventEmitter();
  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  closeMediaDialog() {
    this.closeDialog.emit(false);
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

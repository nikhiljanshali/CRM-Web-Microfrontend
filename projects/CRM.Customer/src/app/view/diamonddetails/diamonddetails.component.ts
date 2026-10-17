import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Splide from '@splidejs/splide';
declare var $: any;

@Component({
  selector: 'app-diamonddetails',
  templateUrl: './diamonddetails.component.html',
  styleUrls: ['./diamonddetails.component.css']
})
export class DiamonddetailsComponent implements OnInit {

  @Output() toggle: EventEmitter<boolean> = new EventEmitter();


  constructor() { }

  ngOnInit(): void {

    // Create and mount the thumbnails slider.
    let secondarySlider = new Splide('#secondary-slider', {
      rewind: true,
      isNavigation: true,
      arrows: false,
      focus: 'center',
      pagination: false,
      cover: false,
      breakpoints: {
        '600': {
          fixedWidth: 66,
          fixedHeight: 40,
        }
      }
    }).mount();

    // Create the main slider.
    let primarySlider = new Splide('#primary-slider', {
      type: 'fade',
      heightRatio: 0.5,
      pagination: false,
      arrows: false,
    });

    // Set the thumbnails slider as a sync target and then call mount.
    primarySlider.sync(secondarySlider).mount();

  }

  public closeDiamonddetailsDailog(): void {
    this.toggle.emit(false);
  }

}

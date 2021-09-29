import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-view-photo',
  templateUrl: './view-photo.component.html',
  styleUrls: ['./view-photo.component.css']
})
export class ViewPhotoComponent implements OnInit {
  public currentPhoto;
  constructor(public popoverController: PopoverController) {
    this.popoverController.getTop().then(data => {
      this.currentPhoto = data.componentProps.photo;
    });
  }
  ngOnInit(): void {
  }

}

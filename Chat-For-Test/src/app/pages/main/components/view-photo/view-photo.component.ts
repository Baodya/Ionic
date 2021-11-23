import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-view-photo',
  templateUrl: './view-photo.component.html',
  styleUrls: ['./view-photo.component.scss']
})
export class ViewPhotoComponent {
  public currentPhoto;

  constructor(public popoverController: PopoverController) {
    this.popoverController.getTop().then(data => {
      this.currentPhoto = data.componentProps.photo;
    });
  }
}

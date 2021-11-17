import {Injectable} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {SharedMapsComponent} from '../pages/main/components/shared-maps/shared-maps.component';
import {Coordinates} from './interface';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor( public popoverController: PopoverController) {}

  public async getCurrentlyLocation() {
      const popover = await this.popoverController.create({
        component: SharedMapsComponent,
        translucent: true,
      });
      await popover.present();

      return await popover.onDidDismiss().then(data => {
        switch (data.role) {
          case 'Send coordinates':
            return data;
          default:
            return ;
        }
      });
  }


  async showLocation(coordinates: Coordinates) {
    const popover = await this.popoverController.create({
      component: SharedMapsComponent,
      componentProps: coordinates,
      translucent: true,
    });
    await popover.present();

    return await popover.onDidDismiss().then(data => {
      switch (data.role) {
        case 'Send coordinates':
          return data;
        default:
          return ;
      }
    });
  }
}

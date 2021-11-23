import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';


declare let google;


@Component({
  selector: 'app-shared-maps',
  templateUrl: './shared-maps.component.html',
  styleUrls: ['./shared-maps.component.scss']
})
export class SharedMapsComponent implements OnInit {
  @ViewChild('map') divForMap: ElementRef;
  public map: any;
  public coordinates;
  public showButton = true;
  constructor(public popoverController: PopoverController) {}

  ngOnInit(): void {
    this.popoverController.getTop().then(data => {
      this.coordinates = data.componentProps;
      if (data.componentProps){
        this.showButton = false;
        this.loadMap(this.coordinates);
      }else{
        this.startTracing().then(() => {
          this.loadMap(this.coordinates);

        });
      }
    });
  }

  private async startTracing(): Promise<void> {
    await Geolocation.getCurrentPosition().then((position) => {
      this.coordinates = position.coords;
      this.loadMap(position.coords);
      if(position) {
        this.addNewLocation(
          position.coords.latitude,
          position.coords.longitude,
        );
      }

    });
  }

  private loadMap(coordinates?): void {
    let latLng;
    if (coordinates.lat) {
        latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    }else{
      latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
    }


    const mapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.divForMap.nativeElement, mapOptions);
  }

  private addNewLocation(lat, lng): void {
    const position = new google.maps.LatLng(lat, lng);
    this.map.setCenter(position);
    this.map.setZoom(5);
  }

  public deleteLocation(): void {
    this.popoverController.dismiss(false, 'delete coordinate');
  }

  public sendLocation(): void {
    this.popoverController.dismiss(this.coordinates, 'Send coordinates');
  }
}

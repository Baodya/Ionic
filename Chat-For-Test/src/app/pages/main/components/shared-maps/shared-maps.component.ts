import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {Geolocation} from '@capacitor/geolocation';


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
  constructor(public popoverController: PopoverController) {}

  ngOnInit(): void {
    this.popoverController.getTop().then(data => {
      const componentPropsCoordinates = data.componentProps;
      if (data.componentProps){
        this.loadMap(componentPropsCoordinates);
      }else{
        this.startTracing();
        this.loadMap();
      }
    });



  }

  private async startTracing(): Promise<void> {
    await Geolocation.getCurrentPosition().then((position) => {
      this.coordinates = position.coords;
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
    if (coordinates) {
        latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    }else{
      latLng = new google.maps.LatLng();
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

  private deleteLocation(): void {
    this.popoverController.dismiss(false, 'delete coordinate');
  }

  private sendLocation(): void {
    this.popoverController.dismiss(this.coordinates, 'Send coordinates');
  }
}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import {Observable} from 'rxjs';
import {Coordinates} from '../../../../services/chat.service';


declare let google;


@Component({
  selector: 'app-shared-maps',
  templateUrl: './shared-maps.component.html',
  styleUrls: ['./shared-maps.component.css']
})
export class SharedMapsComponent implements OnInit {
  public map: any;
  public locations: Observable<any>;
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

  private async startTracing() {
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

  private loadMap(coordinates?) {
    let latLng;
    if (coordinates) {
        latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    }else{
      latLng = new google.maps.LatLng(51.9036442, 7.6673267);
    }


    const mapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  private addNewLocation(lat, lng) {
    const position = new google.maps.LatLng(lat, lng);
    this.map.setCenter(position);
    this.map.setZoom(5);
  }

  private deleteLocation() {
    this.popoverController.dismiss(false, 'delete coordinate');
  }

  private sendLocation() {
    console.log(this.coordinates);
    this.popoverController.dismiss(this.coordinates, 'Send coordinates');
  }
}

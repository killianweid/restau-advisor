import {Injectable} from '@angular/core';
import {Marker} from "../models/marker.model";
import {Subject} from "rxjs";
import restaurantsJson from 'src/assets/json/restaurants.json';
import {} from "googlemaps";
import {AgmMarker, MapsAPILoader, MarkerManager} from "@agm/core";
declare const google: any;

@Injectable()
export class MarkersService {

  markers: Marker[] = []; // mettre le type Marker de google maps
  markersSubject = new Subject<Marker[]>();

  constructor(public mapsAPILoader: MapsAPILoader) {
    this.mapsAPILoader.load().then(() => {
      this.getMarkers();
    });
  }

  emitMarkers() {
    this.markersSubject.next(this.markers);
  }

  getMarkers() {
      const restaurants = restaurantsJson;
      for (let i = 0; i < restaurants.length; i++) {
        /*const latLng = new google.maps.LatLng(restaurants[i].lat, restaurants[i].long);
        const test45 = new google.maps.Marker({
          position: latLng,
          title: restaurants[i].restaurantName
        });*/
        this.markers[i] = {
          lat: restaurants[i].lat,
          lng: restaurants[i].long,
          label: restaurants[i].restaurantName,
          draggable: false
        };
      }
      this.emitMarkers();
  }
}

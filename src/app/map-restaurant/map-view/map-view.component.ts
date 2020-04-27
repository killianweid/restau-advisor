import {Component, OnDestroy, OnInit} from '@angular/core';
import {Marker} from "../../models/marker.model";
import {Restaurant} from "../../models/restaurant.model";
import {Subscription} from "rxjs";
import {MarkersService} from "../../services/markers.service";
import {} from "googlemaps";
declare const google: any;
import $ from 'jquery';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnDestroy {
  lat: number;
  lng: number;
  // google maps zoom level
  zoom: number = 17;
  markers: Marker[];
  markersSubscription: Subscription;

  constructor(private markersService: MarkersService) { }

  ngOnInit(): void {
    this.markersSubscription = this.markersService.markersSubject.subscribe(
      (markers: Marker[]) => {
        this.markers = markers;
      }
    );
    this.markersService.emitMarkers();
    if ("geolocation" in navigator) {
      /* la géolocalisation est disponible */
      console.log("Géolocalisation disponible !");
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    } else {
      alert("La géolocalisation n'est pas supporté par ce navigateur.");
    }
  }

  public onMapReady(map) {
    google.maps.event.addListener(map, 'idle', () => {
      this.showVisibleMarkers(map);
    })
  }

  public showVisibleMarkers(map) {
    const bounds = map.getBounds();
    let count = 0;
    for (let i = 0; i < this.markers.length; i++) {
      const marker = this.markers[i],
        nomRestaurant = marker.label; // array indexes start at zero, but not our class names :)
      const restaurant = $("#restaurant_"+i);
      const latlng = new google.maps.LatLng(marker.lat,marker.lng);
      if (bounds.contains(latlng) === true) {
        if(restaurant.hasClass("d-none")){
          restaurant.removeClass("d-none");
        }
        count++;
      } else {
        if(!restaurant.hasClass("d-none")){
          restaurant.addClass("d-none");
        }
      }
    }
    $("#nb_restaurants").text(count+" restaurants actuellement visible sur la carte");
  }

  ngOnDestroy() {
    this.markersSubscription.unsubscribe();
  }



}

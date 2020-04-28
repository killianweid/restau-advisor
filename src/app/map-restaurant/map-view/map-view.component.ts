import {Component, Input, OnInit} from '@angular/core';
import $ from "jquery";
import {Restaurant} from "../../models/restaurant.model";
import {} from "googlemaps";
declare const google: any;
import {GoogleMap} from "@agm/core/services/google-maps-types";
import {AgmInfoWindow} from "@agm/core";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  initialPositionLat: number;
  initialPositionLng: number;
  // google maps zoom level
  initialZoom: number = 17;

  infoWindowOpened: AgmInfoWindow = null;
  previousInfoWindow = null;

  coordsOnRightClick: any;
  creationRestauInPrgs: boolean=false;
  confirmationNewRestauIsShowed: boolean=false;

  lastRestaurantSelected:string = null;

  map: any;

  @Input() restaurants: Restaurant[];

  constructor() { }

  ngOnInit(): void {
    if ("geolocation" in navigator) {
      /* la géolocalisation est disponible */
      navigator.geolocation.getCurrentPosition((position) => {
        this.initialPositionLat = position.coords.latitude;
        this.initialPositionLng = position.coords.longitude;
      });
    } else {
      alert("La géolocalisation n'est pas supporté par ce navigateur.");
    }
  }

  public onMapReady(map): void {
    this.map = map;
    google.maps.event.addListener(this.map, 'idle', () => {
      this.showVisibleRestaurants(this.map);
    });
  }

  public showVisibleRestaurants(map): void {
    const bounds = map.getBounds();
    let count = 0;
    for (let i = 0; i < this.restaurants.length; i++) {
      const restaurant = this.restaurants[i];
      const elementRestaurantListe = $("#restaurant_"+restaurant.id);
      const latlng = new google.maps.LatLng(restaurant.lat,restaurant.long);
      if (bounds.contains(latlng) === true) {
        if(elementRestaurantListe.hasClass("d-none")){
          elementRestaurantListe.removeClass("d-none");
        }
        count++;
      } else {
        if(!elementRestaurantListe.hasClass("d-none")){
          elementRestaurantListe.addClass("d-none");
        }
      }
    }
    $("#nb_restaurants").text(count+" restaurants actuellement visible sur la carte");
  }

  public closeWindow(): void{
    if (this.previousInfoWindow != null ) {
      this.previousInfoWindow.close();
    }
  }

  public selectMarker(infoWindow:AgmInfoWindow): void{
    if (this.previousInfoWindow == null){
      this.previousInfoWindow = infoWindow;
    }else{
      this.infoWindowOpened = infoWindow
      this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infoWindow;
  }

  public showStreetView(restaurant: Restaurant): void {

    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: new google.maps.LatLng(restaurant.lat,restaurant.long),
        pov: {
          heading: 34,
          pitch: 10
        }
      });
    this.map.setStreetView(panorama);
    this.restaurants.map(restaurantListe => {
      if(restaurantListe === restaurant){
        restaurantListe.isSelected = !restaurantListe.isSelected;
      }else if(restaurantListe.isSelected){
        restaurantListe.isSelected = false;
      }
    })
  }

  public selectRestaurant(id:number): void {
    if(this.lastRestaurantSelected !== null) {
      $("#"+this.lastRestaurantSelected).removeClass("active").addClass("bg-light");
    }
    const restaurantItemList = $("#restaurant_"+id);
    this.lastRestaurantSelected = "restaurant_"+id;
    if(restaurantItemList.hasClass("bg-light")){
      restaurantItemList.removeClass("bg-light").addClass("active");
    }
  }

  public showOptions(event): void {
    //$("#confirmation_new_restau").removeClass("d-none");
    this.confirmationNewRestauIsShowed = !this.confirmationNewRestauIsShowed;
    this.coordsOnRightClick = event.coords;
  }

  public newRestaurant(event): void {
    this.creationRestauInPrgs = !this.creationRestauInPrgs;
  }

  newRestauClose(): void {
    this.confirmationNewRestauIsShowed = !this.confirmationNewRestauIsShowed;
    if(this.creationRestauInPrgs){
      this.creationRestauInPrgs = false;
    }
  }

}

import {Component, Input, OnInit} from '@angular/core';
import $ from "jquery";
import {Restaurant} from "../../models/restaurant.model";
import {GoogleMap} from "@agm/core/services/google-maps-types";
import {AgmInfoWindow} from "@agm/core";
import {RestaurantsService} from "../../services/restaurants.service";
import {Rating} from "../../models/rating.model";
import {MapService} from "../../services/map.service";

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

  map: google.maps.Map;
  markers: google.maps.Marker[]=[];

  @Input() restaurants: Restaurant[];

  constructor(private restaurantsService: RestaurantsService,
              private mapService: MapService) { }

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

  public onMapReady(map:google.maps.Map): void {
    this.map = map;
    this.mapService.initMapAndGooglePlacesRestaurants(this.map, this.restaurants);
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
    this.confirmationNewRestauIsShowed = true;
    this.creationRestauInPrgs = false;
    this.coordsOnRightClick = event.coords;
    if(this.markers.length !== 0) {
      this.markers.map(marker=>marker.setMap(null));
      this.markers = [];
      this.markers.length = 0;
    }
    const test = new google.maps.Marker({
      position: event.coords,
      map: this.map,
      label: "Nouveau restaurant"
    });
    this.markers.push(test);
  }

  public newRestaurant(): void {
    this.creationRestauInPrgs = true;
  }

  public newRestauClose(): void {
    this.confirmationNewRestauIsShowed = false;
    if(this.creationRestauInPrgs){
      this.creationRestauInPrgs = false;
    }
    this.markers[0].setMap(null);
    this.markers.pop();
  }

  // TODO  lorsqu'on entrera le nom du restaurant dans le formulaire il sera écrit au fur et à mesure dans le label de ce marker
  // le marker sera supprimé et on ajoutera le restaurant à sa place (nouveau marker)

}

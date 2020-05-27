import {Component, Input, OnInit} from '@angular/core';
import $ from "jquery";
import {Restaurant} from "../../models/restaurant.model";
import {GoogleMap} from "@agm/core/services/google-maps-types";
import {AgmInfoWindow} from "@agm/core";
import {RestaurantsService} from "../../services/restaurants.service";
import {Rating} from "../../models/rating.model";
import {MapService} from "../../services/map.service";
import {Router} from "@angular/router";

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
              private mapService: MapService,
              private router: Router) { }

  ngOnInit(): void {
    if(this.mapService.referencePosition === null) {
      this.router.navigate(['starter-position-choice']);
    }else{
      this.initialPositionLat = this.mapService.referencePosition.lat();
      this.initialPositionLng = this.mapService.referencePosition.lng();
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
        },
        enableCloseButton: true
      });
    this.map.setStreetView(panorama);
    const elementHTMLPano = $("#pano");
    if(!elementHTMLPano.hasClass("h-50")){
      elementHTMLPano.addClass("h-50");
    }
    if(elementHTMLPano.hasClass("d-none")){
      elementHTMLPano.removeClass("d-none");
    }
    $("#btn_close_street_view").removeClass("d-none");
    this.restaurants.map(restaurantListe => {
      if(restaurantListe === restaurant){
        restaurantListe.isSelected = true;
      }else if(restaurantListe.isSelected){
        restaurantListe.isSelected = false;
      }
    })
  }

  public onClickCloseStreetView(): void {
    this.map.getStreetView().setVisible(false);
    $("#btn_close_street_view").addClass("d-none");
    const elementHTMLPano = $("#pano");
    elementHTMLPano.removeClass("h-50").addClass("d-none");
    this.unselectRestaurant(this.lastRestaurantSelected);
    this.restaurants.map(restaurantListe => restaurantListe.isSelected = false);
    //TODO changer cette méthode bourrin
  }

  public unselectRestaurant(selector:string): void {
    const restaurantItemList = $("#"+selector);
    if(restaurantItemList.hasClass("bg-info")){
      restaurantItemList.removeClass("bg-info text-white").addClass("bg-light text-info");
    }
  }


  public selectRestaurant(id:string): void {
    if(this.lastRestaurantSelected !== null) {
      $("#"+this.lastRestaurantSelected).removeClass("bg-info text-white").addClass("bg-light");
    }
    const restaurantItemList = $("#restaurant_"+id);
    this.lastRestaurantSelected = "restaurant_"+id;
    if(restaurantItemList.hasClass("bg-light")){
      restaurantItemList.removeClass("bg-light text-info").addClass("bg-info text-white");
    }
    if(screen.width > 992) {
      window.location.hash ="#restaurant_"+id;
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

}

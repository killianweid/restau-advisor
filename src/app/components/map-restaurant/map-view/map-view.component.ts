import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import $ from "jquery";
import {Restaurant} from "../../../models/restaurant.model";
import {GoogleMap} from "@agm/core/services/google-maps-types";
import {AgmInfoWindow} from "@agm/core";
import {RestaurantsService} from "../../../services/restaurants.service";
import {Rating} from "../../../models/rating.model";
import {MapService} from "../../../services/map.service";
import {Router} from "@angular/router";
import {LoadingScreenService} from "../../../services/loading-screen.service";
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  //TODO afficher un input pour l'adresse au dessus de la map pour changer la position de reference

  public initialPositionLat: number;
  public initialPositionLng: number;

  // google maps zoom level
  public initialZoom: number = 18;

  private infoWindowOpened: AgmInfoWindow = null;
  private previousInfoWindow = null;

  public coordsOnRightClick: any;
  public creationRestauInPrgs: boolean=false;
  public confirmationNewRestauIsShowed: boolean=false;

  private map: google.maps.Map;
  public markers: google.maps.Marker[]=[];

  public loadingScreen: boolean;
  private loadingScreenSubscription: Subscription;

  @Input() public restaurants: Restaurant[];

  public streetViewShowed: boolean = false;

  constructor(private restaurantsService: RestaurantsService,
              private mapService: MapService,
              private router: Router,
              private loadingScreenService: LoadingScreenService) { }

  public ngOnInit(): void {
    /*this.loadingScreenSubscription = this.loadingScreenService.loadingStatus.subscribe(
      (loadingScreen: boolean) => this.loadingScreen = loadingScreen
    );
    this.loadingScreenService.emitLoading();*/
    if(this.mapService.referencePosition === null) {
      this.router.navigate(['starter-position-choice']);
    }else{
      $(".loading-screen-wrapper").css({
        "width":"97%",
        "height":"60%"
      });
      //this.loadingScreenService.startLoading();
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
    this.streetViewShowed = true;
    /* On cree la street view au bout de 1 milliseconde pour laisser le temps à Angular de creer l'element HTML pano */
    setTimeout(() => {
      const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"), {
          position: new google.maps.LatLng(restaurant.lat,restaurant.long),
          pov: {
            heading: 34,
            pitch: 10
          },
          enableCloseButton: true
        });
      this.map.setStreetView(panorama);
      },1);

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
    this.streetViewShowed = false;
    this.restaurantsService.unselectRestaurant(this.restaurantsService.lastRestaurantSelectedId);
    this.restaurants.map(restaurantListe => restaurantListe.isSelected = false);
    //TODO changer cette méthode bourrin
  }


  public selectRestaurant(id:string): void {
    this.restaurantsService.selectRestaurant(id);
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

  /*public onChargement(): void {
    if(this.loadingScreen){
      this.loadingScreenService.stopLoading();
    }else{
      this.loadingScreenService.startLoading();
    }

  }*/

  /*public ngOnDestroy(): void {
    this.loadingScreenSubscription.unsubscribe();
  }*/

}

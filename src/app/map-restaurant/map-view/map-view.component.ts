import {Component, Input, OnInit} from '@angular/core';
import $ from "jquery";
import {Restaurant} from "../../models/restaurant.model";
import {} from "googlemaps";
declare const google: any;
import {GoogleMap} from "@agm/core/services/google-maps-types";
import {AgmInfoWindow} from "@agm/core";
import {RestaurantsService} from "../../services/restaurants.service";
import {Rating} from "../../models/rating.model";

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
  markers: any[]=[];

  @Input() restaurants: Restaurant[];

  constructor(private restaurantsService: RestaurantsService) { }

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
      this.collectGooglePlacesRestaurants();
      this.showVisibleRestaurants();
    });
  }

  public collectGooglePlacesRestaurants(): void {
    // on supprime les restaurants qui ne sont pas visible
   if(this.restaurants.length > 1) {
      this.restaurants.map(restau => {
        // on ne supprime pas les restaurants du fichier json donc on ignore les id inférieur à 6
        if(restau.id > 6){
          const positionRestau = new google.maps.LatLng(restau.lat,restau.long);
          if(!(this.map.getBounds().contains(positionRestau))){
            const indexRestauToRemove = this.restaurants.indexOf(restau);
            if(indexRestauToRemove > -1) {
              this.restaurants.splice(indexRestauToRemove,1);
            }
          }
        }
      });
     this.restaurantsService.emitRestaurants();
    }

    //const actualPosition = new google.maps.LatLng(this.initialPositionLat, this.initialPositionLng);
    const request = {
      bounds: this.map.getBounds(),
      type: ['restaurant']
    };
    const service = new google.maps.places.PlacesService(this.map);

    service.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          // si le restaurant existe deja dans la liste des restaurants alors on ne l'ajoute pas
          if (!(this.restaurantsService.containsRestaurant(results[i].geometry.location.lat(), results[i].geometry.location.lng()))) {
            const newRestau = new Restaurant(this.restaurants[this.restaurants.length - 1].id + 1, results[i].name, results[i].geometry.location.lat(), results[i].geometry.location.lng());
            newRestau.averageRating = results[i].rating;
            newRestau.address = results[i].vicinity;
            /* Récupération des avis du restaurant actuel */
            const request2 = {
              placeId: results[i].place_id
            }
            service.getDetails(request2, (place, status) => {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                if (place.reviews !== undefined) {
                  const reviews: Rating[] = [];
                  place.reviews.map(review =>
                    reviews.push(new Rating(review.rating, review.text))
                  );
                  newRestau.ratings = reviews;
                }
                if (place.photo !== undefined) {
                  newRestau.icon = place.photos[0].getUrl({maxWidth: 150, maxHeight: 100});
                }
              }
            });
            this.restaurantsService.addNewRestaurant(newRestau);
          }
        }
      }
    });

  }

  public showVisibleRestaurants(): void {
    const bounds = this.map.getBounds();
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
    if(count > 1) {
      $("#nb_restaurants").text(count+" restaurants actuellement visible sur la carte");
    }else if (count === 1){
      $("#nb_restaurants").text(count+" restaurant actuellement visible sur la carte");
    }else if(count === 0){
      $("#nb_restaurants").text("Aucun restaurant actuellement visible sur la carte");
    }

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
      position:event.coords,
      map:this.map,
      label:"Nouveau restaurant"
    });
    this.markers.push(test);
  }

  public newRestaurant(event): void {
    this.creationRestauInPrgs = true;
  }

  newRestauClose(): void {
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

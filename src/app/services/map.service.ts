import { Injectable } from '@angular/core';
import {RestaurantsService} from "./restaurants.service";
import {Restaurant} from "../models/restaurant.model";
import {Rating} from "../models/rating.model";
import $ from "jquery";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: google.maps.Map;
  restaurants: Restaurant[];

  constructor(private restaurantsService: RestaurantsService) {
  }

  public initMapAndGooglePlacesRestaurants(map: google.maps.Map, restaurants: Restaurant[]) {
    this.map = map;
    this.restaurants = restaurants;
    google.maps.event.addListener(this.map, 'idle', () => {
      this.removeRestaurantsNotVisible();
      this.collectGooglePlacesRestaurants(this.showVisibleRestaurants);
    });
  }

  public removeRestaurantsNotVisible(): void {
    // si la taille de liste des restaurants n'est pas plus grande que 6 cela veut dire qu'il y a seulement les restaurants du fichier JSON
    if(this.restaurants.length > 6) {
      this.restaurants.map(restau => {
        // on ne supprime pas les restaurants du fichier json donc on ignore les id inférieur à 6
        if(restau.id > 6){
          const positionRestau = new google.maps.LatLng(restau.lat,restau.long);
          // si la position du restau actuel n'est pas visible dans la vue de la map on le supprime
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
  }

  public collectGooglePlacesRestaurants(callback): void {
    const request = {
      bounds: this.map.getBounds(),
      type: 'restaurant'
    };
    // récupération du service google places
    const service = new google.maps.places.PlacesService(this.map);
    // utilisation de la méthode nearbySearch qui permet de récupérer les places dans un périmètre spécifié
    service.nearbySearch(request, (results, status) => {
      // si la méthode renvoie des données
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        results.map(result => {
          if (!(this.restaurantsService.containsRestaurant(result.place_id))) {
            this.addGooglePlacesRestaurantToList(result, service);
          }
        });
      }
      callback();
    });
  }

  public addGooglePlacesRestaurantToList(googlePlacesRestaurant, placesService) {
    const newRestau = new Restaurant(this.restaurants[this.restaurants.length - 1].id + 1, googlePlacesRestaurant.name, googlePlacesRestaurant.geometry.location.lat(), googlePlacesRestaurant.geometry.location.lng());
    newRestau.averageRating = googlePlacesRestaurant.rating;
    newRestau.address = googlePlacesRestaurant.vicinity;
    newRestau.placeId = googlePlacesRestaurant.place_id;
    /* Récupération des avis du restaurant actuel */
    const request2 = {
      placeId: googlePlacesRestaurant.place_id
    }
    placesService.getDetails(request2, (place, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (place.reviews !== undefined) {
          const reviews: Rating[] = [];
          place.reviews.map(review =>
            reviews.push(new Rating(review.rating, review.text))
          );
          newRestau.ratings = reviews;
        }
        if (place.photos !== undefined) {
          newRestau.icon = place.photos[0].getUrl({maxWidth: 150, maxHeight: 100});
        }
      }
      console.log("Juste avant l'ajout du restaurant");
      this.restaurantsService.addNewRestaurant(newRestau);
    });
  }


  public showVisibleRestaurants(): void {
    console.log("Methode showVisibleRestaurants()");
    const bounds = this.map.getBounds();
    let count = 0;
    console.log(this.restaurants);
    this.restaurants.map(restaurant => {
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
    });
    if(count > 1) {
      $("#nb_restaurants").text(count+" restaurants actuellement visible sur la carte");
    }else if (count === 1){
      $("#nb_restaurants").text(count+" restaurant actuellement visible sur la carte");
    }else if(count === 0){
      $("#nb_restaurants").text("Aucun restaurant actuellement visible sur la carte");
    }

  }
}

import { Injectable } from '@angular/core';
import {RestaurantsService} from "./restaurants.service";
import {Restaurant} from "../models/restaurant.model";
import {Rating} from "../models/rating.model";
import $ from "jquery";
import {findIndexOfRestaurantByGooglePlaceId, findRestaurantById, strRandom} from '../utils';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: google.maps.Map;
  referencePosition: google.maps.LatLng = null;
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
        // on ne supprime pas les restaurants du fichier json donc on ignore les id de 1 à 6
        if(restau.id !== '1' && restau.id !== '2' && restau.id !== '3' && restau.id !== '4' && restau.id !== '5' && restau.id !== '6'){
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
      callback(this.restaurants, this.map.getBounds());
    });
  }

  public addGooglePlacesRestaurantToList(googlePlacesRestaurant, placesService) {
    const newRestau = new Restaurant( googlePlacesRestaurant.name, googlePlacesRestaurant.geometry.location.lat(), googlePlacesRestaurant.geometry.location.lng());
    newRestau.averageRating = googlePlacesRestaurant.rating;
    newRestau.address = googlePlacesRestaurant.vicinity;
    newRestau.placeId = googlePlacesRestaurant.place_id;
    let test = strRandom({
      includeUpperCase: false,
      includeNumbers: true,
      length: 20,
      startsWithLowerCase: true
    });
    while(findRestaurantById(this.restaurants, test) !== -1){
      test = strRandom({
        includeUpperCase: false,
        includeNumbers: true,
        length: 20,
        startsWithLowerCase: true
      });
    }
    newRestau.id = test;
    /* Récupération des avis du restaurant actuel */
    console.log("Restaurant: ",googlePlacesRestaurant);
    console.log("Place id : "+googlePlacesRestaurant.place_id);
    console.log("Icone : "+ googlePlacesRestaurant.icon);
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
        }else{
          console.log("Pas de photos pour : "+ place.name);
        }
        const index = findIndexOfRestaurantByGooglePlaceId(this.restaurants, place.id);
        if(index !== -1 ) {
          if(newRestau.ratings !== undefined) {
            this.restaurants[index].ratings = newRestau.ratings;
          }
          if(newRestau.icon !== undefined) {
            this.restaurants[index].icon = newRestau.icon;
          }
          this.restaurants[index].id = newRestau.id;
          this.restaurantsService.emitRestaurants();
        }
      }
      this.restaurantsService.addNewRestaurant(newRestau);
    });
  }


  public showVisibleRestaurants(restaurants: Restaurant[], bounds: google.maps.LatLngBounds): void {
    console.log("Methode showVisibleRestaurants()");
    let count = 0;
    restaurants.map(restaurant => {
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
    if(count > 1 && count < 10) {
      if($("#nb_restaurants").hasClass("bg-warning")){
        $("#nb_restaurants").removeClass("bg-warning").addClass("bg-success");
      }
      $("#nb_restaurants").html("<span class=\"bg-danger rounded-circle p-1 pl-2 pr-2 text-white\">"+count+"</span> restaurants correspondant à vos recherches sont actuellement visible sur la carte");
    } else if(count > 10) {
      if($("#nb_restaurants").hasClass("bg-warning")){
        $("#nb_restaurants").removeClass("bg-warning").addClass("bg-success");
      }
      $("#nb_restaurants").html("<span class=\"bg-danger rounded-circle pl-2 pr-2 pt-1 pb-1 text-white\">"+count+"</span> restaurants correspondant à vos recherches sont actuellement visible sur la carte");
    } else if (count === 1){
      if($("#nb_restaurants").hasClass("bg-warning")){
        $("#nb_restaurants").removeClass("bg-warning").addClass("bg-success");
      }
      $("#nb_restaurants").html("<span class=\"bg-danger rounded-circle pl-2 pr-2 pt-1 pb-1 text-white\">"+count+"</span> restaurant correspondant à vos recherches sont actuellement visible sur la carte");
    }else if(count === 0){
      if($("#nb_restaurants").hasClass("bg-success")){
        $("#nb_restaurants").removeClass("bg-success").addClass("bg-warning");
      }
      $("#nb_restaurants").html("<span class=\"bg-danger rounded p-1 text-white\">Aucun restaurant </span>correspondant à vos recherches sont actuellement visible sur la carte");
    }
  }
}

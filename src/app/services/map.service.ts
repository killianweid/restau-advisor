import {ElementRef, Injectable} from '@angular/core';
import {RestaurantsService} from "./restaurants.service";
import {Restaurant} from "../models/restaurant.model";
import {Rating} from "../models/rating.model";
import $ from "jquery";
import {findIndexOfRestaurantByGooglePlaceId, findRestaurantById, showTextNbRestaurants, strRandom} from '../utils';
import {LoadingScreenService} from "./loading-screen.service";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: google.maps.Map;
  public referencePosition: google.maps.LatLng = null;
  private restaurants: Restaurant[];

  constructor(private restaurantsService: RestaurantsService,
              private loadingScreenService: LoadingScreenService) {
  }

  public initMapAndGooglePlacesRestaurants(map: google.maps.Map, restaurants: Restaurant[]): void {
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
    service.nearbySearch(request, (results, status, pageToken) => {
      // si la méthode renvoie des données
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        //this.loadingScreenService.startLoading();
        for (let i = 0; i < results.length; i++) {
          if (!(this.restaurantsService.containsRestaurant(results[i].place_id))) {
            this.addGooglePlacesRestaurantToList(results[i], service);
            if(i === results.length-1 && !pageToken.hasNextPage){
              //this.loadingScreenService.stopLoading();
              //this.loadingScreenService.emitLoading();
            }
          }
        }
        /* s'il y a une autre page de resultats (soit plus de 20 resultats) */
        if (pageToken.hasNextPage) {
          pageToken.nextPage();
          service.nearbySearch(request, (secondResults, secondStatus, pageToken) => {
            if (secondStatus == google.maps.places.PlacesServiceStatus.OK) {
              for (let j = 0; j < secondResults.length; j++) {
                if (!(this.restaurantsService.containsRestaurant(secondResults[j].place_id))) {
                  this.addGooglePlacesRestaurantToList(secondResults[j], service);
                  if(j === secondResults.length-1){
                    //this.loadingScreenService.stopLoading();
                    //this.loadingScreenService.emitLoading();
                  }
                }
              }
            }
          })
        }
      }
      callback(this.restaurants, this.map.getBounds());
    });
  }

  public addGooglePlacesRestaurantToList(googlePlacesRestaurant, placesService): void {
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

  //TODO supprimer cette methode apres la soutenance (cette methode sert seulement à cacher les restaurants du fichier JSON dans la liste lorsqu'ils ne sont pas visible)
  // garder juste le showTextNbRestaurants
  public showVisibleRestaurants(restaurants: Restaurant[], bounds: google.maps.LatLngBounds): void {
    showTextNbRestaurants((restaurants.length));
  }
}

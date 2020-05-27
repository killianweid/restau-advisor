import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Restaurant } from "../models/restaurant.model";
import restaurantsJson from 'src/assets/json/restaurants.json';
import { averageNbOfStars, showTextNbRestaurants } from '../utils';
import $ from "jquery";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  restaurants: Restaurant[] = [];
  restaurantsSubject = new Subject<Restaurant[]>();

  constructor() {
    this.getRestaurants();
  }

  emitRestaurants() {
    this.restaurantsSubject.next(this.restaurants);
  }

  getRestaurants() {
    this.restaurants = restaurantsJson;
    this.restaurants.map(restaurant =>
      restaurant.averageRating = this.getAvgNbOfStars(restaurant)
    );
    this.emitRestaurants();
  }

  getAvgNbOfStars(restaurant: Restaurant): number {
    if(restaurant.ratings !== undefined){
      return averageNbOfStars(restaurant.ratings);
    }else{
      return -1;
    }
  }


  filtrerRestaurants(borneInf:number,borneSup:number){
    //this.getRestaurants();
    console.log(this.restaurants);
    this.restaurants = this.restaurants.filter(restaurant => {
      return (restaurant.averageRating >= borneInf && restaurant.averageRating <= borneSup) || (restaurant.averageRating <= borneInf && restaurant.averageRating >= borneSup);
    });
    const nbRestaurants = this.restaurants.length;
    showTextNbRestaurants(nbRestaurants);
    this.emitRestaurants();
  }

  addNewRestaurant(restaurant: Restaurant) {
    this.restaurants.push(restaurant);
    this.emitRestaurants();
  }

  containsRestaurant(googlePlacesId: string) {
    let result = false;
    this.restaurants.map(restaurant => {
      if(restaurant.placeId === googlePlacesId){
        result = true;
      }
    });
    return result;
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Restaurant } from "../models/restaurant.model";
import restaurantsJson from 'src/assets/json/restaurants.json';
import { averageNbOfStars } from '../utils';

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
    return averageNbOfStars(restaurant.ratings);
  }


  filtrerRestaurants(borneInf:number,borneSup:number){
    this.getRestaurants();
    this.restaurants = this.restaurants.filter(restaurant => {
      return (restaurant.averageRating >= borneInf && restaurant.averageRating <= borneSup) || (restaurant.averageRating <= borneInf && restaurant.averageRating >= borneSup);
    });
    this.emitRestaurants();
  }

  getSingleRestaurant(id: number) {
  }

  createNewRestaurant(newRestaurant: Restaurant) {
  }

  removeRestaurant(restaurant: Restaurant) {

  }
}

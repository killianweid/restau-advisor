import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Restaurant } from "../models/restaurant.model";
import restaurantsJson from 'src/assets/json/restaurants.json';
import { averageNbOfStars } from '../utils';

@Injectable()
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

  getAvgNbOfStars(restaurant: Restaurant) {
    return averageNbOfStars(restaurant.ratings);
  }

  getSingleRestaurant(id: number) {
  }

  createNewRestaurant(newRestaurant: Restaurant) {
  }

  removeRestaurant(restaurant: Restaurant) {

  }
}

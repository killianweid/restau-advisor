import { Injectable } from '@angular/core';
import {Restaurant} from "../models/restaurant.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  restaurant: Restaurant;
  restaurantSubject = new Subject<Restaurant>();

  constructor() {
    this.getRestaurant();
  }

  public getRestaurant() {

  }

}

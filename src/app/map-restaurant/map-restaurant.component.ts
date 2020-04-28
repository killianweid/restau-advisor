import {Component, OnDestroy, OnInit,} from '@angular/core';
import {Restaurant} from "../models/restaurant.model";
import {Subscription} from "rxjs";
import {RestaurantsService} from "../services/restaurants.service";

@Component({
  selector: 'app-map-restaurant',
  templateUrl: './map-restaurant.component.html',
  styleUrls: ['./map-restaurant.component.scss']
})

export class MapRestaurantComponent implements OnInit,OnDestroy{

  restaurants: Restaurant[];
  restaurantsSubscription: Subscription;

  constructor(private restaurantsService: RestaurantsService) {
  }

  ngOnInit(): void {
    this.restaurantsSubscription = this.restaurantsService.restaurantsSubject.subscribe(
      (restaurants: Restaurant[]) => this.restaurants = restaurants
    );
    this.restaurantsService.emitRestaurants();
  }

  ngOnDestroy(): void {
    this.restaurantsSubscription.unsubscribe();
  }

}

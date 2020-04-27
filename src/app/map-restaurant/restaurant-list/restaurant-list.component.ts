import {Component, OnDestroy, OnInit} from '@angular/core';
import {Restaurant} from "../../models/restaurant.model";
import {Subscription} from "rxjs";
import {RestaurantsService} from "../../services/restaurants.service";

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit, OnDestroy {

  restaurants: Restaurant[];
  restaurantsSubscription: Subscription;
  constructor(private restaurantsService: RestaurantsService) { }

  ngOnInit(): void {
    this.restaurantsSubscription = this.restaurantsService.restaurantsSubject.subscribe(
      (restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
      }
    );
    this.restaurantsService.emitRestaurants();
  }

  onMoveMap() {

  }

  ngOnDestroy() {
    this.restaurantsSubscription.unsubscribe();
  }

}

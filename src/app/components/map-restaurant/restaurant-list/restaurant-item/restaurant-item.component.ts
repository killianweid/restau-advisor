import {Component, Input } from '@angular/core';
import {Restaurant} from "../../../../models/restaurant.model";
import {faArrowDown, faEye, faEyeSlash, faPlus, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {RestaurantsService} from "../../../../services/restaurants.service";

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss']
})
export class RestaurantItemComponent   {
  @Input() public restaurant: Restaurant;

  public ratingsAreShown: boolean = false;
  public formRatingIsShow: boolean = false;
  public faTimesCircle = faTimesCircle;
  public faStar = faStar;
  public iconAdd = faPlus;
  public iconFlecheBas = faArrowDown;
  public iconShow = faEye;
  public iconHide = faEyeSlash;

  constructor(private restaurantsService:RestaurantsService) {
  }

  public onClickRestaurant(): void {
    //TODO afficher également la google street view si elle est deja affiché pour un autre restaurant
    this.ratingsAreShown = !this.ratingsAreShown;
    this.restaurant.isSelected = !this.restaurant.isSelected;
    if(this.restaurantsService.lastRestaurantSelectedId !== null){
      this.restaurantsService.unselectRestaurant(this.restaurantsService.lastRestaurantSelectedId);
    }
    this.restaurantsService.lastRestaurantSelectedId = this.restaurant.id;
  }

  public onClickAddRating(): void {
    this.formRatingIsShow = !this.formRatingIsShow;
  }

  public setVisibleOnMap(): void {
    this.restaurant.isVisibleOnMap = !this.restaurant.isVisibleOnMap;
  }

}

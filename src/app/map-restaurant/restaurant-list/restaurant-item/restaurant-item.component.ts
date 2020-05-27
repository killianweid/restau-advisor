import {Component, Input } from '@angular/core';
import {Restaurant} from "../../../models/restaurant.model";
import {faArrowDown, faPlus, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss']
})
export class RestaurantItemComponent   {
  @Input() restaurant: Restaurant;
  ratingsAreShown: boolean = false;
  formRatingIsShow: boolean = false;
  faTimesCircle = faTimesCircle;
  faStar = faStar;
  iconAdd = faPlus;
  iconFlecheBas = faArrowDown;

  public onClickRestaurant(): void {
    this.ratingsAreShown = !this.ratingsAreShown;
    this.restaurant.isSelected = !this.restaurant.isSelected;
  }

  public onClickAddRating(): void {
    this.formRatingIsShow = !this.formRatingIsShow;
  }

}

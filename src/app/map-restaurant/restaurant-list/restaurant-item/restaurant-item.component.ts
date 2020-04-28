import {Component, Input } from '@angular/core';
import {Restaurant} from "../../../models/restaurant.model";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStar2 }  from "@fortawesome/free-regular-svg-icons"

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
  faStar2 = faStar2;

  public onClickRestaurant(): void {
    this.ratingsAreShown = !this.ratingsAreShown;
    this.restaurant.isSelected = !this.restaurant.isSelected;
    //TODO appel méthode showStreetView de MapViewComponent pour afficher la StreetView
  }

  public onClickAddRating(): void {
    this.formRatingIsShow = !this.formRatingIsShow;
  }

}

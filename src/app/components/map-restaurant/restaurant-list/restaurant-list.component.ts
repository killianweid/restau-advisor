import {Component, Input} from '@angular/core';
import {Restaurant} from "../../../models/restaurant.model";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent  {
  @Input() public restaurants: Restaurant[];

  public allRestaurantsVisibleOnMap: boolean = false;

  public iconVisible = faEye;
  public iconHidden = faEyeSlash;

  public setRestaurantsVisible(): void {
    this.restaurants.map(restaurant => {
      if(restaurant.isVisibleOnMap !== !this.allRestaurantsVisibleOnMap){
        restaurant.isVisibleOnMap = !this.allRestaurantsVisibleOnMap;
      }
    })
    this.allRestaurantsVisibleOnMap = !this.allRestaurantsVisibleOnMap;
  }

}

import {Component, Input} from '@angular/core';
import {Restaurant} from "../../../models/restaurant.model";

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent  {
  @Input() public restaurants: Restaurant[];

}

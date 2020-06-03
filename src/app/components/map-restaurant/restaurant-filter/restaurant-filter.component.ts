import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RestaurantsService} from "../../../services/restaurants.service";
import {faStar, faFilter} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-restaurant-filter',
  templateUrl: './restaurant-filter.component.html',
  styleUrls: ['./restaurant-filter.component.scss']
})
export class RestaurantFilterComponent implements OnInit {

  public restauFilter: FormGroup;
  public faStar = faStar;
  public faFilter = faFilter;

  constructor(private formBuilder: FormBuilder,
              private restaurantsService: RestaurantsService) {
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.restauFilter = this.formBuilder.group({
      inferior_number:'1',
      superior_number: '5',
    });
  }

  public onFilterRestau(): void {
    const input1 = this.restauFilter.get('inferior_number');
    const input2 = this.restauFilter.get('superior_number');
    this.restaurantsService.filtrerRestaurants(input1.value, input2.value);
  }

}

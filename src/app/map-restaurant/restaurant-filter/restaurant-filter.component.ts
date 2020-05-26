import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Restaurant} from "../../models/restaurant.model";
import {RestaurantsService} from "../../services/restaurants.service";
import {faStar, faFilter} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-restaurant-filter',
  templateUrl: './restaurant-filter.component.html',
  styleUrls: ['./restaurant-filter.component.scss']
})
export class RestaurantFilterComponent implements OnInit {

  restauFilter: FormGroup;
  faStar = faStar;
  faFilter = faFilter;

  restaurants: Restaurant [];

  constructor(private formBuilder: FormBuilder,
              private restaurantsService: RestaurantsService) {
  }

  ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.restauFilter = this.formBuilder.group({
      inferior_number: ['1'],
      superior_number: ['5']
    });
  }

  public onFilterRestau(): void {
    const input1 = this.restauFilter.get('inferior_number');
    const input2 = this.restauFilter.get('superior_number');
    if(input1.value !=='' && input2.value !=='' ) {
      if (input1.value > 5) {
        input1.setValue(5);
      } else if (input1.value < 1) {
        input1.setValue(1);
      }
      const nombreInferieur = input1.value;
      if (input2.value > 5) {
        input2.setValue(5);
      } else if (input2.value < 1) {
        input2.setValue(1);
      }
      const nombreSuperieur = input2.value
      this.restaurantsService.filtrerRestaurants(nombreInferieur, nombreSuperieur);
      //TODO beug filtrage (restaurants json affichés dans la liste)
    }
  }

}

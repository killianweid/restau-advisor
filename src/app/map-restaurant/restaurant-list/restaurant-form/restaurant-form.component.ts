import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Restaurant} from "../../../models/restaurant.model";
import {RestaurantsService} from "../../../services/restaurants.service";
import { strRandom, findRestaurantById } from '../../../utils';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent implements OnInit {

  restauForm: FormGroup;
  @Input() restaurants: Restaurant[];
  @Input() coords: any;
  @Output() creationRestauInPrgs: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
              private restaurantsService: RestaurantsService) { }

  ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.restauForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  public onSaveRestau(): void {
    const name = this.restauForm.get('name').value;
    const newRestaurant = new Restaurant(name,this.coords.lat,this.coords.lng);
    //name.strRandom();
    let test = strRandom({
      includeUpperCase: false,
      includeNumbers: true,
      length: 20,
      startsWithLowerCase: true
    });
    while(findRestaurantById(this.restaurants, test) !== -1){
      test = strRandom({
        includeUpperCase: false,
        includeNumbers: true,
        length: 20,
        startsWithLowerCase: true
      });
    }
    newRestaurant.id = test;
    this.restaurantsService.addNewRestaurant(newRestaurant);
    this.creationRestauInPrgs.emit(false);

  }

}

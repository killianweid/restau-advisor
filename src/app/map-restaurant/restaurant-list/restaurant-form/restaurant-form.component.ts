import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Restaurant} from "../../../models/restaurant.model";

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

  constructor(private formBuilder: FormBuilder) { }

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
    const newRestaurant = new Restaurant(this.restaurants[this.restaurants.length-1].id+1,name,this.coords.lat,this.coords.lng);
    this.restaurants.push(newRestaurant);
    this.creationRestauInPrgs.emit(false);

  }

}

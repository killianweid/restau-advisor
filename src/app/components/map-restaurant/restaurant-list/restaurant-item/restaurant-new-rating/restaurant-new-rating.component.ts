import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import  {Rating } from "../../../../../models/rating.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Restaurant} from "../../../../../models/restaurant.model";
import {averageNbOfStars} from "../../../../../utils";


@Component({
  selector: 'app-restaurant-new-rating',
  templateUrl: './restaurant-new-rating.component.html',
  styleUrls: ['./restaurant-new-rating.component.scss']
})
export class RestaurantNewRatingComponent implements OnInit {

  private rating: Rating;
  @Input() public restaurant: Restaurant;
  public ratingForm: FormGroup;
  @Input() public formRatingIsShow: boolean;
  @Output() public isCall: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.ratingForm = this.formBuilder.group({
      stars: ['1', Validators.required],
      comment: ['', Validators.required]
    });
  }

  public onSaveRating(): void {
    const stars = Number(this.ratingForm.get('stars').value);
    const comment = this.ratingForm.get('comment').value;
    this.rating = new Rating(stars,comment);
    if(!this.restaurant.ratings){
      this.restaurant.ratings = [];
    }
    this.restaurant.ratings.push(this.rating);
    this.restaurant.averageRating = averageNbOfStars(this.restaurant.ratings);
    this.isCall.emit(false);
    this.restaurant.isSelected = true;
  }

}

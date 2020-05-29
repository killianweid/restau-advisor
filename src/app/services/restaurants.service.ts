import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Restaurant } from "../models/restaurant.model";
import { averageNbOfStars, showTextNbRestaurants } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  private restaurants: Restaurant[] = [];
  public restaurantsSubject = new Subject<Restaurant[]>();

  public lastRestaurantSelectedId:string = null;

  constructor() {
    this.getRestaurants();
  }

  public emitRestaurants(): void {
    this.restaurantsSubject.next(this.restaurants);
  }

  public getRestaurants(): void {
    this.restaurants.map(restaurant =>
      restaurant.averageRating = this.getAvgNbOfStars(restaurant)
    );
    this.emitRestaurants();
  }

  public getAvgNbOfStars(restaurant: Restaurant): number {
    if(restaurant.ratings !== undefined){
      return averageNbOfStars(restaurant.ratings);
    }else{
      return -1;
    }
  }

  public filtrerRestaurants(borneInf:number,borneSup:number): void{
    this.restaurants = this.restaurants.filter(restaurant => {
      return (restaurant.averageRating >= borneInf && restaurant.averageRating <= borneSup) || (restaurant.averageRating <= borneInf && restaurant.averageRating >= borneSup);
    });
    const nbRestaurants = this.restaurants.length;
    showTextNbRestaurants(nbRestaurants);
    this.emitRestaurants();
  }

  public addNewRestaurant(restaurant: Restaurant): void {
    this.restaurants.push(restaurant);
    this.emitRestaurants();
  }

  public containsRestaurant(googlePlacesId: string): boolean {
    let result = false;
    this.restaurants.map(restaurant => {
      if(restaurant.placeId === googlePlacesId){
        result = true;
      }
    });
    return result;
  }

  public selectRestaurant(idRestaurant:string, onClickItemList:boolean=false): void {
    if(onClickItemList) {
      if(this.lastRestaurantSelectedId === idRestaurant) {
        this.restaurants.map(restaurant => {
          if(restaurant.id === idRestaurant){
            restaurant.isSelected = !restaurant.isSelected;
          }
        });
      }
    }else{
      if(this.lastRestaurantSelectedId === null){
        this.lastRestaurantSelectedId = idRestaurant;
      }else{
        this.unselectRestaurant(this.lastRestaurantSelectedId);
        this.lastRestaurantSelectedId = idRestaurant;
      }
      this.restaurants.map(restaurant => {
        if(restaurant.id === idRestaurant){
          restaurant.isSelected = true;
        }
      });
    }

  }

  public unselectRestaurant(idRestaurant:string): void {
    this.restaurants.map(restaurant => {
      if(restaurant.id === idRestaurant){
        restaurant.isSelected = false;
      }
    });
  }

}

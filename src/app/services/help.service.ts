import { Injectable } from '@angular/core';
import {Restaurant} from "../models/restaurant.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  public helpStarterIsShowed:boolean=true;
  public helpMapRestaurantIsShowed:boolean=false;

  public helpStarterIsShowedSubject = new Subject<boolean>();
  public helpMapRestaurantIsShowedSubject = new Subject<boolean>();

  public emitHelpStarter(): void {
    this.helpStarterIsShowedSubject.next(this.helpStarterIsShowed);
  }

  public emitHelpMapRestaurant(): void {
    this.helpMapRestaurantIsShowedSubject.next(this.helpMapRestaurantIsShowed);
  }

  public changeHelpStarter(): void {
    this.helpStarterIsShowed = !this.helpStarterIsShowed;
    this.emitHelpStarter();
  }

  public changeHelpMapRestaurant(): void {
    this.helpMapRestaurantIsShowed = !this.helpMapRestaurantIsShowed;
    this.emitHelpMapRestaurant();
  }

}

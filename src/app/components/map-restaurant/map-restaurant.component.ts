import {Component, OnDestroy, OnInit,} from '@angular/core';
import {Restaurant} from "../../models/restaurant.model";
import {Subscription} from "rxjs";
import {RestaurantsService} from "../../services/restaurants.service";
import {
  faUtensils,
  faFilter,
  faStreetView,
  faCommentMedical,
  faArrowsAlt,
  faStar,
  faHandsHelping,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import {HelpService} from "../../services/help.service";

@Component({
  selector: 'app-map-restaurant',
  templateUrl: './map-restaurant.component.html',
  styleUrls: ['./map-restaurant.component.scss']
})

export class MapRestaurantComponent implements OnInit,OnDestroy{

  public restaurants: Restaurant[];
  private restaurantsSubscription: Subscription;
  public helpIsShowed: boolean;
  private helpIsShowedSubscription: Subscription;

  /* icones */
  public iconRestaurant = faUtensils;
  public iconAddRond = faPlusCircle;
  public iconFilter = faFilter;
  public iconStreetView = faStreetView;
  public iconAddComment = faCommentMedical;
  public icondDirection = faArrowsAlt;
  public iconEtoile = faStar;
  public iconHelp = faHandsHelping;
  /* fin icones */
  helpShowed: boolean = false;

  constructor(private restaurantsService: RestaurantsService,
              private helpService: HelpService) {
  }

  public ngOnInit(): void {
    this.restaurantsSubscription = this.restaurantsService.restaurantsSubject.subscribe(
      (restaurants: Restaurant[]) => this.restaurants = restaurants
    );
    this.restaurantsService.emitRestaurants();
    this.helpIsShowedSubscription = this.helpService.helpMapRestaurantIsShowedSubject.subscribe(
      (helpIsShowed: boolean) => this.helpIsShowed = helpIsShowed
    );
    this.helpService.emitHelpMapRestaurant();
  }

  public ngOnDestroy(): void {
    this.restaurantsSubscription.unsubscribe();
    this.helpIsShowedSubscription.unsubscribe();
  }

  public onCloseHelp(): void{
    this.helpService.changeHelpMapRestaurant();
  }

}

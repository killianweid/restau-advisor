import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapRestaurantComponent } from './map-restaurant/map-restaurant.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import {RestaurantsService} from "./services/restaurants.service";
import { secret } from "../../secret.js";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RestaurantItemComponent } from './map-restaurant/restaurant-list/restaurant-item/restaurant-item.component';
import { RestaurantListComponent } from './map-restaurant/restaurant-list/restaurant-list.component';
import { MapViewComponent } from './map-restaurant/map-view/map-view.component';
import { RestaurantFilterComponent } from './map-restaurant/restaurant-filter/restaurant-filter.component';
import { RestaurantNewRatingComponent } from './map-restaurant/restaurant-list/restaurant-item/restaurant-new-rating/restaurant-new-rating.component';
import { RestaurantFormComponent } from './map-restaurant/restaurant-list/restaurant-form/restaurant-form.component';
import { StarterChoiceComponent } from './starter-choice/starter-choice.component';
import { AutoCompleteComponent } from './starter-choice/auto-complete/auto-complete.component';

const appRoutes: Routes = [
  { path: 'starter-position-choice', component: StarterChoiceComponent },
  { path: 'carte-et-restaurants', component: MapRestaurantComponent },
  { path: '', redirectTo: 'starter-position-choice', pathMatch: 'full' },
  { path: '**', redirectTo: 'starter-position-choice' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapRestaurantComponent,
    RestaurantItemComponent,
    RestaurantListComponent,
    MapViewComponent,
    RestaurantFilterComponent,
    RestaurantNewRatingComponent,
    RestaurantFormComponent,
    StarterChoiceComponent,
    AutoCompleteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: secret.AGM_CORE_MODULE_API_KEY
    }),
    FontAwesomeModule
  ],
  providers: [
    RestaurantsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

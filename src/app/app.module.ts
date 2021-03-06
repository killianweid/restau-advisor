import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MapRestaurantComponent } from './components/map-restaurant/map-restaurant.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import {RestaurantsService} from "./services/restaurants.service";
import { secret } from "../../secret.js";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RestaurantItemComponent } from './components/map-restaurant/restaurant-list/restaurant-item/restaurant-item.component';
import { RestaurantListComponent } from './components/map-restaurant/restaurant-list/restaurant-list.component';
import { MapViewComponent } from './components/map-restaurant/map-view/map-view.component';
import { RestaurantFilterComponent } from './components/map-restaurant/restaurant-filter/restaurant-filter.component';
import { RestaurantNewRatingComponent } from './components/map-restaurant/restaurant-list/restaurant-item/restaurant-new-rating/restaurant-new-rating.component';
import { RestaurantFormComponent } from './components/map-restaurant/restaurant-list/restaurant-form/restaurant-form.component';
import { StarterChoiceComponent } from './components/starter-choice/starter-choice.component';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfosComponent } from './components/infos/infos.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import {LoadingScreenService} from "./services/loading-screen.service";

const appRoutes: Routes = [
  { path: 'starter-position-choice', component: StarterChoiceComponent },
  { path: 'en-savoir-plus', component: InfosComponent },
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
    FooterComponent,
    InfosComponent,
    LoadingScreenComponent,
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
    RestaurantsService,
    LoadingScreenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

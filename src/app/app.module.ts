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
import { MapViewComponent } from './map-restaurant/map-view/map-view.component';
import { RestaurantListComponent } from './map-restaurant/restaurant-list/restaurant-list.component';
import {MarkersService} from "./services/markers.service";
import { secret } from "../../secret.js";

const appRoutes: Routes = [
  { path: 'carte', component: MapRestaurantComponent },
  { path: '', redirectTo: 'carte', pathMatch: 'full' },
  { path: '**', redirectTo: 'carte' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapRestaurantComponent,
    MapViewComponent,
    RestaurantListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: secret.AGM_CORE_MODULE_API_KEY
    })
  ],
  providers: [
    RestaurantsService,
    MarkersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

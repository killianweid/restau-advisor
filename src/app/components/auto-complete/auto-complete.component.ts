import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MapService} from "../../services/map.service";
import {RestaurantsService} from "../../services/restaurants.service";

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent {

  @Input() private adressType: string;
  @Output() private setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') private addresstext: any;

  public autocompleteInput: string;

  constructor( private mapService: MapService,
               private router: Router,
               private restaurantsService: RestaurantsService) {
  }

  public ngAfterViewInit():void {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        //componentRestrictions: { country: 'US' },
        types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
      this.mapService.setNewReferencePosition(place.geometry.location);
      if(window.location.pathname === "/starter-position-choice"){
        this.router.navigate(['carte-et-restaurants']);
      }else{
        //this.mapService.initMapAndGooglePlacesRestaurants(this.map, this.restaurants);
        this.restaurantsService.clearRestaurants();
        this.mapService.changeCenter(new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng()));
      }
    });
  }

  public invokeEvent(place: Object): void {
    this.setAddress.emit(place);
  }

}

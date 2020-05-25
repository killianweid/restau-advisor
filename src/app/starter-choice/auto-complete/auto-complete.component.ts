import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {

  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput: string;
  @Output() placeEntered: boolean = false;
  positionPlaceSelected: google.maps.LatLng;


  constructor( private mapService: MapService,
               private router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
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
      this.positionPlaceSelected = place.geometry.location;
      this.placeEntered = true;
      //TODO probleme ici il faut cliquer sur l'input pour que le disabled soit enlevé alors qu'il devrait etre enleve directement au clic sur une place
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object): void {
    this.setAddress.emit(place);
  }

  public onClickAdress(): void {
    this.mapService.referencePosition = this.positionPlaceSelected;
    this.router.navigate(['carte-et-restaurants']).then(()=>{
      $("#block_map_restaurants").removeClass("d-none");
    });
  }

  public onInputAddress(): void {
      if(this.placeEntered){
        this.placeEntered = false;
        this.positionPlaceSelected = null;
      }
  }


}

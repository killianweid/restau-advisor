import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MapService} from "../services/map.service";

@Component({
  selector: 'app-starter-choice',
  templateUrl: './starter-choice.component.html',
  styleUrls: ['./starter-choice.component.scss']
})
export class StarterChoiceComponent implements OnInit {

  actualPositionLat: number;
  actualPositionLng: number;

  // google maps zoom level
  initialZoom: number = 17;

  map: google.maps.Map;

  adressSearch: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private mapService: MapService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    if ("geolocation" in navigator) {
      /* la géolocalisation est disponible */
      navigator.geolocation.getCurrentPosition((position) => {
        this.actualPositionLat = position.coords.latitude;
        this.actualPositionLng = position.coords.longitude;
      });
    } else {
      alert("La géolocalisation n'est pas supporté par ce navigateur.");
    }
  }

  public onMapReady(map:google.maps.Map): void {
    this.map = map;
  }

  public initForm(): void {
    this.adressSearch = this.formBuilder.group({
      adresse: ['', Validators.requiredTrue],
    });
  }

  public onClickPosition():void {
    this.mapService.referencePosition = new google.maps.LatLng(this.actualPositionLat,this.actualPositionLng);
    this.router.navigate(['carte-et-restaurants']).then(()=>{
      $("#block_map_restaurants").removeClass("d-none");
    });

  }

}

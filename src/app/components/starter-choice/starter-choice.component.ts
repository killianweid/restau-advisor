import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MapService} from "../../services/map.service";
import {faCrosshairs, faHandsHelping, faMapMarkedAlt, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import {LoadingScreenService} from "../../services/loading-screen.service";
import {Subscription} from "rxjs";
import {HelpService} from "../../services/help.service";

@Component({
  selector: 'app-starter-choice',
  templateUrl: './starter-choice.component.html',
  styleUrls: ['./starter-choice.component.scss']
})
export class StarterChoiceComponent implements OnInit {

  public actualPositionLat: number;
  public actualPositionLng: number;

  public iconHelp= faHandsHelping;
  public iconPosition= faCrosshairs;
  public iconMarker = faMapMarkerAlt;
  public iconAdress = faMapMarkedAlt;

  // google maps zoom level
  public initialZoom: number = 17;

  private map: google.maps.Map;
  public mapReady: boolean = false;

  public adressSearch: FormGroup;

  public helpIsShowed: boolean;
  private helpIsShowedSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private mapService: MapService,
              private router: Router,
              private helpService: HelpService,
              private loadingScreenService: LoadingScreenService) { }

  public ngOnInit(): void {
    this.loadingScreenService.startLoading();
    this.helpIsShowedSubscription = this.helpService.helpStarterIsShowedSubject.subscribe(
      (helpIsShowed: boolean) => this.helpIsShowed = helpIsShowed
    );
    this.helpService.emitHelpStarter();
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
    this.mapReady = true;
    this.loadingScreenService.stopLoading();
  }

  public initForm(): void {
    this.adressSearch = this.formBuilder.group({
      adresse: ['', Validators.requiredTrue],
    });
  }

  public onClickPosition():void {
    this.mapService.referencePosition = new google.maps.LatLng(this.actualPositionLat,this.actualPositionLng);
    this.router.navigate(['carte-et-restaurants']);
  }

  public onCloseHelp(): void{
    this.helpService.changeHelpStarter();
  }

}

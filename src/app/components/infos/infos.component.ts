import { Component } from '@angular/core';
import {
  faArrowDown,
  faCrosshairs,
  faFilter,
  faHandsHelping,
  faMapMarkedAlt,
  faMapMarkerAlt,
  faPlus,
  faStar,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent  {

  public iconHelp= faHandsHelping;
  public iconPosition= faCrosshairs;
  public iconMarker = faMapMarkerAlt;
  public iconAdress = faMapMarkedAlt;
  public iconEtoile = faStar;
  public iconFilter = faFilter;
  public iconTimes = faTimesCircle;
  public iconAdd = faPlus;
  public iconFlecheBas = faArrowDown;

}

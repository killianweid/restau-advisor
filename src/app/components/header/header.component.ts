import {Component, ElementRef, ViewChild} from '@angular/core';
import {HelpService} from "../../services/help.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @ViewChild('navbarToggler') private navbarToggler: ElementRef;

  constructor(private helpService: HelpService) { }

  public onClickAide(): void {
    if(window.location.pathname === "/carte-et-restaurants"){
      this.helpService.changeHelpMapRestaurant();
    }else if(window.location.pathname === "/starter-position-choice"){
      this.helpService.changeHelpStarter();
    }
  }

  public onClickNavMobile(): void {
    if(this.navbarToggler.nativeElement.classList.contains("show")){
      this.navbarToggler.nativeElement.classList.remove("show");
    }else{
      this.navbarToggler.nativeElement.classList.add("show");
    }
  }

}

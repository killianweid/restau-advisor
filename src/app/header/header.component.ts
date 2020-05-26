import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  aidePossible: boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

  onClickAide(): void {

      const blockAide = $("#block_aide");
      if(blockAide.hasClass("d-none")){
        blockAide.removeClass("d-none");
      }else{
        blockAide.addClass("d-none");
      }
  }

  onClickNavMobile(): void {
    const navBar = $("#navbarToggler");
    if(navBar.hasClass("show")){
      navBar.removeClass("show");
    }else{
      navBar.addClass("show");
    }
  }

}

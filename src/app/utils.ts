import {Rating} from "./models/rating.model";
import {Restaurant} from "./models/restaurant.model";
import $ from "jquery";

export function averageNbOfStars(ratings:Rating[]): number {
    return Number(
      (ratings.reduce(
        (sum,rating) => sum+rating.stars,0)
        /ratings.length
      )
        .toFixed(1));
}

export function showTextNbRestaurants(numberOfRestaurants:number): void {
  const elementHTMLnbRestau = $("#nb_restaurants");
  if(numberOfRestaurants > 1 && numberOfRestaurants < 10) {
    if(elementHTMLnbRestau.hasClass("bg-warning")){
      elementHTMLnbRestau.removeClass("bg-warning").addClass("bg-success");
    }
    elementHTMLnbRestau.html("<span class=\"bg-danger rounded-circle p-1 pl-2 pr-2 text-white\">"+numberOfRestaurants+"</span> restaurants correspondant à vos recherches sont actuellement visible sur la carte");
  } else if(numberOfRestaurants > 10) {
    if(elementHTMLnbRestau.hasClass("bg-warning")){
      elementHTMLnbRestau.removeClass("bg-warning").addClass("bg-success");
    }
    elementHTMLnbRestau.html("<span class=\"bg-danger rounded-circle pl-2 pr-2 pt-1 pb-1 text-white\">"+numberOfRestaurants+"</span> restaurants correspondant à vos recherches sont actuellement visible sur la carte");
  } else if (numberOfRestaurants === 1){
    if(elementHTMLnbRestau.hasClass("bg-warning")){
      elementHTMLnbRestau.removeClass("bg-warning").addClass("bg-success");
    }
    elementHTMLnbRestau.html("<span class=\"bg-danger rounded-circle pl-2 pr-2 pt-1 pb-1 text-white\">"+numberOfRestaurants+"</span> restaurant correspondant à vos recherches sont actuellement visible sur la carte");
  }else if(numberOfRestaurants === 0){
    if(elementHTMLnbRestau.hasClass("bg-success")){
      elementHTMLnbRestau.removeClass("bg-success").addClass("bg-warning");
    }
    elementHTMLnbRestau.html("<span class=\"bg-danger rounded p-1 text-white\">Aucun restaurant </span>correspondant à vos recherches sont actuellement visible sur la carte");
  }
}

export function strRandom(o): string {
  let a = 10,
    b = 'abcdefghijklmnopqrstuvwxyz',
    c = '',
    d = 0,
    e = ''+b;
  if (o) {
    if (o.startsWithLowerCase) {
      c = b[Math.floor(Math.random() * b.length)];
      d = 1;
    }
    if (o.length) {
      a = o.length;
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase();
    }
    if (o.includeNumbers) {
      e += '1234567890';
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)];
  }
  return c;
}

export function findRestaurantById(restaurants: Restaurant[], id: string) {
    restaurants.map(restaurant => {
      if(restaurant.id === id) {
        return restaurant;
      }
     });
    return -1;
}

export function findIndexOfRestaurantByGooglePlaceId(restaurants: Restaurant[], googlePlaceId: string): number{
  let index = -1;
  for (let i = 0; i < restaurants.length; i++) {
    if(restaurants[i].placeId === googlePlaceId) {
      index = i;
    }
  }
  return index;
}

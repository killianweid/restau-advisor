import {Rating} from "./models/rating.model";
import {Restaurant} from "./models/restaurant.model";

export function averageNbOfStars(ratings:Rating[]) {
    return Number(
      (ratings.reduce(
        (sum,rating) => sum+rating.stars,0)
        /ratings.length
      )
        .toFixed(1));
}

export function strRandom(o) {
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

export function findRestaurantById(restaurants: Restaurant[], id: string){
    restaurants.map(restaurant => {
      if(restaurant.id === id) {
        return restaurant;
      }
     });
    return -1;
}

export function findIndexOfRestaurantByGooglePlaceId(restaurants: Restaurant[], googlePlaceId: string){
  let index = -1;
  for (let i = 0; i < restaurants.length; i++) {
    if(restaurants[i].placeId === googlePlaceId) {
      index = i;
    }
  }
  return index;
}

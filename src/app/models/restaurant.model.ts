import {Rating} from "./rating.model";

export class Restaurant {
  address: string;
  ratings: Rating[];
  averageRating: number;
  isSelected: boolean=false;
  constructor(public id:number, public restaurantName:string, public lat: number, public long: number) {
  }
}

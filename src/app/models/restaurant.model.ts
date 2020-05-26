import {Rating} from "./rating.model";

export class Restaurant {
  id: string;
  address: string;
  ratings: Rating[];
  averageRating: number;
  isSelected: boolean = false;
  icon: string = null;
  placeId: string = null;
  constructor(public restaurantName:string, public lat: number, public long: number) {
  }
}

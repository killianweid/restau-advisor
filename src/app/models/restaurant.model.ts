import {Rating} from "./rating.model";

export interface Restaurant {
  restaurantName: string;
  address: string;
  lat: number;
  long: number;
  ratings: Rating[];
  averageRating: number;
}

import {Rating} from "./models/rating.model";

export function averageNbOfStars(ratings:Rating[]) {
    return Number(
      (ratings.reduce(
        (sum,rating) => sum+rating.stars,0)
        /ratings.length
      )
        .toFixed(1));
}

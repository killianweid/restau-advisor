import {Rating} from "./models/rating.model";

export function averageNbOfStars(ratings:Rating[]) {
    const nbRatings = ratings.length;
    let sumRating = 0;
    for (let i = 0; i < nbRatings; i++) {
      sumRating += ratings[i].stars;
    }
    return Number(((sumRating)/nbRatings).toFixed(1));
}

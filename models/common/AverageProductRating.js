class AverageProductRatingCounts {
  constructor(five = 0, four = 0, three = 0, two = 0, one = 0) {
    this.five = five;
    this.four = four;
    this.three = three;
    this.two = two;
    this.one = one;
  }
}

class AverageProductRating {
  constructor(
    average = 0,
    counts = new AverageProductRatingCounts(),
    totalCount = 0
  ) {
    this.average = average;
    this.counts = counts;
    this.totalCount = totalCount;
  }
}

module.exports = { AverageProductRating, AverageProductRatingCounts };

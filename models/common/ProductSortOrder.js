const ProductSortOrder = Object.freeze({
  A_Z: { key: "Alphabetically A-Z", ordinal: 0 },
  Z_A: { key: "Alphabetically Z-A", ordinal: 1 },
  PriceLowToHigh: { key: "Price Low to High", ordinal: 2 },
  PriceHighToLow: { key: "Price High to Low", ordinal: 3 },
  DateAddedOldFirst: { key: "Oldest First", ordinal: 4 },
  DateAddedNewFirst: { key: "Recent First", ordinal: 5 },
  BestSelling: { key: "Best selling", ordinal: 6 },
  Featured: { key: "Featured", ordinal: 7 },

  fromOrdinal: function (value) {
    const entries = Object.values(this).filter(
      (v) => typeof v === "object" && "ordinal" in v
    );
    return entries.find((e) => e.ordinal === value) || this.DateAddedNewFirst;
  },
});

module.exports = ProductSortOrder;

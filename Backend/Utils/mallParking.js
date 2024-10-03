// utils/parkingUtils.js
exports.calculateParkingPrice = (pricing, duration) => {
  let price = 0;
  pricing.forEach((rate) => {
    if (duration >= rate.duration) {
      price += rate.price;
    }
  });
  return price;
};

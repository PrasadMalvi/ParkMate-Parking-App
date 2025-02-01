const calculateParkingPrice = (pricing, duration) => {
  let totalPrice = 0;
  for (let i = 0; i < pricing.length; i++) {
    if (duration <= pricing[i].duration) {
      totalPrice = pricing[i].price;
      break;
    }
  }
  return totalPrice;
};

module.exports = { calculateParkingPrice };

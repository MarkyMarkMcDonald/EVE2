function averageSystemPricePerUnit(orderArray) {

  var totalPrice  = _.reduce(orderArray, function(item, memo) {
    return (item.price * item.quantity) + memo;
  });

  var totalQuantity = _.reduce(orderArray, function(item, memo) {
    return item.quantity + memo;
  });

  return totalPrice /  totalQuantity;
}
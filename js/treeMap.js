var rootFromServer;
var orderType = 'sellOrders';
var currentAmount = 135000000;
var currentMode = 'region';

var systemValueFinder = function(d) {
  return (averageSystemPricePerUnit(d[orderType], orderType, currentAmount));
};

var regionValueFinder = function(d) {
  return d.averageRegionSellPrice
};

var createRegionTreeMap = function(root) {
  var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var color = d3.scale.category20c();

  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(regionValueFinder);


  var div = d3.select("#tree-map").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  var node = div.datum(root).selectAll(".node")
    .data(treemap.nodes)
    .enter().append("div")
    .attr("class", "node")
    .attr("name", function(d) {
      return d.name;
    })
    .call(position)
    .style("background", function(d) {
      return d.children ? null : getColorForPercentage(d.numberOfChildren / 100);
    });

  node.text(function(d) {
    return d.children ? null : d.name + '\n' + d.averageRegionSellPrice;
  });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }
};

var averageSystemPricePerUnit = function(orderArray, orderType, bound) {
  if (!_.isEmpty(orderArray)) {
    orderArray = _.sortBy(orderArray, function(order) {
      if (orderType = 'sellOrders') {
        return order.price;
      } else {
        return -1 * order.price;
      }
    });

    if (orderType = 'sellOrders') {
      var currentPrice = 0;
      var currentQuantity = 0;
      // each loop that breaks on false return
      _.every(orderArray, function(order) {
        var price = parseFloat(order.price);
        var quantity = parseInt(order.remaining);
        if (bound - (currentPrice + price * quantity) > 0) {
          currentPrice += price * quantity;
          currentQuantity += quantity;
          return true;
        } else {
          var difference = bound - currentPrice;
          var numberPurchasableLeft = Math.floor(difference / price);
          currentPrice += numberPurchasableLeft * price;
          currentQuantity += numberPurchasableLeft;
          return false;
        }
      });

      return currentQuantity;
    } else {

    }
  } else {
    return 0;
  }
};

/*
 Just showing regions
 */
var averageRegionPricePerUnit = function(systems, orderType, bound) {
  var allRegionOrders = [];

  _.each(systems, function(system) {
    if (system[orderType]) {
      allRegionOrders = allRegionOrders.concat(system[orderType]);
    }
  });

  return averageSystemPricePerUnit(allRegionOrders, orderType, bound);
};

function createRegionData(root, bound) {
  _.each(root.children, function(region) {
    region.averageRegionBuyPrice = averageRegionPricePerUnit(region.children, 'buyOrders', bound);
    region.averageRegionSellPrice = averageRegionPricePerUnit(region.children, 'sellOrders', bound);
    region.numberOfChildren = region.children.length;
    delete region.children;
  });

  return root;
}

/*
 Should update infoviz based on given value
 */
function updateInfoviz() {
  d3.json("tritainium.json", function(error, root) {
    root =  createRegionData(root, currentAmount);

    $('#tree-map').empty();
    if (currentMode == 'region') {
      createRegionTreeMap(root);
    } else {

    }
  });
}

updateInfoviz();

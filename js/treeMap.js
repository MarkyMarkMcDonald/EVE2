var systemValueFinder = function(d) {
  return (averageSystemPricePerUnit(d.buyOrders));
};

var regionValueFinder = function(d) {
  return d.averageRegionBuyPrice
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


  var div = d3.select("body").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  var node = div.datum(root).selectAll(".node")
    .data(treemap.nodes)
    .enter().append("div")
    .attr("class", "node")
    .call(position)
    .style("background", function(d) {
      return d.children ? color(d.name) : null;
    });

  node.text(function(d) {
    return d.children ? null : d.name + ' ' + d.value;
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
    orderArray = _.sortBy(orderArray, function(item) {
      if (orderType = 'buyOrders') {
        return item.price;
      } else {
        return -1 * item.price;
      }
    });

    var currentPrice = 0;

//    _.each(orderArray, function(item) {
//      if (bound - currentPrice)
//    })

    var totalPrice  = _.reduce(orderArray, function(memo, item) {
      return (parseFloat(item.price) * parseInt(item.remaining)) + memo;
    }, 0);

    var totalQuantity = _.reduce(orderArray, function(memo, item) {
      return parseInt(item.remaining) + memo;
    }, 0);

    return totalPrice /  totalQuantity;
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
    delete region.children;
  });

  return root;
}


d3.json("drake.json", function(error, root) {
  console.log(root);

  root = createRegionData(root);
//  root = root.children[0];

  createRegionTreeMap(root);
});


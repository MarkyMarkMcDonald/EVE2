var orderType = 'sellOrders';
var currentAmount = 35000000;
var currentMode = 'region';
var currentGoodType = 'tritainium';
var currentRegion = "Geminate";
var paletteNum = 0;
var systemValueFinder = function(d) {
  return (averageSystemPricePerUnit(d[orderType], orderType, currentAmount));
};

var regionValueFinder = function(d) {
  if (orderType == 'sellOrders') {
    return d.averageRegionSellPrice;
  } else {
    return d.averageRegionBuyPrice;
  }
};

var createRegionTreeMap = function(root) {
  var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var color = d3.scale.category20c();

  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d){
      if (currentMode == 'region') {
        return regionValueFinder(d);
      } else {
        return systemValueFinder(d);
      }
    });

  var div = d3.select("#tree-map").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

    function setNodeColor(d) {
        var color;
        if (currentMode == 'region') {
            color = d.children ? null : getColorForPercentage(d.numberOfChildren / 100, paletteNum);
        }
        else
        {
            if (!d.children) {
                var sysAmount = 0;
                for (var i = 0; i < d[orderType].length; i++) {
                    sysAmount += (d[orderType][i].remaining * d[orderType][i].price);
                }
                var pct = (sysAmount / currentAmount);
                pct = pct > 1 ? 1 : pct;
                pct = 1 - pct;
                console.log(pct);
                color = getColorForPercentage(pct, paletteNum);
            }
        }
        return color;
    }

    var node = div.datum(root).selectAll(".node")
    .data(treemap.nodes)
    .enter().append("div")
    .attr("class", function(d){
      if (!d.children && currentMode == 'region') {
        return "node region"
      } else if (!d.children && currentMode == 'system') {
        return "node system"
      } else {
        return "node";
      }
    })
    .attr("name", function(d) {
      return d.name;
    })
    .call(position)
    .style("background", setNodeColor);
  node.text(function(d)
  {
      if (currentMode == 'region')
      {
        return d.children ? null : d.name + '\n' + d.averageRegionSellPrice;
      }
      else
      {
          if (!d.children)
          {
              var sysAmount = 0;
              for (var i = 0; i < d[orderType].length; i++) {
                  sysAmount += d[orderType][i].remaining * d[orderType][i].price;
              }
          }
          return d.name + '\n' + sysAmount;
      }
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
      if (orderType == 'sellOrders') {
        return order.price;
      } else {
        return -1 * order.price;
      }
    });

    if (orderType == 'sellOrders') {
      // Buy Mode (return quantity)
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
        // each loop that breaks on false return
        var currentPrice = 0;
        var currentQuantity = 0;
        _.every(orderArray, function(order) {
            var price = parseFloat(order.price);
            var quantity = parseInt(order.remaining);
            if (bound - (quantity) > 0) {
                currentPrice += price * quantity;
                currentQuantity += quantity;
                return true;
            } else {
                currentPrice += price * (bound - currentQuantity);
                currentQuantity = bound;
                return false;
            }
        });
        console.log(currentPrice);
        return currentPrice;

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
  d3.json("data/" + currentGoodType + ".json", function(error, root) {
    $('#tree-map').empty();
    if (currentMode == 'region') {
      root =  createRegionData(root, currentAmount);
      createRegionTreeMap(root);
    } else {
      // create root that's a system instead of region

        var system = _.find(root.children, function(system) {
          return system.name == currentRegion;
        });

        createRegionTreeMap(system);
        createScatterPlot(root.children[0].children[0]);
    }

  });
}

function createScatterPlot(system) {
  console.log(system.sellOrders);
  console.log(system.buyOrders);

  var timeArray = new Array();
  var priceArray = new Array();
  var dateArray = new Array();

//Puts data into 3 separate arrays
  for(var i =0; i<system.sellOrders.length; i++){
    timeArray[i]= system.sellOrders[i].time.split(' ')[1];
    dateArray[i]= system.sellOrders[i].time.split(' ')[0];
    priceArray[i]= system.sellOrders[i].price;
  }

 //dimensions of line graph
 var margins = [80, 80, 80, 80]
 var width = 1000 - m[1]-m[3];
 var height = 400 - m[0]-m[2];

 //x and y scales
 var xScale = d3.scale.linear().domain([0, timeArray.length]).range([0,width]); 
 var yScale = d3.scale.linear().domain([0,10]).range([h,0]);

 //var line = d3.svg.line();



}

updateInfoviz();

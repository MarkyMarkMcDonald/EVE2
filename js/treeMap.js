var orderType = 'sellOrders';
var currentAmount = 35000000;
var currentMode = 'region';
var currentGoodType = 'Tritanium';
var currentRegion = "Geminate";
var paletteNum = 0;
var mostChildren = 1;

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
            paletteNum = 1;
            color = d.children ? null : getColorForPercentage(1 - d.numberOfChildren / mostChildren, paletteNum);
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
                pct = pct;
                paletteNum = 0;
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
        var potentialBuyOrder = d['buyOrders'][0];
        var potentialSellOrder = d['sellOrders'][0];
        if ((potentialBuyOrder && potentialBuyOrder.security < .5) || (potentialSellOrder && potentialSellOrder.security < .5)) {
          return "node system insecure"
        } else {
          return "node system"
        }
      } else {
        return "node";
      }
    })
    .attr("name", function(d) {
      return d.name;
    })
    .call(position)
    .style("background", setNodeColor);
    node.attr('data-val', function(d) {
      if (currentMode == 'region') {
        return regionValueFinder(d);
      } else {
        return systemValueFinder(d);
      }
    });
    if (currentMode == 'region') {
      node.attr('data-numberOfSystems', function(d) {
        return d.children ? d.children.length : null ;
      })
    }

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

    var currentPrice = 0;
    var currentQuantity = 0;
    if (orderType == 'sellOrders') {       // Buy Mode (return quantity)
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
    mostChildren = 1;
    _.each(root.children, function(region) {
        region.averageRegionBuyPrice = averageRegionPricePerUnit(region.children, 'buyOrders', bound);
        region.averageRegionSellPrice = averageRegionPricePerUnit(region.children, 'sellOrders', bound);
        region.numberOfChildren = region.children.length;
        mostChildren = region.children.length > mostChildren ? region.children.length : mostChildren;
        delete region.children;
    });

    return root;
}

function changeGood()
{
    var mylist=document.getElementById("myList");
    currentGoodType = mylist.options[mylist.selectedIndex].text;
    currentMode = 'region';
    updateInfoviz();
}

/*
 Should update infoviz based on given value
 */
function updateInfoviz() {
  d3.json("data/" + currentGoodType + ".json", function(error, root) {
    $('#tree-map').empty();
    $('#scatter-plot').empty();
    if (currentMode == 'region') {
      root =  createRegionData(root, currentAmount);

      createRegionTreeMap(root);
        drawColorKeys();
    } else {
        // create root that's a region instead of lots of regions
        var region = _.find(root.children, function(region) {
          return region.name == currentRegion;
        });

        if (!region) {
          currentMode = 'region';
          createRegionTreeMap(root)
        } else {
          createRegionTreeMap(region);
        }

        drawColorKeys();
    }

  });
    if(currentMode == "region")
    {
        document.getElementById('neg').innerHTML = 'Low System Count';
        document.getElementById('pos').innerHTML = 'High System Count';
    }
    else
    {

        document.getElementById('neg').innerHTML = 'Low Percentage of ISK used';
        document.getElementById('pos').innerHTML = 'High Percentage of ISK used';
    }
    if(orderType == "buyOrders")
    {
        document.getElementById('sliderTitle').innerHTML = '<h3>Quantity of Good to Sell</h3>';
    }
    else
    {
        document.getElementById('sliderTitle').innerHTML = '<h3>Amount of ISK to Spend</h3>';
    }
}



updateInfoviz();



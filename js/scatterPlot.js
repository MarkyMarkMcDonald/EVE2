function createScatterPlot(system){
  var times = [];
  var prices = [];
  var dates = [];

  system.sellOrders = _.sortBy(system.sellOrders, function(sellOrder){
    return sellOrder.time.split(' ')[0] * 24 + sellOrder.time.split(' ')[1];
  });

  _.each(system.sellOrders, function(sellOrder){
    times.push(sellOrder.time.split(' ')[1]);
    dates.push(sellOrder.time.split(' ')[1]);
    prices.push(sellOrder.price);
  });

  var w = 940,
    h = 300,
    pad = 20,
    left_pad = 100;

  var svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var x = d3.scale.linear().domain([0, 23]).range([left_pad, w-pad]);
  var y = d3.scale.linear().domain([0, 6]).range([h-pad*2, pad]);
  var r = d3.scale.linear()
    .domain([0, d3.max(system.children, function(d) {
      return d.children
    })])

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad)+")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+(left_pad-pad)+", 0)")
    .call(yAxis);
}
function createScatterPlot(system){
  $('#scatter-plot').empty();

  _.each(system[orderType], function(order){
    order.hours = parseInt(order.time.split(' ')[1].split(':')[0]);
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
  var y = d3.scale.linear().domain([0, d3.max(system[orderType], function(d){
    return parseInt(d.price);
  })]).range([h-pad*2, pad]);
  var r = d3.scale.linear().domain([0, d3.max(system[orderType], function(d) {
    return parseInt(d.remaining);
  })]).range([0,12]);

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



  svg.selectAll("circle")
    .data(system[orderType])
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx",  function (d) {
      return x(d.hours);
    })
    .attr("cy", function (d) {
      return y(parseInt(d.price));
    })
    .attr('data-price', function(d){return d.price})
    .attr('data-remaining', function(d){return d.remaining})
    .transition()
    .duration(800)
    .attr("r", function (d) {
      return r(parseInt(d.remaining));
    });
}

$(function(){
  /*
  Unfortunately the data doesn't really fit line graphs - see report
   */

//  $('body').on('click', '.node.system', function(e) {
//
//    var systemName = $(this).attr('name');
//
//    d3.json("data/" + currentGoodType + ".json", function(error, root) {
//
//      var region = _.find(root.children, function(region) {
//        return region.name == currentRegion;
//      });
//
//      var system = _.find(region.children, function(system) {
//        return system.name == systemName;
//      });
//
//      createScatterPlot(system);
//
//    });
//
//  })

});
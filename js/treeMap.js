var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return averageSystemPricePerUnit(d.buyOrders); });

var div = d3.select("body").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

var averageSystemPricePerUnit = function(orderArray) {
  if (!_.isEmpty(orderArray)) {
    var totalPrice  = _.reduce(orderArray, function(memo, item) {
      return (item.price * item.remaining) + memo;
    }, 0);

    var totalQuantity = _.reduce(orderArray, function(memo, item) {
      return item.remaining + memo;
    }, 0);

    return totalPrice /  totalQuantity;
  } else {
    return 0;
  }
};


d3.json("test.json", function(error, root) {
console.log(root);
  var node = div.datum(root).selectAll(".node")
      .data(treemap.nodes)
      .enter().append("div")
      .attr("class", "node")
      .call(position)
      .style("background", function(d) { return d.children ? color(d.name) : null; })
      .text(function(d) { return d.children ? null : d.name; });

  d3.selectAll("input").on("change", function change() {
    var value = function(d) {
      return averageSystemPricePerUnit(d.buyOrders);
    };

    node
        .data(treemap.value(value).nodes)
        .transition()
        .duration(1500)
        .call(position);
  });
});

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
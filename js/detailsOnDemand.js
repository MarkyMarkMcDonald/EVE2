$(function(){
  var tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  $('body').on("mousemove", '.node', function(event) {
    var $this = $(event.target);
    if ($this.hasClass('region') || $this.hasClass('system')) {
      tooltipDiv.transition().duration(200)
        .style("opacity", .9);

      var text = detailsTemplate($this);

      tooltipDiv.html(text)
        .style("left", (event.pageX - 135) + "px")
        .style("top", (event.clientY - 30) + "px");

    }
  }).on("mouseout", '.node', function(event) {
      tooltipDiv.transition()
        .duration(500)
        .style("opacity", 0);
    });
});

function detailsTemplate($node) {
  var text = $node.attr('name');

  var nodeValue = parseInt($node.attr('data-val') * 100) / 100;

  if (orderType == 'sellOrders') {
    text += "<br/>Quantity for Investment: "
  } else {
    text += "<br/>Total Isk Received: "
  }

  text += nodeValue;

  var numberOfSystems = $node.attr('data-numberOfSystems');
  if (numberOfSystems) {
    text += "<br/>Number of Systems: " + numberOfSystems;
  }
  return text;
}
$(function(){
  var tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  $('#tree-map-container').on("mousemove", '.node', function(event) {
    var $this = $(event.target);

    if ($this.hasClass('region') || $this.hasClass('system')) {
      bringForthYeToolTip();
      moveToolTipToMouse(event);

      var text = nodeDetailsTemplate($this);
      tooltipDiv.html(text)
    }
  }).on("mouseout", '.node', hideYeToolTip);

  $('body').on('mouseenter','.circle', function(event) {
    var $this = $(event.target);

    bringForthYeToolTip();

    tooltipDiv.style("left", ($this.offset().left) + "px")
      .style("top", ($this.offset().top) + "px");

    var text = circleDetailsTemplate($this);

    tooltipDiv.html(text);
  }).on("mouseout", '.circle', hideYeToolTip);

  function bringForthYeToolTip(){
    tooltipDiv.transition().duration(200)
      .style("opacity", .9);
  }

  function hideYeToolTip() {
    tooltipDiv.transition()
      .duration(500)
      .style("opacity", 0);
  }

  function moveToolTipToMouse(event) {
    var xOffset = ($(window).width() - 960) / 2;

    tooltipDiv.style("left", (event.clientX - xOffset) + "px")
      .style("top", (event.clientY + $(window).scrollTop()) + "px");

  }
});

function circleDetailsTemplate($circle) {
  var price = $circle.attr('data-price');
  var remaining = $circle.attr('data-remaining');

  return "Price: " + price + "</br>" + "Quantity: " + remaining;
}

function nodeDetailsTemplate($node) {
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
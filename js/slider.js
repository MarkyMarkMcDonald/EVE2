$(function(){
  // start detecting events when DOM finishes loading
  minAndMaxChangeDetections();
  sliderChangeDetections();
});
/*
  Should update infoviz based on given value
 */
var updateInfoviz = function(currentValue){


  console.log("finished sliding!");
};

var sliderChangeDetections = function() {
  var $currentValue = $('#slider').find('.current-value');

  // Idea for not immediately changing infoviz based on autocomplete defers:
  // http://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up
  var slidingTimer;
  var doneSlidingInterval = 1000;

  $('body').on('change', 'input', function (event) {
    var $this = $(this);
    var currentValue = $this.val();

    $currentValue.text(currentValue);

    clearTimeout(slidingTimer);
    slidingTimer = setTimeout(function(){updateInfoviz(currentValue)}, doneSlidingInterval);

  });
};

// Changes the input's min and max based on editing the content
var minAndMaxChangeDetections = function() {
  var $slider = $('#slider').find('input[type="range"]');

  $('#slider').on('blur', '.min', function(event) {
    var $this = $(this);
    var newMin = parseInt($this.text().trim());
    $this.text(newMin);
    $slider.attr('min', newMin);
  });

  $('#slider').on('blur', '.max', function(event) {
    var $this = $(this);
    var newMax = parseInt($this.text().trim());
    $this.text(newMax);
    $slider.attr('max', newMax);
  });
};

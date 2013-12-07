$(function(){
  // start detecting events when DOM finishes loading
  minAndMaxChangeDetections();
  sliderChangeDetections();
});


var sliderChangeDetections = function() {
  var $currentValue = $('#slider').find('.current-value');

  // Idea for not immediately changing infoviz based on autocomplete defers:
  // http://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up
  var slidingTimer;
  var doneSlidingInterval = 50;
  $('body').on('change', 'input', function (event) {
    var $this = $(this);
    var currentValue = $this.val();
    currentAmount = currentValue;
    $currentValue.text(currentValue);

    clearTimeout(slidingTimer);
    slidingTimer = setTimeout(function(){updateInfoviz()}, 0);
  });
};

// Changes the input's min and max based on editing the content
var minAndMaxChangeDetections = function() {
  var $slider = $('#slider').find('input[type="range"]');

  $('#slider').on('blur', '.min', function(event) {
    var $this = $(this);
    var newMin = parseInt($this.text().trim());
    if (newMin <= 0) {
      newMin = 1;
    }
    $this.text(newMin);
    $slider.attr('min', newMin);
  });

  $('#slider').on('blur', '.max', function(event) {
    var $this = $(this);
    var newMax = parseInt($this.text().trim());
    if (newMax <= 0) {
      newMax = 1;
    }
    $this.text(newMax);
    $slider.attr('max', newMax);
  });
};

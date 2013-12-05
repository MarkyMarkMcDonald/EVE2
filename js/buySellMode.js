$(function(){
  var currentMode = 'Buy';

  var reloadTreemap = function() {
    //TODO
  };

  // on possible change
  $('#trading-mode').on('click', 'button', function(event){
    var $this = $(this);
    // check if there is a change
    if (currentMode != $this.text()) {
      currentMode = $this.text();
      // reload treemap and change slider type if there is a change
      reloadTreemap();
    }
  });
});
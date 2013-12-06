$(function(){
  // on possible change
  $('#trading-mode').on('click', 'button', function(event){
    var $this = $(this);
    // check if there is a change
    if (currentMode != $this.attr('name')) {
      orderType = $this.attr('name');
      // reload treemap and change slider type if there is a change
      updateInfoviz();
    }
  });
});
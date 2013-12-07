$(function(){
  // on possible change
  $('.options').on('click', 'button.sell,button.buy', function(event){
    var $this = $(this);
    // check if there is a change
    if (currentMode != $this.attr('name')) {
      $this.parent('.btn-group').find('.active').removeClass('active');
      $this.addClass('active');
      orderType = $this.attr('name');
      // reload treemap and change slider type if there is a change
      updateInfoviz();
    }
  });
});
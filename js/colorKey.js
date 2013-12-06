$(function(){
  _.each(getColorKeys(0), function(value, index) {
    $('.key-value').eq(index).css({background: value});
  });
});

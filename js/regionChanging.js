$(function(){
  $('body').on('click', '.region', function(event) {
    var name = $(event.target).attr('name');
      currentMode = "system";
      currentRegion = name;
      updateInfoviz();
  });
});


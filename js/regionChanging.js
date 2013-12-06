$(function(){
  $('body').on('click', '.region', function(event) {
    var name = $(event.target).attr('name');
      currentMode = "system";
      currentRegion = name;
     document.getElementById('modeChange').innerHTML = '<button class="mChange" name="ChangeMode">Back</button>';
      updateInfoviz();
  });

  $('#modeChange').on('click', 'button', function(event)
  {
      currentMode = "region";
      document.getElementById('modeChange').innerHTML = "";
      updateInfoviz();
  });

});


function drawColorKeys()
{
  _.each(getColorKeys(paletteNum), function(value, index) {
    $('.key-value').eq(index).css({background: value});
});
}


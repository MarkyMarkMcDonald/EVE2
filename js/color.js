var percentColors = [
  { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0x00 } },
  { pct: 0.5, color: { r: 0xff, g: 0x00, b: 0xff } },
  { pct: 1.0, color: { r: 0x00, g: 0x00, b: 0xff } }
];

var greenColors = [
  { pct: 0.0, color: {r:0x00, g:0x32, b:0x00} },
  { pct: 0.5, color: {r:0x00, g:0x8A, b:0x00} },
  { pct: 1.0, color: {r:0x00, g:0xE1, b:0x00} }
];

function getColorKeys(paletteNum){
  var  i;
  var colorKey = [];
  if (paletteNum == 1) {
    for (i = 10; i >= 0; i--) {
      colorKey.push(getColorForPercentage(i / 10, paletteNum));
    }
  } else {
    for (i = 1; i <= 10; i++) {
      colorKey.push(getColorForPercentage(i / 10, paletteNum));
    }
  }
  return colorKey;


}

/**
 * Returns a (css styling) color from two gradients based on a percent - one gradient between low + mid and one between mid + high
 * Taken from: http://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage
 */
var getColorForPercentage = function(pct, paletteNum) {
  var colorArray = paletteNum == 0 ? percentColors : greenColors;

  if(pct == 0)
    {
        pct = 0.0001;
    }
  for (var i = 0; i < colorArray.length; i++) {
    if (pct <= colorArray[i].pct) {
      var lower = colorArray[i - 1];
      var upper = colorArray[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
      // or output as hex if preferred
    }
  }
};
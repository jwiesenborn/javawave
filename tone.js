// title: volume shape
// author: jesse wiesenborn
// date: 3/16/2019
// version 0.3

// Global constants and objects
var samplingRate = 44100;
var bitDepth = 65535 / 2;
var durationInSeconds = 8;
var lpcm16 = new Int16Array(samplingRate * durationInSeconds);

//
// Calculate a sound wave with decreasing amplitude in a signed
// 16-bit array, then save it to a PCM data file.
//
function dietCalc() {
  var frequency = 440.00; //hertz of the note to play
  var volume = 0.01; //volume is a multiplier between 0 and 1 (webaudio)
  var duration = lpcm16.length;
  
  var uBound = 442.55;
  var lBound = 437.47;  
  var upDif = uBound - frequency;
  var lowDif = lBound - frequency;
  
  for (i = 0; i < duration; i++) {
    var changePitch = i / duration;
    var a = pumpkinWave(i, frequency);
    //var b = pumpkinWave(i, frequency - changePitch(lowDif));
    
    var v = volumeShape(i, duration);
    //console.log(v);
    lpcm16[i] = a * v;
    }
  //download('triad.pcm',signedInt16ArrayToUnsigned(lpcm16)); 
}

//
function changePitch() {


}

//
//
function volumeShape(i, duration) {
  var v = (Math.cos(Math.PI * i / duration * .5));
  return v;
}

//
//
//
function pumpkinWave(i, frequency) {
  var a = (Math.sin((Math.PI * 2 * i * frequency) / (samplingRate)) ) * bitDepth; 
  return a;
}

// Initialize the canvas and brush objects
var canvas = document.getElementById("dietCanvas");
var brush = canvas.getContext("2d");
//var drawX = 0;
//var drawY = 0;
var canWidth = parseInt(canvas.width);
var canHeight = parseInt(canvas.height / 2);
//alert(beginX + ', ' + beginY);
var graphX = 0;
var graphY = 0;

///////////////////////////////////////
dietCalc(); // calculate equation array
///////////////////////////////////////

drawWave();
// Draw the equation onto the canvas
function drawWave() {
  brush.beginPath();
  brush.lineWidth = '1';
  var lineLength = lpcm16.length;
  var delta = lineLength / canWidth;
  brush.moveTo(0, canHeight + lpcm16[0]);
  for (x = 0; x < canWidth; x++) {
    var dx = parseInt(x * delta);
    var drawX = x;
    var drawY = parseInt((lpcm16[dx] / bitDepth) * canHeight) + canHeight;
    brush.lineTo(drawX, drawY);
    //alert(x + ':' + dx + ': (' + drawX + ', ' + drawY + ')');
  } 
  brush.stroke();
}

//
// Convert a signed 16-bit array to unsigned 16-bit integers,
// then to hexadecimal byte format.
//
function signedInt16ArrayToUnsigned(arr) {
  var returnString = "";
  for (i = 0; i < arr.length; i++) {
    sample = arr[i];
    if (sample >= 0) {
      var r = integerToByte_LittleEndian(sample); }
    else if (sample < 0) {
      sample = sample + 65536; // (16^4)
      var r = integerToByte_LittleEndian(sample); }
    returnString = returnString.concat(r); }
  return returnString; }

//
// Convert one 16-bit integer to hexadecimal bytes, big-endian,
// and append leading %s for the URI stream encoding.
// 
function integerToByte_BigEndian(s) {
  var doubleCheck = s;
  var int4 = s % 16;
  s = parseInt(s / 16);
  var int3 = s % 16;
  s = parseInt(s / 16);
  var int2 = s % 16;
  s = parseInt(s / 16);
  var int1 = s % 16;
  s = parseInt(s / 16); 
  //
  // Make sure the hexadecimal-converted value equals the original value.
  //if (doubleCheck != validate(int1, int2, int3, int4)) {
  //  alert("Failure: integerToByte_BigEndian(" + s + ") != " + validate(int1, int2, int3, int4) + "."); }
  //
  return "%" + intToHex(int1) + intToHex(int2) + "%" + intToHex(int3) + intToHex(int4); }

//
// Convert one 16-bit integer to hexadecimal bytes, little-endian,
// and append leading %s for the URI stream encoding.
// 
function integerToByte_LittleEndian(s) {
  var doubleCheck = s;
  var int1 = s % 16;
  s = parseInt(s / 16);
  var int2 = s % 16;
  s = parseInt(s / 16);
  var int3 = s % 16;
  s = parseInt(s / 16);
  var int4 = s % 16;
  s = parseInt(s / 16); 
  return "%" + intToHex(int2) + intToHex(int1) + "%" + intToHex(int4) + intToHex(int3); }

//
// Convert an integer in the range [0,15] to hexadecimal.
//
function intToHex(n) {
  if (n < 10) {
    if (n >= 0) {
      return n.toString(); }
    else { alert("Error: intToHex(" + n + ")"); } }
  switch (n) {
    case 10:
      var r = "a";
      break;
    case 11:
      var r = "b";
      break;
    case 12:
      var r = "c";
      break;
    case 13:
      var r = "d";
      break;
    case 14:
      var r = "e";
      break;
    case 15:
      var r = "f";
      break;
    default:
      alert("Error: intToHex(" + n + ")");
      break; }
  return r; }
  
//
// Send the data in a URI stream to a downloadable file.
// Source: https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file  
//
function download(filename, data) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:audio/pcm;charset=utf-8,' + data);
  pom.setAttribute('download', filename);
  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event); }
  else {
    pom.click(); } }
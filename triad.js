
// title: chord demo
// author: jesse wiesenborn
// date: 1/27/2019
// version 0.1

//
// Calculate a five-second A triad in a signed
// 16-bit array, then save it to a PCM data file.
//
function demo1() {
  var samplingRate = 44100;
  var bitDepth = 65535 / 2;
  var frequency1 = 440.00;
  var frequency2 = 554.37;
  var frequency3 = 659.26;
  var durationInSeconds = 10;
  var lpcm16 = new Int16Array(samplingRate * durationInSeconds);
  for (i = 0; i < lpcm16.length; i++) {
    lpcm16[i] = (
      (Math.sin((Math.PI * 2 * i * frequency1) / (samplingRate)) / 3 ) + 
      (Math.sin((Math.PI * 2 * i * frequency2) / (samplingRate)) / 3 ) + 
      (Math.sin((Math.PI * 2 * i * frequency3) / (samplingRate)) / 3 )
    ) * bitDepth; }
  download('triad.pcm',signedInt16ArrayToUnsigned(lpcm16)); }

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

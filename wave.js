
// title: wave output test
// author: jesse wiesenborn
// date: 3/25/2019
// version 0.5

// Global constants and objects
var samplingRate = 44100;
var BitsPerSample = 16; //
var bitDepth = 65535 / 2; //((2 ^ BitsPerSample) - 1) / 2;
var durationInSeconds = 8;
var lpcm16 = new Int16Array(samplingRate * durationInSeconds);
var numchannel = 1;

//
// Calculate a note at 440 Hz in a signed
// 16-bit array, then save it to a PCM data file.
//
function dietCalc() {
  var frequency = 440.00; //hertz of the note to play
  var volume = 0.01; //volume is a multiplier between 0 and 1
  var duration = lpcm16.length;
  
  var uBound = 442.55;
  var lBound = 437.47;  
  var upDif = uBound - frequency;
  var lowDif = lBound - frequency;
  
  for (i = 0; i < duration; i++) {
    var changePitch = i / duration;
    //var a = pumpkinWave(i, frequency + changePitch(upDif));
    //var b = pumpkinWave(i, frequency - changePitch(lowDif));
    var c = pumpkinWave(i, frequency);
    //var v = volumeShape(i, duration);
    //console.log(c);
    lpcm16[i] = c; // * v;
    }
  //alert(textTo4Byte_BigEndian());
  //alert(dataChunk);
  var outputFile = wavChunk(lpcm16.length) + fmtChunk() + dataChunk(lpcm16);
  //console.log(outputFile);
  
  //document.write("WAVE chunk = ");
  //document.write(wavChunk(lpcm16.length));
  //document.write("\r\n<br/>");
  //document.write("FMT chunk = ");
  //document.write(fmtChunk());
  //document.write("\r\n<br/>");
  //document.write("DATA chunk = ");
  //document.write(dataChunk(lpcm16));
  
  download('sound.wav', outputFile); 
  
}

//
// WAV File Format Encoding functions
//

// WAVE chunk
// integerToByte_LittleEndian returns a 2-Byte little-endian integer.
// integerTo4Byte_LittleEndian returns 4 bytes etc.
function wavChunk(dtlength) {
  var ChunkID = textTo4Byte_BigEndian("RIFF");
  var ChunkSize = integerTo4Byte_LittleEndian(36 + dtlength);
  var Format = textTo4Byte_BigEndian("WAVE");
  return (ChunkID + ChunkSize + Format);
}

// FORMAT chunk
//
function fmtChunk() {
  var Subchunk1ID = textTo4Byte_BigEndian("fmt ");
  var Subchunk1Size = integerTo4Byte_LittleEndian(16); //PCM
  var AudioFormat = integerToByte_LittleEndian(1); //Uncompressed
  var NumChannels = integerToByte_LittleEndian(numchannel); //Mono
  var SampleRate = integerTo4Byte_LittleEndian(samplingRate);
  var ByteRate = integerTo4Byte_LittleEndian(samplingRate * numchannel * (BitsPerSample/8)); //SampleRate * NumChannels
  var BlockAlign = integerToByte_LittleEndian(numchannel * (BitsPerSample/8));
  var bitsPerSampleEncoded = integerToByte_LittleEndian(BitsPerSample);
  return(Subchunk1ID + Subchunk1Size + AudioFormat + NumChannels + SampleRate + ByteRate + BlockAlign + bitsPerSampleEncoded);
}

// DATA chunk
function dataChunk(dt) {
  var Subchunk2ID = textTo4Byte_BigEndian("data");
  var Subchunk2Size = integerTo4Byte_LittleEndian(dt.length * numchannel * (BitsPerSample/8)); //# of bytes in the array
  //alert("DT length=" + dt.length);
  var Data = signedInt16ArrayToUnsigned(dt);
  return(Subchunk2ID + Subchunk2Size + Data);
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
//var canvas = document.getElementById("dietCanvas");
//var brush = canvas.getContext("2d");
////var drawX = 0;
////var drawY = 0;
//var canWidth = parseInt(canvas.width);
//var canHeight = parseInt(canvas.height / 2);
////alert(beginX + ', ' + beginY);
//var graphX = 0;
//var graphY = 0;

///////////////////////////////////////
//dietCalc(); // calculate equation array
///////////////////////////////////////

//drawWave();
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


// Data chunks are 4 bytes
// Convert one 16-bit integer to hexadecimal bytes, little-endian,
// and append leading %s for the URI stream encoding.
// 
function integerTo4Byte_LittleEndian(s) {
  //var doubleCheck = s;
  var int1 = s % 16;
  s = parseInt(s / 16);
  var int2 = s % 16;
  s = parseInt(s / 16);
  var int3 = s % 16;
  s = parseInt(s / 16);
  var int4 = s % 16;
  s = parseInt(s / 16); 
  var int5 = s % 16;
  s = parseInt(s / 16);
  var int6 = s % 16;
  s = parseInt(s / 16);
  var int7 = s % 16;
  s = parseInt(s / 16);
  var int8 = s % 16;
  s = parseInt(s / 16); 
  return "%" + intToHex(int2) + intToHex(int1) + "%" + intToHex(int4) + intToHex(int3)  
  + "%" + intToHex(int6) + intToHex(int5) + "%" + intToHex(int8) + intToHex(int7);
  }


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

//File format blocks are two to four bytes.
//Convert a 4-character string to 4 bytes, big-endian
//Insert % sign for URI encoding.
function textTo4Byte_BigEndian(t) {
  t3 = t.charCodeAt(3);
  t2 = t.charCodeAt(2);
  t1 = t.charCodeAt(1);
  t0 = t.charCodeAt(0);
  
  //console.log(t3 + ';' + t2 + ';' + t1 + ';' + t0);

  var int8 = t3 % 16;
  t3 = parseInt(t3 / 16);
  var int7 = t3 % 16;
  t3 = parseInt(t3 / 16);
  var int6 = t2 % 16;
  t2 = parseInt(t2 / 16);
  var int5 = t2 % 16;
  t2 = parseInt(t2 / 16); 
  var int4 = t1 % 16;
  t1 = parseInt(t1 / 16);
  var int3 = t1 % 16;
  t1 = parseInt(t1 / 16);
  var int2 = t0 % 16;
  t0 = parseInt(t0 / 16);
  var int1 = t0 % 16;
  t0 = parseInt(t0 / 16); 
  
  return "%" + intToHex(int1) + intToHex(int2) + "%" + intToHex(int3) + intToHex(int4) 
  + "%" + intToHex(int5) + intToHex(int6) + "%" + intToHex(int7) + intToHex(int8); 
}



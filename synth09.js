
// synthesis of a sigh
// jesse wiesenborn
// date: 5/13/2019
// version 0.9

//Open a source XML file
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    dpmFunction(this);
    }
};

// jamie parsely
// kyle vanderburg
xhttp.open("GET", "A_Sigh_2019-e.xml", true); //comment
xhttp.send();

//xhttp.open("GET", "A_Sigh_20180125-b.xml", true);
//xhttp.send();

//var songDuration = 0; //initialize song duration var with global scope //deprecated

//Parse file with XML DOM object
function dpmFunction(xml) {

    var xmlDoc = xml.responseXML;
    var txt = "";
    var txt2 = "";
    
    //var lpcm16 = new Int16Array(169267);
    
	//What is the duration of the whole song? 173 beats
	// = 6731736 samples
	
    var lpcm16voice1ch1 = new Int16Array(6731736);
    var lpcm16voice1ch2 = new Int16Array(6731736);
    var lpcm16voice1ch3 = new Int16Array(6731736);
    var lpcm16voice2ch1 = new Int16Array(6731736);
    var lpcm16voice2ch2 = new Int16Array(6731736);
    var lpcm16voice2ch3 = new Int16Array(6731736);
    var lpcm16voice3 = new Int16Array(6731736);
	
	
	
    //lpcm16.set(makeNote(440.00, noteDuration), 0);
    //lpcm16.set(makeNote(493.88, noteDuration), noteDuration - 1);
    //lpcm16.set(makeNote(554.37, noteDuration), (noteDuration * 2) - 2);
    //lpcm16.set(makeNote(587.33, noteDuration), (noteDuration * 3) - 3);
    //lpcm16.set(makeNote(659.26, noteDuration), (noteDuration * 4) - 4);
    
    //Find parts
    var parts = xmlDoc.getElementsByTagName("part"); ////
  for (i = 0; i < parts.length; i++) { // For each part
    txt += "Part=" + parts[i].id + "<br>";
	txt2 += "part " + i + "<br/>";
      
    //For today we will focus on part P2.
    if (parts[i].id == 'P2') {
        var measureIndex = 0;
       
        var noteIndex1ch1 = 1;
		var noteIndex1ch2 = 1;
		var noteIndex1ch3 = 1;
	    var noteIndex2ch1 = 1;
		var noteIndex2ch2 = 1;
		var noteIndex2ch3 = 1;
	    var noteIndex3 = 1;
       
        var xNode = parts[i].childNodes;
		var qqq = xNode.length;
		txt2 += "Nodes count=" + qqq + "<br/>";
		 
	    for (j = 0; j < qqq; j++) { // For each part child-node,
	      txt2 += "start node " + j + "<br/>";
	      if (xNode[j].nodeName == 'measure') { // if measure
		  
	        var measure = xNode[j].childNodes;
	        txt += "measure: ";
	        txt2 += "start measure: <br/>";
	        measureIndex = measureIndex + 1;
			
			document.getElementById("XMLconsole").innerHTML = "Computing a sigh, measure " + measureIndex + "...";
			
	        console.log("Measure " + measureIndex + "...<br/>");
	        var chordIndex = 1;
	        var noteVoice = -1;
			var chordDuration = 0;
	        for (k = 0; k < measure.length; k++) { // for each measure sub-element
	          
			  //console.log("Indexes (" + noteIndex1ch1 + "," + noteIndex1ch2 + "," + noteIndex1ch3 + "), (" + noteIndex2ch1 + "," + noteIndex2ch2 + "," + noteIndex2ch3 + "), " + noteIndex3);
			  
	            if (measure[k].nodeName == 'note') { // if note
	                var note = measure[k].childNodes;
	                var noteFrequency = -1;
	                var noteOctave = -1;
	                var noteDuration = -1;
	                
					
	                var isChord = "";
	                var isRest = false;
	                
	                txt += "note: {";
	                for (l = 0; l < note.length; l++) { // For each note child element
	                    
	                    if (note[l].nodeName == 'pitch') {
	                        var pitch = note[l].childNodes;
	                        
	                        for (m = 0; m < pitch.length; m++) {
	                            if (pitch[m].nodeName == 'step') {
	                                txt += "step: ";
	                                var step = pitch[m].innerHTML;
	                                txt += step;
	                                txt += "; ";
	                                
	                                noteFrequency = stepToFrequency(step);
	                                
	                            }
	                            else if (pitch[m].nodeName == 'alter') {
	                                txt += "alter: ";
	                                var alter = pitch[m].innerHTML;
	                                txt += alter;
	                                txt += "; ";
	                                
	                                if (noteFrequency > -1) {
	                                  if (alter == "-1") {
	                                    noteFrequency = noteFrequency * (Math.pow(2, (-1 / 12)));
	                                    }
	                                  else if (alter == "+1") {
	                                    noteFrequency = noteFrequency * (Math.pow(2, (1 / 12)));
	                                  }
	                                }
	                                else if (noteFrequency == -1) { alert("ERR: note altered before step defined."); }
	                            }
	                            else if (pitch[m].nodeName == 'octave') {
	                                txt += "octave: ";
	                                var pitch = pitch[m].innerHTML;
	                                txt += pitch;
	                                txt += "; ";
	                                
	                                noteOctave = parseInt(pitch);
	                                
	                                if (noteFrequency > -1) {
	                                  noteFrequency = frequencyOctave(noteFrequency, noteOctave);
	                                }
	                                else if (noteFrequency == -1) { alert("ERR: octave defined before step."); }
	                            }
	                            
	                        } // end for each pitch
	                    
	                    } // end if element is Pitch
	                    
	                    else if (note[l].nodeName == 'voice') {
	                        txt += "voice: ";
	                        var noteType = note[l].innerHTML;
	                        txt += noteType;
							txt += "; ";
				
							noteVoice = noteType;
	                    }
	                    else if (note[l].nodeName == 'duration') {
	                        txt += "duration: ";
	                        var noteType = note[l].innerHTML;
	                        txt += noteType;
							txt += "; ";
							var noteDurInt = parseInt(noteType);
							//songDuration += noteDuration; //deprecated
							
							//Tempo = 68 beats (quarter notes) per minute = (68/60) beats per second
							//"Duration" in the score is defined as 256 units per quarter note.
							//This is an arbitrary measure that we need to convert to samples per "duration"
							// = 152 samples per "duration"
							
							noteDuration = noteDurInt * 152;
				
	                    }
	                    else if (note[l].nodeName == 'rest') {
	                        txt += "rest; ";
	                        
	                        noteOctave = 0;
	                        noteFrequency = 0;
	                        isRest = true;
	                        
	                    }
	                    else if (note[l].nodeName == 'chord') {
	                        txt += "chord; ";
	                        isChord = "yes";
	                        chordIndex++;
	                        //noteOctave = 0;
	                        //noteFrequency = 0;
	                    }
	                    //txt += note[l].nodeValue + "<br>";
	                    //txt += "<br>";
	                    
	                } // end for each note child element
	                
	                //if it's not in a chord, then reset chord index
	                if (isChord != "yes") {
	                   var chordIndex = 1;
					   chordDuration = 0;
	                }
	                
	                txt += "} ";
	                
	                //makeNote(noteFrequency, noteDuration, voice)
				   if (chordIndex < 4) { // hard limit 3 notes per chord this time
	                        
	                if ((noteFrequency > -1) && (noteOctave > -1) && (noteDuration > -1)) {
					 //console.log("set voice" + noteVoice + "ch" + chordIndex + " = " + ((noteDuration * noteIndex1ch1) - noteIndex1ch1));
	                   if (noteVoice == 1) {
	                     if (chordIndex == 1) {
						  //console.log("set voice" + noteVoice + "ch" + chordIndex + " = " + ((noteDuration * noteIndex1ch1) - noteIndex1ch1));
	                      lpcm16voice1ch1.set(makeNote(noteFrequency, noteDuration, noteVoice, chordIndex), noteIndex1ch1 - 1);
	                      noteIndex1ch1 += noteDuration - 1;
						  //If it's a rest, then it's not in a chord.
	                      //Duplicate voice for each channel
						  if (isRest) {
	                         lpcm16voice1ch2.set(makeNote(noteFrequency, noteDuration, noteVoice, 2), noteIndex1ch2 - 1);
	                         lpcm16voice1ch3.set(makeNote(noteFrequency, noteDuration, noteVoice, 3), noteIndex1ch3 - 1); 
	                         
	                         noteIndex1ch2 += noteDuration - 1;
	                         noteIndex1ch3 += noteDuration - 1;
						   }
						   
						   // I found in the example that a lot of chords had longer first notes
						   // than the second and third note in the chord.
						   // Maybe this will correct it
						   chordDuration = noteDuration;
	                     }
	                    else if (chordIndex == 2) {
							if (noteDuration < chordDuration) {noteDuration = chordDuration; } // adjust for weird chords
							//console.log("set voice" + noteVoice + "ch" + chordIndex + " = " + ((noteDuration * noteIndex1ch2) - noteIndex1ch2));
	                      	 lpcm16voice1ch2.set(makeNote(noteFrequency, noteDuration, noteVoice, chordIndex), noteIndex1ch2 - 1);
						     noteIndex1ch2 += noteDuration - 1;
						}
						else if (chordIndex == 3) {
							 if (noteDuration < chordDuration) {noteDuration = chordDuration; } // adjust for weird chords
	                      	 lpcm16voice1ch3.set(makeNote(noteFrequency, noteDuration, noteVoice, chordIndex), noteIndex1ch3 - 1);
						     noteIndex1ch3 += noteDuration - 1;
						}
					   } // end if voice=1
	                   else if (noteVoice == 2) {
						 if (chordIndex == 1) {
	                      lpcm16voice2ch1.set(makeNote(noteFrequency, noteDuration, noteVoice, chordIndex), noteIndex2ch1 - 1);
	                      noteIndex2ch1 += noteDuration - 1;
						  if (isRest) {
	                         lpcm16voice2ch2.set(makeNote(noteFrequency, noteDuration, noteVoice, 2), noteIndex2ch2 - 1);
	                         lpcm16voice2ch3.set(makeNote(noteFrequency, noteDuration, noteVoice, 3), noteIndex2ch3 - 1); 
	                         
	                         noteIndex2ch2 += noteDuration - 1;
							 noteIndex2ch3 += noteDuration - 1;
						   }
						   chordDuration = noteDuration;
	                     }
					     else if (chordIndex == 2) {
							 if (noteDuration < chordDuration) {noteDuration = chordDuration; } // adjust for weird chords
	                      	 lpcm16voice2ch2.set(makeNote(noteFrequency, noteDuration, noteVoice, chordIndex), noteIndex2ch2 - 1);
						     noteIndex2ch2 += noteDuration - 1;
						 }
						 else if (chordIndex == 3) {
							 if (noteDuration < chordDuration) {noteDuration = chordDuration; } // adjust for weird chords
	                      	 lpcm16voice2ch3.set(makeNote(noteFrequency, noteDuration, noteVoice, chordIndex), noteIndex2ch3 - 1);
						     noteIndex2ch3 += noteDuration - 1;
						 }	  
					   } // end if voice = 2
	                   else if (noteVoice == 3) {
	                      lpcm16voice3.set(makeNote(noteFrequency, noteDuration, noteVoice, chordIndex), noteIndex3 - 1);
	                      noteIndex3 += noteDuration - 1;
	                   }
	                     
	                }
	                else {
	                  //txt2 += "anomaly<br/>";
	                
	                }
				   	
	                
	                txt2 += "m" + measureIndex + ":note(noteVoice=" + noteVoice + ", noteFrequency=" + noteFrequency + ", noteDuration=" + noteDuration + ", ch=" + chordIndex + ", isRest=" + isRest + ")<br/>";
	               } 
	                ///lpcm16.set(makeNote(659.26, noteDuration), (noteDuration * 4) - 4);
	            } // end if node is a note
	            
	        } // end for each measure node
	        txt += "<br>";
	        txt2 += "end measure";
	    } // end if the node is a measure
	    
		 txt2 += "end node " + j + "<br/>";
		} // end for each part-node
       
	    console.log("almost done...");
		
	    //add all parts together
		//document.getElementById("XMLconsole").innerHTML += "<br/>Merging chords...";
	    //var lpcm16all = new Int16Array(6731736);
		//var v1c1 = new Int16Array(0);
		//var v1c2 = new Int16Array(0);
		//var v1c3 = new Int16Array(0);
		//var v2c1 = new Int16Array(0);
		//var v2c2 = new Int16Array(0);
		//var v2c3 = new Int16Array(0);
		//var v3 = new Int16Array(0);
			
		//for (z = 0; z < 6731736; z++) {
		//	//if ((z % 67317) == 0) { console.log("Percent complete: " + (z % 67317) + "%"); }
		//	v1c1.set(lpcm16voice1ch1[z], 0);
		//	v1c2.set(lpcm16voice1ch2[z], 0);
		//	v1c3.set(lpcm16voice1ch3[z], 0);
		//	v2c1.set(lpcm16voice2ch1[z], 0);
		//	v2c2.set(lpcm16voice2ch2[z], 0);
		//	v2c3.set(lpcm16voice2ch3[z], 0);
		//	v3.set(lpcm16voice3[z], 0);
		//	//console.log(lpcm16voice1ch1[z]);
		//	var ztotal = new Int16Array(0);
		//	ztotal.set(parseInt((v1c1[0] / 7) + (v1c2[0] / 7) + (v1c3[0] / 7) + (v2c1[0] / 7) + (v2c2[0] / 7) + (v2c3[0] / 7) + (v3[0] / 7)));
		//	//var dbyte = parseInt(ztotal);
		//	
		//	lpcm16all.set(ztotal[0], z);
		//}
	   
	    //Ran into problems accessing the 16bit arrays to sum them, so downloading piecewise for now
	    document.getElementById("XMLconsole").innerHTML += "<br/>Encoding for WAV..."; 
        var outputFile1 = wavChunk(lpcm16voice1ch1.length) + fmtChunk() + dataChunk(lpcm16voice1ch1);
        //var outputFile2 = wavChunk(lpcm16voice1ch2.length) + fmtChunk() + dataChunk(lpcm16voice1ch2);
        //var outputFile3 = wavChunk(lpcm16voice1ch3.length) + fmtChunk() + dataChunk(lpcm16voice1ch3);
        //var outputFile4 = wavChunk(lpcm16voice2ch1.length) + fmtChunk() + dataChunk(lpcm16voice2ch1);
        //var outputFile5 = wavChunk(lpcm16voice2ch2.length) + fmtChunk() + dataChunk(lpcm16voice2ch2);
        //var outputFile6 = wavChunk(lpcm16voice2ch3.length) + fmtChunk() + dataChunk(lpcm16voice2ch3);
        //var outputFile7 = wavChunk(lpcm16voice3.length) + fmtChunk() + dataChunk(lpcm16voice3);
		
		document.getElementById("XMLconsole").innerHTML += "<br/>Sending to download..."; 
        download('sigh1.wav', outputFile1);
        //download('sigh2.wav', outputFile2);
        //download('sigh3.wav', outputFile3);
        //download('sigh4.wav', outputFile4);
        //download('sigh5.wav', outputFile5);
        //download('sigh6.wav', outputFile6);
        //download('sigh7.wav', outputFile7);
		
        
        //document.getElementById("XMLconsole").innerHTML += txt2; 
        //document.getElementById("XMLconsole").innerHTML += "<br/><br/><br/>"; 
        //document.getElementById("XMLconsole").innerHTML += txt; 
        
       } // end if part=P2
	 txt2 += "end part " + i + "<br/>";  
	 //document.getElementById("XMLconsole").innerHTML = txt2;
  } // end for each part
}// end function

// Convert a step {A-G} to Frequency in hertz
// assuming octave 4
// Update: Scientific notation octaves are {C-B}
// https://en.wikipedia.org/wiki/Scientific_pitch_notation
var fundamentalFrequency = 440.0000000000; // define base frequency
function stepToFrequency(s) {
  
  var f = 0.000;
  switch(s.toUpperCase()) {
  case "C":
    //f = 261.626;
	f = fundamentalFrequency * Math.pow(2, (-9/12));
    break;
  case "D":
    //f = 293.665;
	f = fundamentalFrequency * Math.pow(2, (-7/12));
    break;
  case "E":
    //f = 329.628;
	f = fundamentalFrequency * Math.pow(2, (-5/12));
    break;
  case "F":
    //f = 349.228;
	f = fundamentalFrequency * Math.pow(2, (-4/12));
    break;
  case "G":
    //f = 391.995;
	f = fundamentalFrequency * Math.pow(2, (-2/12));
    break;
  case "A":
    f = fundamentalFrequency; // * Math.pow(2, (0/12));
    break;
  case "B":
    //f = 493.883;
	f = fundamentalFrequency * Math.pow(2, (2/12));
    break;
  default: 
  } 
  
 return f;
}


function frequencyOctave(f, o) {
  switch(o) {
  case 0:
    f = f / 16;
    break;
  case 1:
    f = f / 8;
    break;
  case 2:
    f = f / 4;
    break;
  case 3:
    f = f / 2;
    break;
  case 4:
    f = f;
    break;
  case 5:
    f = f * 2;
    break;
  case 6:
    f = f * 4;
    break;
  case 7:
    f = f * 8;
    break;
  case 8:
    f = f * 16;
    break;
  default:
    f = f;
    break;
  }
  
  return f;
}
    
//document.getElementById("XMLconsole").innerHTML = "Part P2 Duration per voice: " + (songDuration / 3) + "<br/>";
//document.getElementById("XMLconsole").innerHTML += "Quarter note = 256 duration units<br/>";
//document.getElementById("XMLconsole").innerHTML += "Tempo: Quarter note = 68 beats per minute = 68 quarter notes per minute = " + (68 / 60) + " quarter notes per second = " + (60 / 68) + " seconds per quarter note<br/>";
//document.getElementById("XMLconsole").innerHTML += "Song duration = " + ((songDuration / 3) / 256) + " quarter notes = " + (((songDuration / 3) / 256) * (60 / 68)) + " seconds = " + ((((songDuration / 3) / 256) * (60 / 68)) / 60) + " minutes long<br/>";
//document.getElementById("XMLconsole").innerHTML += "Samples = " + (((((songDuration / 3) / 256) * (60 / 68)) / 60) * 44100) + "<br/>";
//document.getElementById("XMLconsole").innerHTML += txt; 
//} //?


// Global constants and objects
var samplingRate = 44100; // samples per second
var BitsPerSample = 16; //
var bitDepth = 65535 / 2; //((2 ^ BitsPerSample) - 1) / 2;
var durationInSeconds = 230.2941176470588;
//var lpcm16 = new Int16Array(samplingRate * durationInSeconds);
//is lpcm16 ever accessed outside of the global scope? only in drawWave( )for the canvas.
var numchannel = 1;

//var global_y_Offset = 0.000000; //vertical offset between notes
//var global_direction = ""; //plus-or-minus semaphore

//For three voices
//and three CH within voices 1 and 2
var global_y_Offset1ch1 = 0.000000;
var global_direction1ch1 = "";
var global_y_Offset1ch2 = 0.000000;
var global_direction1ch2 = "";
var global_y_Offset1ch3 = 0.000000;
var global_direction1ch3 = "";

var global_y_Offset2ch1 = 0.000000;
var global_direction2ch1 = "";
var global_y_Offset2ch2 = 0.000000;
var global_direction2ch2 = "";
var global_y_Offset2ch3 = 0.000000;
var global_direction2ch3 = "";

var global_y_Offset3 = 0.000000;
var global_direction3 = "";

//
// Compute an XML sequence into a signed
// 16-bit array, then save it to a PCM data file.
//
function dietCalc() {
  var frequency = 0.00; //440.00; //hertz of the note to play
  //var volume = 0.01; //volume is a multiplier between 0 and 1
  var songDuration = lpcm16.length;
  
  //quarter note = 68 beats per minute
  var tempo = 100 / 60; //beats per second
  //var noteDuration = samplingRate / tempo; //number of samples for one note at tempo
  
  //initialize
  var xOffset = 0; //temporal offset for notes in a sequence

  //for (i = 0; i < songDuration; i++) {
    //var changePitch = i / duration;
    //var a = pumpkinWave(i, frequency + changePitch(upDif));
    //var b = pumpkinWave(i, frequency - changePitch(lowDif));
	
  
  var lpcm16 = new Int16Array(169267);
	
  lpcm16.set(makeNote(440.00, noteDuration), 0);
  lpcm16.set(makeNote(493.88, noteDuration), noteDuration - 1);
  lpcm16.set(makeNote(554.37, noteDuration), (noteDuration * 2) - 2);
  lpcm16.set(makeNote(587.33, noteDuration), (noteDuration * 3) - 3);
  lpcm16.set(makeNote(659.26, noteDuration), (noteDuration * 4) - 4);
  
  //  }

  
  var outputFile = wavChunk(lpcm16.length) + fmtChunk() + dataChunk(lpcm16);
  download('sigh.wav', outputFile); 
  
}

//compute one note given the parameters Frequency, Duration, Voice {1-3}, Ch{1-3}
function makeNote(noteFrequency, noteDuration, voice, chIndex) {
  //console.log("making note, freq=" + noteFrequency + ", dur=" + noteDuration + ", voice=" + voice + ", ch=" + chIndex + ".<br/>");

  var noteArray = new Int16Array(noteDuration); // array for one note	
  var xOffset = 0;
  
  if (voice == 1) {
    if (chIndex == 1) {
      var yOffset = global_y_Offset1ch1; 
        if (global_direction1ch1 == "+") {
          xOffset = 1;
	  }
        else if (global_direction1ch1 == "-") {
          xOffset = -1;
	  }
        else {
          xOffset = 1;
      }
    }
    if (chIndex == 2) {
      var yOffset = global_y_Offset1ch2; 
        if (global_direction1ch2 == "+") {
          xOffset = 1;
	  }
        else if (global_direction1ch2 == "-") {
          xOffset = -1;
	  }
        else {
          xOffset = 1;
      }
    }
    if (chIndex == 3) {
      var yOffset = global_y_Offset1ch3; 
        if (global_direction1ch3 == "+") {
          xOffset = 1;
	  }
        else if (global_direction1ch3 == "-") {
          xOffset = -1;
	  }
        else {
          xOffset = 1;
      }
    }
  }  
  else if (voice == 2) {
    if (chIndex == 1) {
      var yOffset = global_y_Offset2ch1; 
        if (global_direction2ch1 == "+") {
          xOffset = 1;
	  }
        else if (global_direction2ch1 == "-") {
          xOffset = -1;
	  }
        else {
          xOffset = 1;
      }
    }
    if (chIndex == 2) {
      var yOffset = global_y_Offset2ch2; 
        if (global_direction2ch2 == "+") {
          xOffset = 1;
	  }
        else if (global_direction2ch2 == "-") {
          xOffset = -1;
	  }
        else {
          xOffset = 1;
      }
    }
    if (chIndex == 3) {
      var yOffset = global_y_Offset2ch3; 
        if (global_direction2ch3 == "+") {
          xOffset = 1;
	  }
        else if (global_direction2ch3 == "-") {
          xOffset = -1;
	  }
        else {
          xOffset = 1;
      }
    }
  }
  else if (voice == 3) {
    var yOffset = global_y_Offset3; 
      if (global_direction3 == "+") {
        xOffset = 1;
	}
      else if (global_direction3 == "-") {
        xOffset = -1;
	}
      else {
        xOffset = 1;
      }	
    }
  
//  if (global_direction1 == "+") {
//    xOffset = 1;
//	}
//  else if (global_direction1 == "-") {
//    xOffset = -1;
//	}
//  else {
//    xOffset = 1;
//    }	
	
  //console.log(noteFrequency, xOffset, yOffset);	
  for (x = 0; x < noteDuration; x++) {
    
    var c = pumpkinWave(x, noteFrequency, xOffset, yOffset);
    noteArray[x] = c; // * v;
  }
  
  //set global semaphores for curve smoothening
  if (voice == 1) {
	  if (chIndex == 1) {
		global_direction1ch1 = determineUpOrDown(noteArray[x-2], noteArray[x-1]);
		global_y_Offset1ch1 = noteArray[x-1] / bitDepth;
		//console.log('slope1 ' + global_direction1);
		//console.log('offset1=' + global_y_Offset1 + '; asin(offset1)=' + Math.asin(global_y_Offset1));
		}
	  if (chIndex == 2) {
		global_direction1ch2 = determineUpOrDown(noteArray[x-2], noteArray[x-1]);
		global_y_Offset1ch2 = noteArray[x-1] / bitDepth;
	  }
	  if (chIndex == 3) {
		global_direction1ch3 = determineUpOrDown(noteArray[x-2], noteArray[x-1]);
		global_y_Offset1ch3 = noteArray[x-1] / bitDepth;
	  }
  }
  else if (voice == 2) {
	  if (chIndex == 1) {
        global_direction2ch1 = determineUpOrDown(noteArray[x-2], noteArray[x-1]);
        global_y_Offset2ch1 = noteArray[x-1] / bitDepth;
        //console.log('slope2 ' + global_direction2);
        //console.log('offset2=' + global_y_Offset2 + '; asin(offset2)=' + Math.asin(global_y_Offset2));
	  }
	  if (chIndex == 2) {
		global_direction2ch2 = determineUpOrDown(noteArray[x-2], noteArray[x-1]);
		global_y_Offset2ch2 = noteArray[x-1] / bitDepth;
	  }
	  if (chIndex == 3) {
		global_direction2ch3 = determineUpOrDown(noteArray[x-2], noteArray[x-1]);
		global_y_Offset2ch3 = noteArray[x-1] / bitDepth;
	  }
    }
  else if (voice == 3) {
    global_direction3 = determineUpOrDown(noteArray[x-2], noteArray[x-1]);
    global_y_Offset3 = noteArray[x-1] / bitDepth;
    //console.log('slope3 ' + global_direction3);
    //console.log('offset3=' + global_y_Offset3 + '; asin(offset3)=' + Math.asin(global_y_Offset3));
  }
    
  return noteArray;
}

//See whether a curve is sloping upwards or downwards given two samples
function determineUpOrDown(a, b) {
  var dir = "";
  if (b > a) { // if the last two samples in the note are increasing, then the curve is going up.
	dir = "+";
  }
  else if (b < a) { // if the last two samples in the note are decreasing, then the curve is going down.
	dir = "-";
  }
  else if (a == b) { //If there is no curve, chances are the point is at the top or bottom of a curve...
	if (a > 0) { // so if it's above zero then the curve is probably going downward
	  dir = "-";
	}
	else if (a < 0) { // and if it's below zero then the curve is probably going upward
	  dir = "+";
	}
  }
  //console.log("a=" + a + ", b=" + b + ", dir=" + dir);
  return dir;
}

//
//
function volumeShape(i, duration) {
  var v = (Math.cos(Math.PI * i / duration * .5));
  return v;
}

//
// demo
//
function pumpkinWave(i, frequency, xOffset, yOffset) {
  //var a = (Math.sin(((Math.PI * 2 * i * frequency) + (Math.asin(yOffset) * samplingRate) ) / samplingRate) ) * bitDepth; 
  var a = (Math.sin(((Math.PI * 2 * i * frequency) + (xOffset * (Math.asin(yOffset) * samplingRate))) / samplingRate) ) * xOffset * bitDepth; 
  return a;
}

//function pumpkinWave1(i, frequency, xOffset, yOffset) {
//  var a = (Math.sin(((Math.PI * 2 * i * frequency) + (Math.asin(yOffset) * samplingRate) ) / samplingRate) ) * bitDepth; 
//  //var a = (Math.sin(((Math.PI * 2 * i * frequency) + (xOffset * (Math.asin(yOffset) * samplingRate))) / samplingRate) ) * xOffset * bitDepth; 
//  return a;
//}

//function pumpkinWave2(i, frequency, xOffset, yOffset) {
//  //var a = (Math.sin(((Math.PI * 2 * i * frequency) + (Math.asin(yOffset) * samplingRate) ) / samplingRate) ) * bitDepth; 
 // var a = (Math.sin(((Math.PI * 2 * i * frequency) + (xOffset * (Math.asin(yOffset) * samplingRate))) / samplingRate) ) * xOffset * bitDepth; 
//  return a;
//}
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
  pom.setAttribute('href', 'data:audio/wav;charset=utf-8,' + data);
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
 
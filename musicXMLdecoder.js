
// title: musicXML decoder
// author: jesse wiesenborn
// date: 4/20/2019
// version 0.7

//Open a source XML file
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    dpmFunction(this);
    }
};
xhttp.open("GET", "A_Sigh_20180125-b.xml", true);
xhttp.send();

//Parse file with XML DOM object
function dpmFunction(xml) {

    var xmlDoc = xml.responseXML;
    var txt = "";
    
    //Find parts
    var parts = xmlDoc.getElementsByTagName("part");
    for (i = 0; i < parts.length; i++) {
      //txt += parts[i].childNodes[0].nodeValue + "<br>";
      txt += parts[i].id + "<br>";
      
      
        //x = xmlDoc.documentElement.childNodes;
        x = parts[i].childNodes;
	for (j = 0; j < x.length; j++) {
	    //txt += x[j].nodeName + ": <br>";// + x[j].childNodes[0].nodeValue + "<br>";
	    if (x[j].nodeName == 'measure') {
	        var measure = x[j].childNodes;
	        txt += "measure: ";
	        for (k = 0; k < measure.length; k++) {
	            //txt += measure[k].nodeName + ": ";
	            //txt += measure[k].nodeValue + "<br>";
	            if (measure[k].nodeName == 'note') {
	                var note = measure[k].childNodes;
	                txt += "note: {";
	                for (l = 0; l < note.length; l++) {
	                    //txt += note[l].nodeName + ": ";
	                    
	                    if (note[l].nodeName == 'pitch') {
	                        //txt += "pitch: ";
	                        var pitch = note[l].childNodes;
	                        
	                        for (m = 0; m < pitch.length; m++) {
	                            if (pitch[m].nodeName == 'step') {
	                                txt += "step: ";
	                                txt += pitch[m].innerHTML;
	                                txt += "; ";
	                            }
	                            else if (pitch[m].nodeName == 'alter') {
	                                txt += "alter: ";
	                                txt += pitch[m].innerHTML;
	                                txt += "; ";
	                            }
	                            else if (pitch[m].nodeName == 'octave') {
	                                txt += "octave: ";
	                                txt += pitch[m].innerHTML;
	                                txt += "; ";
	                            }
	                            
	                        }
	                        //txt += "; ";
	                        //txt += pitch[0].nodeName + ": "
	                        //txt += pitch[0].nodeValue;// + "<br>";
	                    
	                    }
	                    //else if (note[l].nodeName == 'type') {
	                    //    txt += "type: ";
	                    //    var noteType = note[l].innerHTML;
	                    //    txt += noteType;
				//txt += "; ";
	                    //}
	                    else if (note[l].nodeName == 'voice') {
	                        txt += "voice: ";
	                        var noteType = note[l].innerHTML;
	                        txt += noteType;
				txt += "; ";
	                    }
	                    else if (note[l].nodeName == 'duration') {
	                        txt += "duration: ";
	                        var noteType = note[l].innerHTML;
	                        txt += noteType;
				txt += "; ";
	                    }
	                    else if (note[l].nodeName == 'rest') {
	                        txt += "rest; ";
	                    }
	                    //txt += note[l].nodeValue + "<br>";
	                    //txt += "<br>";
	                }
	                txt += "} ";
	            }
	        }
	        //txt += x[j].type + "<br>";
	        txt += "<br>";
	    }
	    
	}
      
    }
    
document.getElementById("XMLconsole").innerHTML = txt; 
}

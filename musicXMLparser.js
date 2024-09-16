//
// musicXML sequencer
// Jesse Wiesenborn
// Version 0.2
// 2018
//
// I wrote this in my senior year of college for a computer science/music project
// in collaboration with Dr Kyle Vanderburg. Its objective was to compare two 
// musicXML files, then display the similarities and differences between the files.
// Here I have rewritten and simplified the code to read only one musicXML file
// and use its measure sequencing functionality for playback with the JavaScript
// audio synthesizer at diet pumpkin machine.

//initialize XML document object with global scope
var xmlDoc1;

//Starts when this function is called.
//This function is responsible for opening the xml file.
function doComp(musicXMLpath)
{
	//File path of the document to open
	var path1 = musicXMLpath;

	//Semaphore for loading status (When the document is done loading then then begin parsing.)
	var docLoad1 = false;

	//Define the load event listener
	//Resource: https://www.w3schools.com/xml/xml_http.asp
	var xhttp1 = new XMLHttpRequest();
	xhttp1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) { // Wait for document to load
			// Output XML data into document object
			xmlDoc1 = this.responseText;
			//document is done loading
			docLoad1 = true;
			//Call parsing function.
			xmlToArray();
		}
	};

	//Then load the document
	xhttp1.open("GET", path1, true);
	xhttp1.send();
}

//Pipe measures into an array for parsing.
//Resource: https://www.w3schools.com/xml/dom_intro.asp
//Resource: https://www.w3schools.com/xml/xml_parser.asp
//Resource: https://stackoverflow.com/questions/14340894/create-xml-in-javascript
function xmlToArray(){

	//strings for putting the xml back together after done [why?]
	//var xmlReassemble1 = "";

	//needed or unnecessary?
	//parser = new DOMParser();
	//xmlParsed1 = parser.parseFromString(xmlDoc1,"text/xml");

	//Call manual parsing function.
	var measures1 = manualParser(xmlDoc1);

	//The important stuff appears to land in the measureData[] array.
	//Much of the comparison function was here in the first version.
	//Print output to console for testing.
	for (y = 1; y < (measureCount + 1); y++)
	 {
	 var dat = "Part " + measurePartId[y] + ", measure " + measureIndex[y] + ", sequence= " + measureData[y] + '<br/>';
	 document.getElementById("musicXMLoutput").innerHTML += dat;
	  //console.log("Part " + measurePartId[y] + ", measure " + measureIndex[y] + ", sequence = " + measureData[y]);
	 }
}

//instantiate document headers and footers with global scope [why?]
var docHeaders = ""; //everything before the measures begin
var docFooters = ""; //everything after the measures end

//The "Measure" data type arrays to store the parsed information.
//I couldn't get the object types to work so these are just isolated arrays for now.
var measureCount = 0;
var measureHeader = [];
var measureContent = [];
var measureFooter = [];
var measureExtras = [];
var measureIndex = [];
var measurePartId = [];
var measureData = [];
var docHeaders = "";

//The following function parses the serialized XML string into a workable object array.
//Resource: https://www.w3schools.com/js/js_string_methods.asp
//Resource: https://www.w3schools.com/js/js_objects.asp
//Resource: https://stackoverflow.com/questions/41252613/what-is-the-best-way-to-create-an-array-of-objects-in-javascript
function manualParser(xml)
{
 var docLength = xml.length;
 
 //set aside the document headers for later reassemblage of musicXML [maybe useful later]
 docHeaders = xml.slice(0, xml.indexOf("<measure"));

 //trim the document headers off of the XML data
 xml = xml.slice(xml.indexOf("<measure"));

 //...but identify the first part id
 var firstPartIdStart = docHeaders.slice(docHeaders.indexOf("<part id"));
 var firstPartIdStartTrim = firstPartIdStart.slice(firstPartIdStart.indexOf("\"") + 1);
 var currentPartId = firstPartIdStartTrim.slice(0, firstPartIdStartTrim.indexOf("\""));

 //Run this loop as long as a <measure> element exists in the remaining xml string.
 var i = 0;
 while (xml.indexOf("<measure") != -1)
 {
  
  i++; //index incrementer
  measureCount = i;

  //locate the next <measure> tag,
  //push everything until then into the measureExtras[] array and trim it out
  //then parse <measure> tag into measureHeader[] array
  //and trim it out of the remaining xml file.
  var measureHeaderBegin = xml.indexOf("<measure");
  measureExtras[i] = xml.slice(0, measureHeaderBegin);

  //measureExtras[] will have <part id> tags that we need
  if (measureExtras[i].indexOf("<part id") != -1)
  {
   currentPartId = cropPartId(measureExtras[i]);
  }
  measurePartId[i] = currentPartId;

  xml = xml.slice(measureHeaderBegin);
  var measureHeaderEnd = xml.indexOf(">") + 1;
  measureHeader[i] = xml.slice(0, measureHeaderEnd);
  measureIndex[i] = cropMeasureNumber(measureHeader[i]);
  xml = xml.slice(measureHeaderEnd);

  //locate the next </measure> tag,
  //push everything up to this tag into the measures[].content array,
  //then trim it out of the remaining xml file.
  var measureFooterBegin = xml.indexOf("</measure");
  measureContent[i] = xml.slice(0, measureFooterBegin);
  xml = xml.slice(measureFooterBegin);

  //Identify measure sub-elements and print them to the console
  var m = measureContent[i];
  var noteStep = "";
  var noteOctave = "";
  var noteType = "";
  measureData[i] = "";
  while ((m.indexOf("<") != -1))
  {
   var tagOpen = m.indexOf("<");
   var tagClose = m.indexOf(">") + 1;
   var mTag = m.slice(tagOpen, tagClose);
   mTag = mTag.replace("<", "");
   mTag = mTag.replace(">", "");
   m = m.slice(tagClose);

   var nextTagOpen = m.indexOf("<");
   var mVal = m.slice(0, nextTagOpen);
   m = m.slice(nextTagOpen);
   
   //The four XML elements we are processing for now are Step, Octave, Type, and Text.
   //We can add more later!
   if (['step', 'octave', 'type', 'text'].indexOf(mTag) >= 0) {
    measureData[i] += String(mVal);
   }

  }

  //locate the end of the </measure> tag,
  //push it into the measures[].footer array,
  //then trim it out of the remaining xml file.
  var measureFooterEnd = xml.indexOf(">") + 1;
  measureFooter[i] = xml.slice(0, measureFooterEnd);
  xml = xml.slice(measureFooterEnd);
 
 } //end loop

 docFooters = xml;
 xml = "";

 return true;
}


//These are probably used with manualParser()
function cropMeasureNumber(x)
{
 var n = x.indexOf("number=\"") + 8;
 x = x.slice(n);
 n = x.indexOf("\"");
 x = x.slice(0, n);
 return parseInt(x);
}
function cropPartId(x)
{
 var n = x.indexOf("part id=\"") + 9;
 x = x.slice(n);
 n = x.indexOf("\"");
 x = x.slice(0, n);
 return (x);
}
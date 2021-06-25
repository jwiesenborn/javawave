# javawave

Description<br/>
This project computes sound waves in JavaScript, and encodes the output to WAV file format or for playback on an electronic speaker.<br/>
<br/>
File Encoding<br/>
Includes functions for encoding data in "WAVE PCM soundfile format" as specified at http://soundfile.sapp.org/doc/WaveFormat/<br/>
<br/>
Math-Based Acoustics<br/>
To compute a given frequency with JavaScript, create a 16-bit array and populate each word from the base equation y = sin(2π * x * f).<br/>
<br/>
Sequence Offsets<br/>
Recalculate each vertical coordinate to connect the signals in sequence where different notes or rests form gaps in the data signal.<br/>
<br/>
Soundwave Visualizations<br/>
Use the Canvas element to draw data forms as computed for comprehensive review.<br/>
<br/>
MusicXML<br/>
Functions for processing MusicXML file input and generating audio sound as output<br/>
<br/>
Developed from a capstone project started over at http://symmetry.cafe/sounds/<br/>

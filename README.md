# javawave

Description<br/>
This project computes sound waves in JavaScript, and encodes the output for playback on an electronic machine.<br/>
<br/>
File Encoding<br/>
Includes functions for encoding data in canonical "WAVE PCM soundfile format" as specified at http://soundfile.sapp.org/doc/WaveFormat/<br/>
<br/>
Math-Based Acoustics<br/>
To compute notes with a given frequency, create a 16-bit array and populates each byte from the base equation y = sin(2π * x * f).<br/>
<br/>
Sequence Offsets<br/>
Recalculate each vertical coordinate to connect the signals in sequence where different notes or rests form gaps in the data signal.<br/>
<br/>
Soundwave Visualizations<br/>
Use the Canvas element to draw data forms as computed for review.<br/>
<br/>
MusicXML<br/>
Functions for processing MusicXML file input and generating audio sound as output<br/>
<br/>
Special thanks to Kyle Vanderburg for help with the capstone project at North Dakota State University.

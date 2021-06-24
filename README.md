# javawave

Description
This project computes sound waves in JavaScript, and encodes the output to WAV file format or for playback on an electronic speaker.

File Encoding
This project includes functions for encoding data in "WAVE PCM soundfile format" as specified at http://soundfile.sapp.org/doc/WaveFormat/

Math-Based Acoustics
To compute a given frequency with JavaScript, we create a 16-bit array and populate each word from the base equation y = sin(2π * x * f).

Sequence Offsets
Where different notes or rests form gaps in the data signal, we recalculate each vertical coordinate to connect the signals in sequence.

Soundwave Visualizations
We program with the Canvas element to draw data forms as computed for comprehensive review.

MusicXML
Functions for processing MusicXML file input and generating audio sound as output

Developed from a capstone project started over at http://symmetry.cafe/sounds/

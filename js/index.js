var notes = ["A", "B", "C", "D", "E", "F", "G"];
var cp = [];
var cpInt = [];

VF = Vex.Flow;
var div = document.getElementById("boo")
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
renderer.resize(500, 1000);
var context = renderer.getContext();
var stave = new VF.Stave(10, 40, 1000);
stave.addClef("treble").addTimeSignature("10/4");
stave.setContext(context).draw();

function generateCP() {

  var cantusfirmus = [$('#note1').val(), $('#note2').val(), $('#note3').val(), $('#note4').val(), $('#note5').val(),
                      $('#note6').val(), $('#note7').val(), $('#note8').val(), $('#note9').val(), $('#note10').val()];
  var key = [];
  key = keyMatch(cantusfirmus[0]);

  var cfOcts = [];
  for (c = 0; c < cantusfirmus.length; c++) {
    cfOcts[c] = "4";
  }

  // beginning and ending note = tonic
  // interval = octave
  cp[0] = key[0];
  cpInt[0] = 8;
  cp[cantusfirmus.length - 1] = key[0];
  cpInt[cantusfirmus.length - 1] = 8;

  // second to last note = leading tone
  // interval = 6
  cp[cantusfirmus.length - 2] = key[6];
  cpInt[cantusfirmus.length - 2] = 6;

  fillCounterpoint(cantusfirmus, key);
  drawScore(cantusfirmus, cfOcts, cp);

  console.log(cp, cpInt);
}

function drawScore(cf, cfOcts, cp) {

  var notes = [
    new VF.StaveNote({clef: "treble", keys: [cf[0] + "/" + cfOcts[0]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[1] + "/" + cfOcts[1]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[2] + "/" + cfOcts[2]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[3] + "/" + cfOcts[3]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[4] + "/" + cfOcts[4]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[5] + "/" + cfOcts[5]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[6] + "/" + cfOcts[6]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[7] + "/" + cfOcts[7]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[8] + "/" + cfOcts[8]], duration: "q" }),
    new VF.StaveNote({clef: "treble", keys: [cf[9] + "/" + cfOcts[9]], duration: "q" })
  ];
  var voice = new VF.Voice({num_beats: 10,  beat_value: 4});
  voice.addTickables(notes);
  var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);

}

function fillCounterpoint(cantusfirmus, key) {

  var noteAbove, noteBelow, noteTAbove, noteTBelow, i, illegalNote, illegalPos;
  var tie = false;
  var leapInfo = [];
  for (i = 1; i < cp.length - 2; i++) {

      // finds all legal notes
      if (leapInfo[0] != "true" && i != cp.length - 3 && i != illegalPos) {
        noteAbove = findNoteAbove(cp[(i-1)], key);
        noteTAbove = findNoteAbove(findNoteAbove(cp[i-1], key), key);
        noteBelow = findNoteBelow(cp[(i-1)], key);
        noteTBelow = findNoteBelow(findNoteBelow(cp[i-1], key), key);
      } else if (i == cp.length - 3 && leapInfo[0] != "true") {
          noteAbove = findNoteAbove(cp[(i-1)], key);
          noteBelow = findNoteBelow(cp[(i-1)], key);
          noteTAbove = findNoteAbove(cp[(i-1)], key);
          noteTBelow = findNoteBelow(cp[(i-1)], key);
      } else if (i == illegalPos) {
        noteAbove = findNoteAbove(cp[(i-1)], key);
        noteTAbove = findNoteAbove(findNoteAbove(cp[i-1], key), key);
        noteBelow = findNoteBelow(cp[(i-1)], key);
        noteTBelow = findNoteBelow(findNoteBelow(cp[i-1], key), key);
        if (noteAbove == illegalNote) {
          noteAbove = null;
        } else if (noteBelow == illegalNote) {
          noteBelow = null;
        } else if (noteTAbove == illegalNote) {
          noteTAbove = null;
        } else if (noteTBelow == illegalNote) {
          noteTBelow = null;
        }
        illegalPos = null;
        illegalNote = null;
      } else {
        noteAbove = leapInfo[1];
        noteBelow = leapInfo[1];
        noteTAbove = leapInfo[1];
        noteTBelow = leapInfo[1];
      }


      // notes stepwise away
      if ((findInt(cantusfirmus[i], noteAbove) == 3 || findInt(cantusfirmus[i], noteAbove) == 6) && noteAbove != cp[i-1] && isIllegalInterval(cpInt, findInt(cantusfirmus[i], noteAbove), i) == false && noteAbove != cp[i+1]) { // 6, 3, stepwise motion above
        cp[i] = noteAbove;
        cpInt[i] = findInt(cantusfirmus[i], cp[i]);
      } else if ((findInt(cantusfirmus[i], noteBelow) == 3 || findInt(cantusfirmus[i], noteBelow) == 6) && noteBelow != cp[i-1] && isIllegalInterval(cpInt, findInt(cantusfirmus[i], noteBelow), i) == false && noteBelow != cp[i+1]) { // 6, 3, stepwise motion below
        cp[i] = noteBelow;
        cpInt[i] = findInt(cantusfirmus[i], cp[i]);
      } else if ((findInt(cantusfirmus[i], noteAbove) == 5 && cpInt[i-1] != 8 && cpInt[i-1] != 5) && noteAbove != cp[i-1] && noteAbove != cp[i+1]) { // 5, stepwise above
          cp[i] = noteAbove;
          cpInt[i] = 5;
      } else if ((findInt(cantusfirmus[i], noteBelow) == 5 && cpInt[i-1] != 8 && cpInt[i-1] != 5) && noteBelow != cp[i-1] && noteBelow != cp[i+1]) { // 5, stepwise below
        cp[i] = noteBelow;
        cpInt[i] = 5;
      } else if (findInt(cantusfirmus[i], noteAbove) == 8 && cpInt[i-1] != 8 && cpInt[i-1] != 5 && noteAbove != cp[i-1] && noteAbove != cp[i+1]) { // 5, stepwise above
        cp[i] = noteAbove;
        cpInt[i] = 8;
      } else if (findInt(cantusfirmus[i], noteBelow) == 8 && cpInt[i-1] != 8 && cpInt[i-1] != 5 && noteBelow != cp[i-1] && noteBelow != cp[i+1]) { // 5, stepwise below
        cp[i] = noteBelow;
        cpInt[i] = 8;
      }

      // notes third away
      else if ((findInt(cantusfirmus[i], noteTAbove) == 3 || findInt(cantusfirmus[i], noteTAbove) == 6) && noteTAbove != cp[i-1] && isIllegalInterval(cpInt, findInt(cantusfirmus[i], noteTAbove), i) == false && noteTAbove != cp[i+1]) {
        cp[i] = noteTAbove;
        cpInt[i] = findInt(cantusfirmus[i], cp[i]);
      } else if ((findInt(cantusfirmus[i], noteTBelow) == 3 || findInt(cantusfirmus[i], noteTBelow) == 6) && noteTBelow != cp[i-1] && isIllegalInterval(cpInt, findInt(cantusfirmus[i], noteTBelow), i) == false && noteTBelow != cp[i+1]) {
          cp[i] = noteTBelow;
          cpInt[i] = findInt(cantusfirmus[i], cp[i]);
      } else if ((findInt(cantusfirmus[i], noteTAbove) == 5 && cpInt[i-1] != 8 && cpInt[i-1] != 5) && noteTAbove != cp[i-1] && noteTAbove != cp[i+1]) {
          cp[i] = noteTAbove;
          cpInt[i] = 5;
      } else if ((findInt(cantusfirmus[i], noteTBelow) == 5 && cpInt[i-1] != 8 && cpInt[i-1] != 5) && noteTBelow != cp[i-1] && noteTBelow != cp[i+1]) {
          cp[i] = noteTBelow;
          cpInt[i] = 5;
      } else if (findInt(cantusfirmus[i], noteTAbove) == 8 && cpInt[i-1] != 8 && cpInt[i-1] != 5 && noteTAbove != cp[i-1] && noteTAbove != cp[i+1]) {
          cp[i] = noteTAbove;
          cpInt[i] = 8;
      } else if (findInt(cantusfirmus[i], noteTBelow) == 8 && cpInt[i-1] != 8 && cpInt[i-1] != 5 && noteTBelow != cp[i-1] && noteTBelow != cp[i+1]) {
          cp[i] = noteTBelow;
          cpInt[i] = 8;
      } else if ((findInt(cantusfirmus[i], cp[i-1]) == 6 || findInt(cantusfirmus[i], cp[i-1]) == 3) && tie == false && cp[i-1] != cp[i+1]) {
          tie = true;
          cp[i] = cp[i-1];
          cpInt[i] = findInt(cantusfirmus[i], cp[i]);
      } else {
        console.log("error", noteAbove, findInt(cantusfirmus[i], noteAbove), isIllegalInterval(cpInt, findInt(cantusfirmus[i], noteAbove), i));
        illegalNote = cp[i-1];
        illegalPos = i-1;
        for (x = 1; x <= cp.length - 2; x++) {
          cp[x] = null;
        }
        //fillCounterpoint(cantusfirmus, key);
      }
      if (leapInfo[0] == "true") {
        leapInfo[0] = "false";
        leapInfo[1] = null;
      } else {
        leapInfo = isLeap(noteTAbove, noteTBelow, cp, i, key);
      }
    }
}

// input: tonic (first note)
// output: array containing all notes of the key
// builds an array of 7 notes based on the given 1st note
function keyMatch(n) {
  var tonic = 100;
  for (i = 0; i < notes.length; i++) {
    if (n == notes[i]) {
      tonic = i;
    }
  }
  var key = [];
  var length = 7;
  var x = 0;
  key[0] = notes[tonic];
  for (i = 1; i < length; i++) {
    if ((tonic + i) < length) {
      key[i] = notes[tonic + i];
    } else {
      key[i] = notes[x];
      x++;
    }
  }
  return key;
}

// input: cantus firmus, counterpoint
// output: numeric interval between cf and cp
// finds interval between two notes
function findInt(cf, cp) {
  var int = 100;
  for (i = 0; i < notes.length; i++) {
    if (cf == notes[i]) {
      cf = i;
    }
  }
  for (i = 0; i < notes.length; i++) {
    if (cp == notes[i]) {
      cp = i;
    }
  }
  if (cp == cf) {
    int = 8;
  } else if (cp > cf) {
    int = (cp - cf) + 1;
  } else if (cf > cp) {
    int = 9 - ((cf - cp) + 1);
  }
  return int;
}

// input: counterpoint note before, key
// output: note after
// finds the stepwise above note of the previous CP note
function findNoteAbove(oldCP, key) {
  for (i = 0; i < key.length; i++) {
    if (oldCP == key[i] && (i+1 < key.length)) {
      return key[i+1];
    } else if (oldCP == key[i]) {
      return key[0];
    }
  }
}

// input: counterpoint note before, key
// output: note before
// finds stepwise below note of previous CP note
function findNoteBelow(oldCP, key) {
  for (i = 0; i < key.length; i++) {
    if (oldCP == key[i] && (i-1 >= 0)) {
      return key[i-1];
    } else if (oldCP == key[i]) {
      return key[key.length-1];
    }
  }
}

// input: array of all intervals, current interval, current position
// output: boolean
// works backwards from current position to determine if there is an illegal interval chain
function isIllegalInterval(allInts, current, pos) {
  if (pos > 3 && current == allInts[pos-1]) {
    var counter = 0;
    for (i = pos-1; i > 0; i--) {
      if (allInts[i] == allInts[i-1] && allInts[i] == current) {
        counter++;
        if (counter > 2) {
          return true;
        }
      } else {
        counter = 0;
      }
    }
  } else {
    return false;
  }
  return false;
}

// input: note one third above, note one third below, array of cp notes, current position, key
// output: array of leap information
// determines whether or not a leap has occured, and the correct resolution note
function isLeap(above, below, cp, pos, key) {
  var leapInfo = [];
  if (cp[pos] == above) {
    leapInfo[0] = "true";
    leapInfo[1] = findNoteBelow(cp[pos], key);
  } else if (cp[pos] == below) {
    leapInfo[0] = "true";
    leapInfo[1] = findNoteAbove(cp[pos], key);
  } else {
    leapInfo[0] = "false";
    leapInfo[1] = null;
  }
  return leapInfo;
}


  // if third last note, check that the interval between the two cp notes are <= 3 above || == 2 below
  // && note != cp[cp.length -2]
  // return bool
  // if we have just leapt a third, the next note MUST be the next note in the opposite direction of the leapt
    // boolean to save a leap and the direction

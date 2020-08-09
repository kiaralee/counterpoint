var notes = ["A", "B", "C", "D", "E", "F", "G"];
var cp = [];
var cpInt = [];


function generateCP() {

  var cantusfirmus = [$('#note1').val(), $('#note2').val(), $('#note3').val(), $('#note4').val(), $('#note5').val(),
                      $('#note6').val(), $('#note7').val(), $('#note8').val(), $('#note9').val(), $('#note10').val()];
  var key = [];
  key = keyMatch(cantusfirmus[0]);

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

 // MAKE THIS HIS OWN FUNCTION :)
  // generates remaining notes:

  var noteAbove, noteBelow, noteTAbove, noteTBelow, i;
  var tie = false;
  var leapInfo = [];
  for (i = 1; i < cp.length - 2; i++) {

      // finds all legal notes
      if (leapInfo[0] != "true" || leapInfo[0] == null && i != cp.length - 3) {
        noteAbove = findNoteAbove(cp[(i-1)], key);
        noteTAbove = findNoteAbove(findNoteAbove(cp[i-1], key), key);
        noteBelow = findNoteBelow(cp[(i-1)], key);
        noteTBelow = findNoteBelow(findNoteBelow(cp[i-1], key), key);
      } else {
        if (i == cp.length - 3 && leapInfo[0] != "true") {
            // else if: note should be stepwise above or below the following note OR correct resolution
            noteAbove = findNoteAbove(cp[(i-1)], key);
            noteBelow = findNoteBelow(cp[(i-1)], key);
            noteTAbove = findNoteAbove(cp[(i-1)], key);
            noteTBelow = findNoteBelow(cp[(i-1)], key);
        } else {
          noteAbove = leapInfo[1];
          noteBelow = leapInfo[1];
          noteTAbove = leapInfo[1];
          noteTBelow = leapInfo[1];
        }
      }


      // note stepwise away


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

      // note third away
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
        console.log("error", noteTAbove, noteTBelow, noteAbove, noteBelow);
        // go back one, and don't use the illegal note
      }
      leapInfo = isLeap(noteTAbove, noteTBelow, cp, i, key);
    }
  console.log(cp, cpInt);
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
      while (allInts[i] == allInts[i-1] && allInts[i] == current) {
        counter++;
        if (counter > 1) {
          return true;
        }
      }
    }
  } else {
    return false;
  }
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


function isIllegalMelodic() {
  // if third last note, check that the interval between the two cp notes are <= 3 above || == 2 below
  // && note != cp[cp.length -2]
  // return bool
  // if we have just leapt a third, the next note MUST be the next note in the opposite direction of the leapt
    // boolean to save a leap and the direction
}

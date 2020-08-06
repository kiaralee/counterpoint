var notes = ["A", "B", "C", "D", "E", "F", "G"];
var cp = [];
var cpInt = [];


function generateCP() {
  var n1 = $('#note1').val();
  var n2 = $('#note2').val();
  var n3 = $('#note3').val();
  var n4 = $('#note4').val();
  var n5 = $('#note5').val();
  var n6 = $('#note6').val();

  var key = [];
  key = keyMatch(n1);

  // beginning and ending note = tonic
  // interval = octave
  cp[0] = key[0];
  cpInt[0] = 8;
  cp[5] = key[0];
  cpInt[5] = 8;

  // second to last note = leading tone
  // interval = 6
  cp[4] = key[6];
  cpInt[4] = 6;

  // check note after, note before
  // chooses one that gives an interval of 6 or 3

  var noteAbove;
  var noteBelow;
  // whatever the counterpoint before it is, add one to get the note above
  var i;
  for (i = 1; i < cp.length - 2; i++) {
      noteAbove = findNoteAbove(cp[(i-1)], key);
      noteBelow = findNoteBelow(cp[(i-1)], key); // NOTE BELOW DOES NOT WORK?
      if (findInt(n2, noteAbove) == 3 || findInt(n2, noteAbove) == 6) {
        cp[i] = noteAbove;
        cpInt[i] = findInt(n2, cp[i]);
      } else if (findInt(n2, noteBelow) == 3 || findInt(n2, noteBelow) == 6) {
        console.log("hello");
        cp[i] = noteBelow;
        cpInt[i] = findInt(n2, cp[i]);
      }
    }



  console.log(cp, cpInt);

}













// input: tonic (first note)
// output: key
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
  } else {
    console.log("error", cf, cp);
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

// inout: counterpoint note before, key
// output: note before
// finds stepwise below note of previous CP note
function findNoteBelow(oldCP, key) {
  console.log(oldCP);
  for (i = 0; i < key.length; i++) {
    if (oldCP == key[i] && (i-1 >= 0)) {
      return key[i-1];
    } else if (oldCP == key[i]) {
      return key[7];
    }
  }
}

var myCodeMirror;
var jqconsole;
// variables that need to be kept track of for metrics
var metricsVars = {
  charCount: '',
  lastKeyPressed: '',

  lastComiplationTime: '',
  errorLineNum: '',
  //metric to determine if there has been an error in the last 30 seconds
  editErrLineNumMetric: '',
  errorCycleCount : 0,
  lastCompileSuccessful: true,

  lastCompiledCode: ''
}

//parameters for metrics
var numLinesForCloseness = 5;
var numErrorsForCycle = 5;
<<<<<<< HEAD

// When the user clicks on <div>, open the popup
function popup() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    points();
    setTimeout(function(){ popup.className = popup.className.replace("show", ""); }, 3000);
}

// When the user gets a popup, increase points by 1
function points() {
    var myPoints = document.getElementById("myPoints");
    var totalPoints = myPoints.innerHTML.split(": ")[1];
    myPoints.innerHTML = parseInt(totalPoints) + 1;
    myPoints.innerHTML = "Total Points: " + myPoints.innerHTML;
}

$(document).keypress(function(event){
  //listen for key events, trigger popup on 'p'
  if (event.which == 112) {
    popup();
  }
});

// in case we want to use this later
// function randomTrigger() {
//
//   setInterval(function(){popup()}, (Math.random() * (30 - 20) + 20)*1000)
//
// }

$(document).ready(function(e) {
  //set up codemirror editor
  ProblemMessageA = "Write three Python functions: 1) to calculate midpoints of a line; 2) to take out negative numbers from a list; 3) to take out positinve numbers from a list."
  initialCodeA = 'def midpoint(x1, y1, x2, y2):\n\t#code here\n\treturn (0,0)\n\ndef takeOutNeg(listy):\n\t#code here\n\treturn []\n\ndef takeOutPos(listy):\n\t#code here\n\treturn []\n\nprint midpoint(1,3,4,1)\nprint takeOutNeg([2,-1,3,-5,0,1])\nprint takeOutPos([2,-1,3,-5,0,1])';

  var codeArea = document.getElementById('code');
  codeArea.value= initialCodeA;
  var taskArea = document.getElementById('task');
  taskArea.value= ProblemMessageA;
  checkForPrint(initialCodeA, true);

  myCodeMirror = CodeMirror.fromTextArea(codeArea, {
=======
var numLinesForDupCode = 3;
var numLinesSkeletonExtra = 10; // num lines past paste that the skeleton can go
var minSkel = .3; //minimum ratio for skel
var maxSkel = .9; // maximum ratio for skel
var secondsForSkel = 240;

$(document).ready(function(e) {
  
  //set up codemirror editor
  myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
>>>>>>> master
    mode:  "python",
    theme: 'monokai',
    indentWithTabs: true,
    indentUnit: 4,
    lineNumbers: true,
  });
<<<<<<< HEAD
  // initializing character count of editor
  metricsVars.charCount = myCodeMirror.getValue().length;
  $(".CodeMirror pre").css('font-size',"15 pt");
=======

  // initialize the problem choice & set up dropdown change listener
  selectProblem(document.getElementById("problemSelect").value);
  document.getElementById("problemSelect").onchange=function() {
    selectProblem(this.value);
  }
  
  //Run button listener
>>>>>>> master
  $('#runButton').on('click', function(e) {
   runit(myCodeMirror);
  });

  //Set up console
  $(function () {
    jqconsole = $('#console').jqconsole('Hi\n', '>>>', '>');
    var startPrompt = function () {
      // Start the prompt with history enabled.
      jqconsole.Prompt(true, function (input) {
        // Output input with the class jqconsole-output.
        jqconsole.Write(input + '\n', 'jqconsole-output');
        // Restart the prompt.
        startPrompt();
      });
    };
    startPrompt();
  });

  // CodeMirror editor Listeners
  myCodeMirror.on('change', function(cMirror, change){
    metricCheckEditorChange(change);
  });
<<<<<<< HEAD

  myCodeMirror.on('cursorActivity',function(cMirror){
=======
  myCodeMirror.on('cursorActivity', function(cMirror){
>>>>>>> master
    metricCheckCursorChange(cMirror);

  });

// randomTrigger()
});

/**
 * function selectProblem
 * inputs: letter - String of capitol letter determined by which dropdown is selected
 * outpus: none
 * Changes problem message and initial code for problem based on drop down
 * also initializes metric vars so that metrics aren't called when editor changed based on dropdown
*/
function selectProblem(letter) {
  if (letter == 'A'){
    problemMessage = "Write three Python functions: 1) to calculate midpoints of a line; 2) to take out negative numbers from a list; 3) to take out positinve numbers from a list.";
    initialCode = 'def midpoint(x1, y1, x2, y2):\n\t#code here\n\treturn (0,0)\n\ndef takeOutNeg(listy):\n\t#code here\n\treturn []\n\ndef takeOutPos(listy):\n\t#code here\n\treturn []\n\nprint midpoint(1,3,4,1)\nprint takeOutNeg([2,-1,3,-5,0,1])\nprint takeOutPos([2,-1,3,-5,0,1])';
  }
  if (letter == 'B'){
    problemMessage = "Write a Python program to add two binary numbers.";
    initialCode = "def addBinary(x, y):\n\treturn 0\n\naddBinary (1,11)";
  }
  if (letter == 'C') {
    problemMessage = " Using the Python language, have the function alphabetSoup(str) take the str string parameter being passed and return the string with the letters in alphabetical order (ie. hello becomes ehllo). Assume numbers and punctuation symbols will not be included in the string.";
    initialCode = "def alphabetSoup(str):\n\treturn 0\n\nalphabetSoup('delta')\nalphabetSoup('')";
  }
  if (letter == 'D'){
    problemMessage = "Debug the following code that creates a multiplication quiz app";
    initialCode = "import Random\na = random.randint(1,12)\nb = random.randint(1,12)\nfor i in range(l0):\n\tquestion = 'What is ' +a+' x '+b+'? '\n\tanswer = (question)\n\tif answer = a*b\n\t\tprint (Well done!)\n\telse:\n\t\tprint('No.')";
  }
  if (letter == 'E'){
    problemMessage = "Implement the function unique_in_order which takes as argument a sequence and returns a list of items without any elements with the same value next to each other and preserving the original order of elements.\nFor example:\nunique_in_order('AAAABBBCCDAABBB') == ['A', 'B', 'C', 'D', 'A', 'B']\nunique_in_order('ABBCcAD')         == ['A', 'B', 'C', 'c', 'A', 'D']\nunique_in_order([1,2,2,3,3])       == [1,2,3]";
    initialCode = "def unique_in_order(iterable):\n\toutput = []\n\toutput.append(iterable[0])\n\n\tfor i in len(iterable):\n\t\tif iterable[i+1] != iterable[i]:\n\t\t\toutput.append(iterable[i+1])\n\nunique_in_order('AAAABBBCCDAABBB')\nunique_in_order('')\nunique_in_order('B')";
  }
 
  //metricVar initialization
  metricsVars.charCount = initialCode.length; // reinitializing character count of editor so it doesn't seem like it is a paste
  checkForPrint(initialCode, true); // reinitialize print statements

  // set new text in editor
  myCodeMirror.setValue(initialCode);
  // set new problem message text
  document.getElementById('task').innerHTML = "<p>"+problemMessage+"</p>";
}



/**
 * Function consoleOutputResult:()
 * input: output text from python run, both error and output text
 * output: none
 * Displays output text in html output div as a new paragraph
*/
function consoleOutputResult(text) {
  if (!text.trim()){}
  else{
<<<<<<< HEAD
    var consoleOutputArea = document.getElementById("output");
    consoleOutputArea.innerHTML = consoleOutputArea.innerHTML + "\n"+text ;
=======
    jqconsole.Write(text + '\n', 'jqconsole-output');
>>>>>>> master
  }
}
/**
 * Function builtinRead:()
 * input: x
 * output: none
 * reader for interpreting python code
*/
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
<<<<<<< HEAD
/**
 * Function consoleOutputAfterRun:()
 * input: consoleOutputArea - element to put console output
 * output: none
 * controls user's console;
 * after run adds a new line and carrrot and forces the console to scroll to the bottom.
*/
function consoleOutputAfterRun(consoleOutputArea){
  consoleOutputArea.innerHTML = consoleOutputArea.innerHTML +  "\n>";
  $('#output').scrollTop($('#output')[0].scrollHeight);
}
=======
>>>>>>> master

/**
 * function runit()
 * inputs/outputs: codeMirror object that has code from web editor
 * runs the python code that is contained in the CodeMirror and displays the errors or output
 * runs related metric checks
*/
var lastSetTimeout;
function runit(myCodeMirror) {
  //get code text from web console
  var prog = myCodeMirror.getValue();
  // write a carrot between runs
  jqconsole.Write('>', 'jqconsole-prompt');

  //check for duplication
  detectCodeDuplication(prog);
  
  // check metrics relevant to running code
  metricCheckRunCode(prog);

  //run python code using skuplt
<<<<<<< HEAD
  var consoleOutputArea = document.getElementById("output");
=======
>>>>>>> master
  Sk.pre = "output";
  Sk.configure({output:consoleOutputResult, read:builtinRead});
  var myPromise = Sk.misceval.asyncToPromise(function() {
     return Sk.importMainWithBody("<stdin>", false, prog, true);
  });
  // success function on promise return
  myPromise.then(function(mod) {
    console.log('success');
    metricCheckRunCodeSuccess();
  },
  // error function on promise return
  function(err) {
    consoleOutputResult(err.toString());
    console.log(err);
    metricCheckRunCodeError(err);
  });

}

/*  getErrLineNum
    inputs: msg - string of error message
    output: number of line error occured on
*/
function getErrLineNum(err) {
  var lineNum = err.traceback[0].lineno;
  return lineNum
}


/**
 * function metricCheckEditorChange()
 * inputs changeObj - object created by editor change event
 * outputs: none
 * checks all metrics related to editor changes
*/
function metricCheckEditorChange(changeObj) {
  // keeping track of the last key that was pressed
  metricsVars.lastKeyPressed = changeObj.text[0];
  if (changeObj.text.length == 2 && !changeObj.text[0] && !changeObj.text[1] ){
    metricsVars.lastKeyPressed = 'enter';
  }
  if (changeObj.from.line == changeObj.to.line && changeObj.from.ch == changeObj.to.ch){
    // added one character
  }

  //character count of editor
  newCharCount = myCodeMirror.getValue().length;
  // check to see if there is a new paste
  if (newCharCount-metricsVars.charCount > 2 && metricsVars.lastKeyPressed !='enter'){
    console.log("Metric: Paste")

    //check to see if it was pasted from content inside code
    var prog = myCodeMirror.getValue();
    var dupPaste = checkNewDup(prog, changeObj.text);
    //check to see if code was pasted to create a helper function
    if (dupPaste>1){
      var timesRun = 0;
      var pasteInterval =setInterval(function(){ 
        var prog = myCodeMirror.getValue();
        dupAfterTime = checkNewDup(prog, changeObj.text);
        if (dupPaste - dupAfterTime >= 2 && dupAfterTime >=1){
          console.log("METRIC: refactor")
          clearInterval(pasteInterval);
        }
        timesRun += 1;
        if(timesRun === 60){
            clearInterval(pasteInterval);
        }
      }, 30 * Math.pow(10,3)) // after 5 minutes or 300 seconds
    }

    //check to see if paste was used as skeleton code
    var skeletonTimer = setTimeout(function(){
      var countSame = 0;
      var prog = (myCodeMirror.getValue().split("\n"));
    
      var pasteText =  changeObj.text.filter(String);
      console.log(pasteText);
      for (var i = changeObj.to.line; i < changeObj.from.line+changeObj.text.length + 1 + numLinesSkeletonExtra; i++) {
        if (pasteText.indexOf(prog[i])>=0 && prog[i]!=""){
          countSame++;
        }
      }
      var ratioSkel = countSame/pasteText.length;

      if (ratioSkel > minSkel && ratioSkel < maxSkel){
        console.log("METRIC: Skel")
      }
    }, secondsForSkel *Math.pow(10,3))
  }
  metricsVars.charCount = newCharCount;

  //Evaluating Metric: editErrLineNum
  if (!metricsVars.lastCompileSuccessful && metricsVars.editErrLineNumMetric){
    if (Math.abs(changeObj.to.line - metricsVars.errorLineNum) < numLinesForCloseness){
      console.log("METRIC editErrLineNum_edit");
      metricsVars.editErrLineNumMetric = false;
    }
    else {
        //if they edit somewhere else first, that doesn't count FOR editErrLineNumMetric
        metricsVars.editErrLineNumMetric = false;
        console.log("ANTI-metric Editing code directly after error not near error line (Avoidance)")

        //edit not near error, so can't count for break out of error cycle
        metricsVars.errorCycleCount = 0;
    }
  }
}

/**
 * function metricCheckCursorChange()
 * inputs: cMirror - code mirror editor object
 * output: none
 * checks all metrics related to cursor changes
*/
function metricCheckCursorChange(cMirror) {
  sel = myCodeMirror.getSelection(); //literally a string of what is selected

  //Evaluating Metric: editErrLineNum
  if (metricsVars.editErrLineNumMetric){
    if (Math.abs(myCodeMirror.getCursor().line - metricsVars.errorLineNum) < numLinesForCloseness){
      console.log("METRIC editErrLineNum_cursor");
      metricsVars.editErrLineNumMetric = false;
    }
  }
}

/**
 * function metricCheckRunCode()
 * inputs: prog - text from code mirror editor
 * out: none
 * checks all metrics related to running code
*/
function metricCheckRunCode(prog){
  //get time between compilations
  var d = new Date();
  d.getTime();
  // Time between current compile and previous compile
  var compileDelta = d - metricsVars.lastComiplationTime;
  metricsVars.lastComiplationTime = d;

  //Check to see if user made any changes between compiles
  // makes sure last compile was .5 second before to make sure it wasn't double click
  if (prog == metricsVars.lastCompiledCode && compileDelta > 500 ){
    console.log('ANTI-metric: No change between compiles');
    // if user fails to make changes, then they aren't being persisitant in error Cycle
    metricsVars.errorCycleCount = 0;
  }
  metricsVars.lastCompiledCode = prog;
  checkForPrint(prog, false);
}

/**
 * function metricCheckRunCodeSuccess()
 * inputs: none
 * ouptputs: none
 * checks all metrics related to running code with successful result
*/
function metricCheckRunCodeSuccess(){
  //evaluate if broken error cycle
  if (metricsVars.errorCycleCount > numErrorsForCycle) {
    console.log("METRIC: breakOutOfErrCycle");
  }
  errCycleCount = 0;
  metricsVars.lastCompileSuccessful = true;
}

/**
 * function metricCheckRunCodeError()
 * inputs: err - error object output from running python
 * ouptputs: none
 * checks all metrics related to running code with error result
*/
function metricCheckRunCodeError(err){
  clearTimeout(lastSetTimeout);
  currentErrLineNum = getErrLineNum(err);
  // check to see if still in errorCycle
  if (!metricsVars.lastCompileSuccessful) {
    if (Math.abs((metricsVars.errorLineNum -currentErrLineNum))<numLinesForCloseness){
      metricsVars.errorCycleCount += 1;

    }
    else {
      if (currentErrLineNum > metricsVars.errorLineNum && metricsVars.errorCycleCount > numErrorsForCycle) {
        console.log("METRIC: breakOutOfErrCycle");
      }
      metricsVars.errorCycleCount = 0;
    }
  }
  metricsVars.errorLineNum = currentErrLineNum;
  metricsVars.editErrLineNumMetric = true;

  // set timer to reset metric for err line number edit
  lastSetTimeout = setTimeout(function(){
    metricsVars.editErrLineNumMetric = false;
  }, 30000)
  metricsVars.lastCompileSuccessful = false;
}



function reward(){
  document.getElementById("output").innerHTML += "\n great process: You are growing your skills! \n";
};




/**
 * Function checkForPrint
 * input: prog - text executed in program; init - true if this is run during initialization, otherwise false
 * output: none
 * Checks to see if uses new print statement for debugging
**/
var lastPrints = [];
function checkForPrint(prog, init) {
  stillPrints = true;
  lastPrintCount = 0;
  var thisPrints = [];

  while(stillPrints){
    // get index of print
    index = prog.indexOf("print", lastPrintCount);

    //if there are no more prints, exit loop
    if (index== -1){
      stillPrints = false;
    }
    else {
      // increment lastPrintCount
      lastPrintCount = index+1;
      // get the entire line that the print is on.
      printState = prog.substr(index).split("\n", 1)[0]
      thisPrints.push(printState)
      // check to see if print statement was in the code the last time the code was run
      if(($.inArray(printState, lastPrints))<0){
        if (init == false){
          // metric only counts if the last compile had an error
          if (metricsVars.lastCompileSuccessful == false) {
            console.log("metric NEWPRINT")
          }
        }
      }
    }
  }
  // copy the contents of this prints to the variable lastPrints to remember for next compile
  $.each(thisPrints, function(i, el){
    lastPrints.push(el);
  });
}

/** cleanWS
 * inputs: prog - string of code
 * outputs: out - array of each line of code minus whitespace and empty lines
 * takes out whitespace from code string
**/
function cleanWS(prog){
  var prog1 = prog.replace(/\t/g, ""); //take out all tabs
  var prog2 = prog1.replace(/ /g, ""); //take out all spaces
  var prog3 = prog2.replace(/\n\n/g, "\n"); // take out all extra new lines
  var out = prog3.split("\n"); // seperate to array divided by new lines
  return out;
}


/** cleanArrayElements
 * inputs: codeArray - array of each line of code
 * outputs: out - array of each line of code minus whitespace and empty lines
 * takes out whitespace from code array
**/
function cleanArrayElements(codeArray){
  cleanedArray = []
  codeArray.forEach(function (item){
    if (item != ""){
    var prog1 = item.replace(/\t/g, ""); //take out all tabs
    var prog2 = prog1.replace(/ /g, ""); //take out all spaces
    cleanedArray.push(prog2);
    }
  })
  return cleanedArray;
}

/** countDupsFromMatrix
 * inputs: matrix - true represents when two entries are the same, minus the diagonal 
 * outputs: dupCount - count of duplicate sections of code
 * count number of duplicate sections of code
**/
function countDupsFromMatrix(matrix, minLines){
  //establish variables
  var dupCount=0; //count number of duplicate sections
  var dupLineCount =0;// count num of lines in a row that is dup
  for (var l=0; l<matrix[0].length; l++){
    for (var k=0; k<matrix.length; k++){
      if(matrix[k][k+l]){
        dupLineCount++;
      }
      else {
        if (dupLineCount >= minLines){
          dupCount++;
        }
        dupLineCount = 0;
      }
    }
  }
  return dupCount;
}

/** createMatrixfromArray
 * inputs: codeArray - array with each element is a line of cleaned code; duplicateMatrix - empty matrix of size codeArray.length^2
 * outputs: duplicateMatrix - matrix where true represents when two entries are the same, minus the diagonal 
 * compares each element to all other elements of array and creates duplicateMatrix
**/
function createMatrixfromArray(codeArray, duplicateMatrix){

  //compare each line to see if there are duplicates
  for (var i=0; i<codeArray.length; i++){
    for (var j=0; j<codeArray.length; j++){
      if (codeArray[i] == codeArray[j] && i != j){
        duplicateMatrix[i][j] = true;
      }
    }
  }
  return duplicateMatrix
}
/** createMatrixfromTwoArrays
 * inputs: codeArray - array with each element is a line of cleaned code; duplicateMatrix - empty matrix of size codeArray.length x addedCode
 * outputs: duplicateMatrix - matrix where true represents when two entries are the same comparing codeArray and addedCode, minus the diagonal 
 * compares each element to all other elements of array and creates duplicateMatrix
**/
function createMatrixfromTwoArrays(codeArray, addedCode, duplicateMatrix){
    //compare each line to see if there are duplicates
  for (var i=0; i<addedCode.length; i++){
    for (var j=0; j<codeArray.length; j++){
      if (codeArray[j] == addedCode[i] && i != j){
        duplicateMatrix[i][j] = true;
      }
    }
  }
  return duplicateMatrix
}

/** detectCodeDuplication
 * inputs: prog - string of code content
 * outputs: num of duplicates in code
 * rudimentary version to look at code for duplicates
**/
function detectCodeDuplication(prog){
  var codeArray = cleanWS(prog);
  // initialize matrix to record duplicates
  var duplicateMatrix  = []; 
  for(var i=0; i<codeArray.length; i++) {
      duplicateMatrix[i] = new Array(codeArray.length);
  }
  duplicateMatrix = createMatrixfromArray(codeArray, duplicateMatrix)
  return countDupsFromMatrix(duplicateMatrix, numLinesForDupCode);
}

/** detectCodeDuplication
 * inputs: prog - string of code content, addedCode - array of lines of code added to program
 * outputs: num of duplicates of addedCode in prog
 * rudimentary version to look at code for duplicates
**/
function checkNewDup(prog, addedCode){
  codeArray = cleanWS(prog);
  addedCodeCleaned = cleanArrayElements(addedCode);

  var duplicateMatrix  = []; 
  for(var i=0; i<addedCodeCleaned.length; i++) {
      duplicateMatrix[i] = new Array(codeArray.length);
  }
  duplicateMatrix = createMatrixfromTwoArrays(codeArray, addedCodeCleaned, duplicateMatrix);
  return countDupsFromMatrix(duplicateMatrix, addedCodeCleaned.length);
}
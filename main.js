var myCodeMirror;

var metricsVars = {
  charCount: '',
  lastKeyPressed: '',

  lastComiplationTime: '',
  errorLineNum: '',
  editErrLineNumMetric: '',
  errorCycleCount : 0,
  lastCompileSuccessful: '',

  lastCompiledCode: ''
}


var numLinesForCloseness = 5;
var numErrorsForCycle = 5;


$(document).ready(function(e) {
  //set up codemirror editor
  initialCode = 'def midpoint(x1, y1, x2, y2):\n\t#code here\n\treturn (0,0)\n\ndef takeOutNeg(listy):\n\t#code here\n\treturn []\n\ndef takeOutPos(listy):\n\t#code here\n\treturn []\n\nprint midpoint(1,3,4,1)\nprint takeOutNeg([2,-1,3,-5,0,1])\nprint takeOutPos([2,-1,3,-5,0,1])';
  var codeArea = document.getElementById('code');
  codeArea.value= initialCode;
  checkForPrint(initialCode, true);

  myCodeMirror = CodeMirror.fromTextArea(codeArea, {
    mode:  "python",
    theme: 'monokai',
    indentWithTabs: true,
    indentUnit: 4,
    lineNumbers: true,
  });

  // initializing character count of editor
  metricsVars.charCount = myCodeMirror.getValue().length;
  
  //Run button listener
  $('#runButton').on('click', function(e) {
   runit(myCodeMirror);
  });

  // CodeMirror editor Listeners
  myCodeMirror.on('change',function(cMirror, change){
    metricCheckEditorChange(change);
  });
  myCodeMirror.on('cursorActivity',function(cMirror){
    metricCheckCursorChange(cMirror);
  });
});


/**
 * Function consoleOutputResult:()
 * input: output text from python run, both error and output text
 * output: none
 * Displays output text in html output div as a new paragraph
*/
function consoleOutputResult(text) { 
  if (!text.trim()){}
  else{
    var consoleOutputArea = document.getElementById("output"); 
    consoleOutputArea.innerHTML = consoleOutputArea.innerHTML + "\n"+text ; 
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

  metricCheckRunCode(prog)

  //run python code using skuplt
  var consoleOutputArea = document.getElementById("output"); 
  Sk.pre = "output";
  Sk.configure({output:consoleOutputResult, read:builtinRead}); 
  var myPromise = Sk.misceval.asyncToPromise(function() {
     return Sk.importMainWithBody("<stdin>", false, prog, true);
  });
  // success function on promise return
  myPromise.then(function(mod) {
    console.log('success');
    consoleOutputAfterRun(consoleOutputArea);
    metricCheckRunCodeSuccess();
  },
  // error function on promise return
  function(err) {
    consoleOutputResult(err.toString());
    console.log(err);
    consoleOutputAfterRun(consoleOutputArea)
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
  //detecting errors
  if (changeObj.text.length == 2 && !changeObj.text[0] && !changeObj.text[1] ){
    metricsVars.lastKeyPressed = 'enter';
  }
  if (changeObj.from.line == changeObj.to.line && changeObj.from.ch == changeObj.to.ch){
    // added one character
  }

  //character count of editor
  newCharCount = myCodeMirror.getValue().length;
  if (newCharCount-metricsVars.charCount > 2 && metricsVars.lastKeyPressed !='enter'){
    console.log('METRIC: paste');
  }
  metricsVars.charCount = newCharCount;

  //Evaluating Metric: editErrLineNum
  if (metricsVars.editErrLineNumMetric){
    console.log("METRIC editErrLineNum_edit");
  }
  //if they edit somewhere else first, that doesn't count
  metricsVars.editErrLineNumMetric = false;
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
      metricsVars.editErrLineNumMetric = false;
      console.log("METRIC editErrLineNum_cursor");
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

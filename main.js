var myCodeMirror;

var mousedown = false;
var charCount;
var lastKeyPressed;

var lastComiplationTime;
var errorLineNum;
var editErrLineNumMetric;
var errorCycleCount = 0;
var lastCompileSuccessful;

var lastCompiledCode;


$(document).ready(function(e) {
  //set up screen
  myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode:  "python",
    theme: 'monokai',
    indentWithTabs: true,
    indentUnit: 4,
    lineNumbers: true,
  });

  var charCount = myCodeMirror.getValue().length;
  //Run Button listener
$('#runButton').on('click', function(e) {
   runit(myCodeMirror);
  });

  // CodeMirror Listeners
  myCodeMirror.on('change',function(cMirror, change){
    editorChange(change);
  });
  myCodeMirror.on('cursorActivity',function(cMirror){
    cursorChange(cMirror);
  });
  myCodeMirror.on("mousedown", function () {
    mousedown = true;
  });
});


/**
 * Function checkForPrint
 * input: prog - text executed in program
 * output: none
 * Checks to see if uses new print statement for debugging
**/
  preEstablishedPrints = ["print midpoint(1,3,4,1)", "print takeOutNeg([2,-1,3,-5,0,1])", "print takeOutPos([2,-1,3,-5,0,1])"]
  var lastPrints = [];
  function checkForPrint(prog) {
    stillPrints = true;
    lastPrint = 0;
    var thisPrints = [];

    while(stillPrints){
      // console.log('lastPrint'+lastPrint)
      i = prog.indexOf("print", lastPrint)
      lastPrint = i+1
      if (i== -1){
        stillPrints = false;
      }
      else {
        printState = prog.substr(i).split("\n", 1)[0]
        if (($.inArray(printState, preEstablishedPrints))<0){
          if(($.inArray(printState, lastPrints))<0){
            if (lastCompileSuccessful == false) {
              console.log("metric NEWPRINT")
            }
          }
          thisPrints.push(printState)
        }
      }
    }
    $.each(thisPrints, function(i, el){
      lastPrints.push(el);
    });
  }

/**
 * Function outf:()
 * input: output text from python run
 * output: none
 * Displays output text in html output div as a new paragraph
*/
function outf(text) { 
  if (!text.trim()){}
  else{
    var mypre = document.getElementById("output"); 
    mypre.innerHTML = mypre.innerHTML + "\n"+text ; 
  }
} 
/**
 * Function builtinRead:()
 * input: x
 * output: none
 * reader for running python code
*/
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

/**
 * function runit()
 * inputs/outputs: codeMirror object
 * runs the python code that is contained in the CodeMirror and displays the errors or output
*/
var lastSetTimeout;
function runit(myCodeMirror) {
  console.log(window.history);
  //get time between compilations
    var d = new Date(); 
    d.getTime();
    // Time between current compile and previous compile
    var compileDelta = d - lastComiplationTime;
    lastComiplationTime = d;

    //run python code using skuplt
    var prog = myCodeMirror.getValue();

    //Check to see if user made any changes between compiles 
    // makes sure last compile was more than 1 second before to make sure it wasn't double click
    if (prog == lastCompiledCode && compileDelta > 1000 ){
      console.log('ANTI-metric: No change between compiles');
      // if user fails to make changes, then they aren't being persisitant in error Cycle
      errorCycleCount = 0;
    }
    lastCompiledCode = prog;

    var mypre = document.getElementById("output"); 
    Sk.pre = "output";
    Sk.configure({output:outf, read:builtinRead}); 
    var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    checkForPrint(prog);
    myPromise.then(function(mod) {
       console.log('success');

       //evaluate if broken error cycle
       if (errorCycleCount > 5) {
        console.log("METRIC: breakOutOfErrCycle");
       }
       errCycleCount = 0;

       mypre.innerHTML = mypre.innerHTML +  "\n>"; 
       $('#output').scrollTop($('#output')[0].scrollHeight);
       lastCompileSuccessful = true;
    },
    function(err) {
      outf(err.toString());
      console.log(err);
      clearTimeout(lastSetTimeout);
      currentErrLineNum = getErrLineNum(err);
      // check to see if still in errorCycle
      if (!lastCompileSuccessful) {
        if (Math.abs((errorLineNum -currentErrLineNum))<5){
          errorCycleCount += 1;
        }
        else {
          if (currentErrLineNum > errorLineNum && errorCycleCount > 5) {
            console.log("METRIC: breakOutOfErrCycle");
          }
          errorCycleCount = 0;
        }
      }
      errorLineNum = currentErrLineNum;
      editErrLineNumMetric = true;

      // set timer to reset metric for err line number edit
      lastSetTimeout = setTimeout(function(){ 
        editErrLineNumMetric = false;
      }, 30000)
      mypre.innerHTML = mypre.innerHTML +  "\n>"; 
      $('#output').scrollTop($('#output')[0].scrollHeight);
      lastCompileSuccessful = false;
    });
} 

function editorChange(changeObj) {
  // keeping track of the last key that was pressed
  lastKeyPressed = changeObj.text[0];
  //detecting eerrors
  if (changeObj.text.length == 2 && !changeObj.text[0] && !changeObj.text[1] ){
    lastKeyPressed = 'enter';
  }
  if (changeObj.from.line == changeObj.to.line && changeObj.from.ch == changeObj.to.ch){
    // added one character
  }
  
  //character count of editor
  newCharCount = myCodeMirror.getValue().length;
  if (newCharCount-charCount > 2 && lastKeyPressed !='enter'){
    console.log('METRIC: paste');
  }
  charCount = newCharCount;

  //Evaluating Metric: editErrLineNum
  if (errorLineNum){
    if (Math.abs(changeObj.to.line - errorLineNum) < 5){
      console.log("METRIC editErrLineNum_edit");
    }
    //if they edit somewhere else first, that doesn't count
    editErrLineNumMetric = false;
  }
}

function cursorChange(cMirror) {
   sel = myCodeMirror.getSelection(); //literally a string of what is selected

   //Evaluating Metric: editErrLineNum
    if (errorLineNum){
      if (Math.abs(myCodeMirror.getCursor().line - errorLineNum) < 5){
        editErrLineNumMetric = false;
        console.log("METRIC editErrLineNum_cursor");
      }
    }

    if (sel){
      //console.log('selection');
    }
    else {
      //console.log('nosel');
      //console.log(myCodeMirror.getCursor());
      if (mousedown == true) {
        //user clicked on the 
        //console.log("click");
      }
    }
    mousedown = false;
}

/*  getErrLineNum
    inputs: msg - string of error message
    output: number of line error occured on
*/
function getErrLineNum(err) {
  var lineNum = err.traceback[0].lineno;
  return lineNum
}
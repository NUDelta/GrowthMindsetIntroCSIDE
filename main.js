var mousedown = false;
var lastCompilation;
var lineError = '';
var myCodeMirror;
var charCount;
var lastKeyPressed;
var lastCompileSuccessful;


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
  //get time between compilations
    var d = new Date(); 
    d.getTime();
    var compileDelta = d - lastCompilation;
    lastCompilation = d;

    //run python code using skuplt
    var prog = myCodeMirror.getValue(); 
    var mypre = document.getElementById("output"); 
    Sk.pre = "output";
    Sk.configure({output:outf, read:builtinRead}); 
    var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    checkForPrint(prog);
    myPromise.then(function(mod) {
       console.log('success');
       mypre.innerHTML = mypre.innerHTML +  "\n>"; 
       $('#output').scrollTop($('#output')[0].scrollHeight);
       lastCompileSuccessful = true;
    },
    function(err) {
       outf(err.toString());
       console.log(err);
       clearTimeout(lastSetTimeout);
       lineError = getErrLineNum(err);
       lastSetTimeout = setTimeout(function(){ 
         lineError = '';
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
  if (lineError){
    if (Math.abs(changeObj.to.line - lineError) < 5){
      lineError='';
      console.log("METRIC editErrLineNum_edit");
    }
    //if they edit somewhere else first, that doesn't count
    else {
      lineError = '';
    }
  }
}

function cursorChange(cMirror) {
   sel = myCodeMirror.getSelection(); //literally a string of what is selected

   //Evaluating Metric: editErrLineNum
    if (lineError){
      if (Math.abs(myCodeMirror.getCursor().line - lineError) < 5){
        lineError='';
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
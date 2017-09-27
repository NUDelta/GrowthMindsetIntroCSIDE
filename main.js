var mousedown = false;
var lastCompilation;
var lineError = '';
var myCodeMirror;
var charCount;
$(document).ready(function(e) {
  //set up screen
  myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
  mode:  "python",
  theme: 'monokai',
  });

  var charCount = myCodeMirror.getValue().length;
  //Run Button listener
  $('#runButton').onclick = function(e) {
   runit(myCodeMirror);
  }
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
   var d = new Date(); 
   d.getTime();
   //how to get time between compilations
   //console.log(d- lastCompilation);
   lastCompilation = d;
   var prog = myCodeMirror.getValue(); 
   var mypre = document.getElementById("output"); 

   Sk.pre = "output";
   // this should realy be after promise is fullfilled, but i'm not sure how to do that when i want it to go after all the outputs
   mypre.innerHTML = mypre.innerHTML +  "\n>"; 

   Sk.configure({output:outf, read:builtinRead}); 
   var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
   });
   myPromise.then(function(mod) {
       console.log('success');
       $('#output').scrollTop($('#output')[0].scrollHeight);
   },
   function(err) {
       outf(err.toString());
       console.log(err);
       clearTimeout(lastSetTimeout);
       lineError = getErrLineNum(err);
       lastSetTimeout = setTimeout(function(){ 
        lineError = '';
        console.log('reset LineNum') 
    }, 30000)
       $('#output').scrollTop($('#output')[0].scrollHeight);
   });
     
} 

function editorChange(changeObj) {
  if (changeObj.from.line == changeObj.to.line && changeObj.from.ch == changeObj.to.ch){
    console.log('same');
  }
  newCharCount = myCodeMirror.getValue().length;
  if (newCharCount-charCount>2){
    console.log('METRIC: paste')
  }
  charCount = newCharCount;
  console.log(lineError);
  if (lineError){
    if (Math.abs(changeObj.to.line - lineError) <3){
      lineError=''
      console.log("METRIC edit Line num")
    }
  }
}

function cursorChange(cMirror) {
   sel = myCodeMirror.getSelection(); //literally a string of what is selected
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

document.onkeypress = function (event) {
  // console.log(event);
}

/*  getErrLineNum
    inputs: msg - string of error message
    output: number of line error occured on
*/
function getErrLineNum(err) {
  var lineNum = err.traceback[0].lineno;
  return lineNum
}
var mousedown = false;
var lastCompilation;
var lineError = '';
var myCodeMirror;
var charCount;
var lastKeyPressed;


$(document).ready(function(e) {

  //set up screen
  myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode:  "python",
    theme: 'monokai',
    extraKeys: {
      //"Enter": onNewLine
    },
    indentWithTabs: true
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
  myCodeMirror.on('onKeyDown', function(e){
    console.log('key');
    console.log(e);
    lastKeyPressed = e.which;
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
   myPromise.then(function(mod) {
       console.log('success');
       mypre.innerHTML = mypre.innerHTML +  "\n>"; 
       $('#output').scrollTop($('#output')[0].scrollHeight);
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

document.getElementById("simbutton").onclick = function(){
    
    console.log("in here");
    document.getElementById("output").innerHTML += "great process: You are growing your skills! \n";

};





// function onNewLine(e){
//   console.log(e);
//   myCodeMirror.replaceSelection("\n" ,"end");
//   lastKeyPressed = 'enter';
// }
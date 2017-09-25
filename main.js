
// $(document).ready(function () {
//     console.log("hi");
//     Selection.on("changeSelection", function(){
//         console.log('select');
//     });
// });

console.log(CodeMirror);
// var editor = document.createElement('div')
// editor.className = 'editor'

//     var button = document.createElement('div')
//     button.className = 'editor-button'
//     button.innerHTML = 'Run'
// editor.appendChild(button)

// var editorArea = document.createElement('textarea')
// editorArea.className = 'editor-area'
// editorArea.id = "hi"
// editor.appendChild(editorArea)

var myCodeMirror = CodeMirror(document.body, {
  value: "function myScript(){return 100;}\n",
  mode:  "python",
  theme: 'monokai'
});

var button = document.createElement('div')
button.className = 'editor-button'
button.innerHTML = 'Run'
document.body.appendChild(button)

button.onclick = function(e) {
	console.log(myCodeMirror.getValue());
	// $.ajax({
 //   url: "/path/to/your/script",
 //   success: function(response) {
     // here you do whatever you want with the response variable
   // }
// });
    // var eid = challenge.name;
    // resetMessages(this.parentElement);
    // try {
    //     var fn = execute(signature.innerHTML, cmEditor.getValue());
    //     challenge.implementation = fn;
    //     var results = challenge.runTests();;
    //     displayResults(results, this.parentElement);
    // } catch (e) {
    //     displayError(e.message, this.parentElement);
    // }
}
// var cmEditor = CodeMirror.fromTextArea(editorArea, {
//     mode: 'python',
//     lineWrapping: true,
//     lineNumbers: true,
//     theme: 'monokai',
//     smartIndent: false,
//     electricChars: false
// });

// cmEditor.refresh();

// document.body.appendChild( editor );
console.log(document);
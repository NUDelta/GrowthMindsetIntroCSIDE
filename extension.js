// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "test" is now active!');

    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.sayHello', function () {

        vscode.workspace.onDidChangeTextDocument(handleChange);
        vscode.window.onDidChangeTextEditorSelection(onSelection);
        vscode.debug.onDidChangeActiveDebugSession(changeDeb);
        vscode.window.onDidCloseTerminal(closeTerm);
        vscode.debug.onDidReceiveDebugSessionCustomEvent(customDeb);
        
        vscode.debug.onDidStartDebugSession(startDeb);
        
        vscode.debug.onDidTerminateDebugSession(endDeb);
    })
     console.log(vscode.debug.activeDebugSession);
    
}
exports.activate = activate;
function closeTerm(event){
    console.log("close term");
    console.log(event);
}
function changeDeb(event) {
    console.log("change deb");
    console.log(event);
}
function customDeb(event) {
    console.log("custom deb");
    console.log(event);
}
function startDeb(event) {
    console.log("start deb");
    console.log(event);
    console.log('active');
    console.log(vscode.window);
}
function endDeb(event) {
    console.log("end deb");
    console.log(event);
}

function handleChange(event) {
    var selection = event.contentChanges[0];
    var letter = selection.text;
    var line = selection.range.start.line;
    console.log("New key press: key: " + letter + " line: " + line + " character: " + selection.range.start.character );
}

function onSelection(event){
    var select = event.selections[0];

    if (!select.isEmpty) {
        console.log('New selection: start line: ' + select.start.line + ' start character: ' + select.start.character + ' end line: ' + select.end.line + ' end character: ' + select.end.character );
    }

    if (select.isEmpty) {
        if (event.kind == 2){
            console.log('Click:  line: ' + select.start.line + '  character: ' + select.start.character );                    
        }
    }
}

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
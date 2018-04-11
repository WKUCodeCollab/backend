//Chat code altered from: https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
const fs = require('fs');
const shell = require('shelljs');

// starting text for the code editor
var body = "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World\");\n\t}\n}";

module.exports = function (io) {

    io.sockets.on('connection', (socket) => {

        // Log whenever a user connects
        console.log('user connected');

        // send signal to refresh editor to client
        socket.emit('refreshEditor', {body: body});

        // update body when refreshEditor is recieved
        socket.on('refreshEditor', function (body_) {
            console.log('new body: ' + body_);
            body = body_;
        });

        // Log whenever a client disconnects from our websocket server
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        // When we receive a 'message' event from our client, print out
        // the contents of that message and then echo it back to our client
        // using `io.emit()`
        socket.on('message', (message) => {
            console.log("Message Received: " + message);
            io.emit('message', {type:'new-message', text: message});
        });

        // Receive editorChange signal and obj with changes, re-emit to all except sender
        socket.on('editorChange', (changesObj) => {
            console.log("changes recieved: " + changesObj);
            if (changesObj.origin == '+input' || changesObj.origin == 'paste' || changesObj.origin == '+delete' || changesObj.origin == 'undo'){
                socket.broadcast.emit('editorChange', changesObj);
            }
        });

        //Receive runCode signal and obj with editor text
        //Create text file and call docker script
        socket.on('runCode', (code) => {
            console.log("Code to run: " + code.codeToRun);
            fs.writeFile('./run-code/Main.java', code.codeToRun, function (err) {
            if (err) throw err;
                console.log('Saved!');
                shell.exec('docker exec JDK /bin/sh -c "javac usr/src/dockerTest/Main.java"');
                shell.exec('docker exec JDK /bin/sh -c "cd usr/src/dockerTest; java Main > output.txt"');
                console.log('executed');
                
                fs.readFile('./run-code/output.txt', (err, data) => {
                    if (err) throw err;
                    console.log(data + "");
                    io.emit('consoleOutput', {output: data+""} );
                });
            });
        });
    });
}

//Chat code altered from: https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
const fs = require('fs');
const shell = require('shelljs');

// starting text for the code editor
var body = "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World\");\n\t}\n}";
var room;
var roomNum;

module.exports = function (io) {

    io.sockets.on('connection', (socket) => {

        // Log whenever a user connects
        console.log('user connected');

        // once a client has connected, we expect to get a ping from them saying what room they want to join
        socket.on('room', function(roomNumber) {
            //create and join private room based on groupid
            room = io.of("/"+roomNumber);
            socket.join(roomNumber);
            roomNum = roomNumber;

            var roomCount = io.sockets.adapter.rooms[roomNum];
            if (roomCount.length == 1) {
                shell.exec("mkdir ~/userfiles/" + roomNum);
                shell.exec("docker run -d -t -v ~/userfiles/" + roomNum + ":/usr/src/userfiles --name " + roomNum +" openjdk");
            }

            // send signal to refresh editor to client
            io.in(roomNum).emit('refreshEditor', {body: body});
        });
        

        // update body when refreshEditor is recieved
        socket.on('refreshEditor', function (body_) {
            console.log('new body: ' + body_);
            body = body_;
        });

        // Log whenever a client disconnects from our websocket server
        socket.on('disconnect', function(){
            console.log('user disconnected');
            var roomCount = io.sockets.adapter.rooms[roomNum];
            if (!roomCount) {
                shell.exec("docker container stop " + roomNum);
                shell.exec("docker container rm " + roomNum);
                shell.exec("rm -r ~/userfiles/" + roomNum);
            }
        });

        // When we receive a 'message' event from our client, print out
        // the contents of that message and then echo it back to our client
        // using `io.emit()`
        socket.on('message', (message) => {
            console.log("Message Received: " + message);
            io.in(roomNum).emit('message', {type:'new-message', text: message});
        });

        // Receive editorChange signal and obj with changes, re-emit to all except sender
        socket.on('editorChange', (changesObj) => {
            console.log("changes recieved: " + changesObj);
            if (changesObj.origin == '+input' || changesObj.origin == 'paste' || changesObj.origin == '+delete' || changesObj.origin == 'undo'){
                io.in(roomNum).emit('editorChange', changesObj);
            }
        });

        //Receive runCode signal and obj with editor text
        //Create text file and call docker script
        socket.on('runCode', (code) => {
            console.log("Code to run: " + code.codeToRun);
            fs.writeFile('/home/mschapmire/userfiles/' + roomNum + '/Main.java', code.codeToRun, function (err) {
            if (err) throw err;
                console.log('Saved!');
                var shellCmd1 = 'docker exec -t ' + roomNum + ' /bin/sh -c "javac usr/src/userfiles/Main.java"';
                var shellCmd2 = 'docker exec -t ' + roomNum + ' /bin/sh -c "cd usr/src/userfiles; java Main"';

                shell.exec(shellCmd1, function(code, stdout, stderr) {
                    console.log('Exit code 1:', code);
                    console.log('Program output 1:', stdout);
                    console.log('Program stderr 1:', stderr);
                    if (stdout) {
                        //handles if an error is outputted
                        fs.writeFile('/home/mschapmire/userfiles/' + roomNum + '/output.txt', stdout, (err) => {
                            if(err) {
                                return console.log(err);
                            }
                            console.log("File saved successfully!");
                            fs.readFile('/home/mschapmire/userfiles/' + roomNum + '/output.txt', (err, data) => {
                                if (err) throw err;
                                console.log(data + "");
                                io.in(roomNum).emit('consoleOutput', {output: data+""} );
                            });                                                   
                        });
                    }

                    if (code == 0 && !stderr){
                        shell.exec(shellCmd2, function(code, stdout, stderr) {
                            console.log('Exit code 2:', code);
                            console.log('Program output 2:', stdout);
                            console.log('Program stderr 2:', stderr);
                            if (stdout){
                                fs.writeFile('/home/mschapmire/userfiles/' + roomNum + '/output.txt', stdout, (err) => {
                                    if(err) {
                                        return console.log(err);
                                    }
                                    console.log("File saved successfully!");
                                    fs.readFile('/home/mschapmire/userfiles/' + roomNum + '/output.txt', (err, data) => {
                                        if (err) throw err;
                                        console.log(data + "");
                                        io.in(roomNum).emit('consoleOutput', {output: data+""} );
                                    });                                
                                });
                            }

                            
                        });
                    }
                });

                console.log('executed');
            });
        });
    });
}

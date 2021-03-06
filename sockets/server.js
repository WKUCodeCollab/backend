//Chat code altered from: https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
const fs = require('fs');
const shell = require('shelljs');
const UserController = require('../controllers/user');

// starting text for the code editor
var body = "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World\");\n\t}\n}";

module.exports = function (io) {

    io.sockets.on('connection', (socket) => {

        // Log whenever a user connects
        console.log('user connected');

        // once a client has connected, we expect to get a ping from them saying what room they want to join
        socket.on('room', function(roomNumber) {
            //check and remove client from old rooms
            Object.keys(socket.rooms).forEach(room => {
                console.log("leaving room: " + room);
                socket.leave(room);
            });

            //get user's first name and set as socket username for messages
            UserController.getUserById(roomNumber.userID)
            .then(data => {
                socket.username = data.firstName;

                //create and join private room based on groupid
                socket.join(roomNumber.groupID, function () {
                    console.log(socket.id + " now in rooms ", socket.rooms);
                    //roomNum = roomNumber;
                    socket.room = roomNumber.groupID;
                    var roomCount = io.sockets.adapter.rooms[socket.room];
                    if (roomCount.length === 1) {
                        body = "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World\");\n\t}\n}";
                        shell.exec("mkdir ~/userfiles/" + socket.room);
                        shell.exec("docker run -d -t -v ~/userfiles/" + socket.room + ":/usr/src/userfiles --name " + "cc" + socket.room +" openjdk");
                    }
        
                    // send signal to refresh editor to client
                    io.in(socket.room).emit('refreshEditor', {body: body});
                });
            });
        });
        

        // update body when refreshEditor is recieved
        socket.on('refreshEditor', function (b) {
            console.log('new body: ' + b);
            body = b;
        });

        // Log whenever a client disconnects from our websocket server
        socket.on('disconnect', function(){
            console.log('user disconnected');
            socket.leave(socket.room);
            var roomCount = io.sockets.adapter.rooms[socket.room];
            if (!roomCount) {
                shell.exec("docker container stop " + "cc" +  socket.room);
                shell.exec("docker container rm " + "cc" + socket.room);
                shell.exec("rm -r ~/userfiles/" + socket.room);
            }
        });

        // When we receive a 'message' event from our client, print out
        // the contents of that message and then echo it back to our client
        // using `io.emit()`
        socket.on('message', (message) => {
            console.log("Message Received: " + message);
            io.in(socket.room).emit('message', {type:'new-message', text: message, name: socket.username});
        });

        // Receive editorChange signal and obj with changes, re-emit to all except sender
        socket.on('editorChange', (changesObj) => {
            console.log("changes recieved: " + changesObj);
            if (changesObj.origin === '+input' || changesObj.origin === 'paste' || changesObj.origin === '+delete' || changesObj.origin === 'undo'){
                socket.broadcast.to(socket.room).emit('editorChange', changesObj);
            }
        });

        //Receive runCode signal and obj with editor text
        //Create text file and call docker script
        socket.on('runCode', (code) => {
            console.log("Code to run: " + code.codeToRun);
            fs.writeFile('/home/mschapmire/userfiles/' + socket.room + '/Main.java', code.codeToRun, function (err) {
                if (err) throw err;

                console.log('Saved!');
                var shellCmd1 = 'docker exec -t ' + "cc" + socket.room + ' /bin/sh -c "javac usr/src/userfiles/Main.java"';
                var shellCmd2;

                //check if object has input property and append to command
                if (code.hasOwnProperty('codeInput')){
                    console.log("input: " + code.codeInput);

                    fs.writeFile('/home/mschapmire/userfiles/' + socket.room + '/input.txt', code.codeInput, (err) => {
                        if(err) {
                            return console.log(err);
                        }
                        console.log("Input File saved successfully!");
                        shellCmd2 = 'docker exec -t ' + "cc" + socket.room + ' /bin/sh -c "cd usr/src/userfiles; java Main < input.txt"';                                               
                    });
                }
                else {
                    shellCmd2 = 'docker exec -t ' + "cc" + socket.room + ' /bin/sh -c "cd usr/src/userfiles; java Main"';
                }

                shell.exec(shellCmd1, function(code, stdout, stderr) {
                    console.log('Exit code 1:', code);
                    console.log('Program output 1:', stdout);
                    console.log('Program stderr 1:', stderr);
                    if (stdout) {
                        //handles if an error is outputted
                        fs.writeFile('/home/mschapmire/userfiles/' + socket.room + '/output.txt', stdout, (err) => {
                            if(err) {
                                return console.log(err);
                            }
                            console.log("File saved successfully!");
                            fs.readFile('/home/mschapmire/userfiles/' + socket.room + '/output.txt', (err, data) => {
                                if (err) throw err;
                                console.log(data + "");
                                io.in(socket.room).emit('consoleOutput', {output: data+""} );
                            });                                                   
                        });
                    }

                    if (code === 0 && !stderr){
                        shell.exec(shellCmd2, function(code, stdout, stderr) {
                            console.log('Exit code 2:', code);
                            console.log('Program output 2:', stdout);
                            console.log('Program stderr 2:', stderr);
                            if (stdout){
                                fs.writeFile('/home/mschapmire/userfiles/' + socket.room + '/output.txt', stdout, (err) => {
                                    if(err) {
                                        return console.log(err);
                                    }
                                    console.log("File saved successfully!");
                                    fs.readFile('/home/mschapmire/userfiles/' + socket.room + '/output.txt', (err, data) => {
                                        if (err) throw err;
                                        console.log(data + "");
                                        io.in(socket.room).emit('consoleOutput', {output: data+""} );
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

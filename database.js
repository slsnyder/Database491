
var socket = io.connect("http://76.28.150.193:8888");

socket.on("load", function (data) {
    console.log(data);
    console.log("loading");
});

socket.emit("load", {studentname: "slsnyder", statename: "cgolstate"});

window.onload = function () {
    
    
    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });
}

window.onkeydown = function (e) {
    if (String.fromCharCode(e.which) === 's') {
        socket.emit("save", {studentname: "slsnyder", statename: "cgolstate", data: currentGameState});
        console.log("saving");
    }
}
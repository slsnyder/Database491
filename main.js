
var socket = io.connect("http://76.28.150.193:8888");
var gameState = INIT_STATE;
var gameEngine;

socket.on("load", function (data) {
    console.log("load");
    console.log(data);
    gameState = data;
    initialize();
});

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
};

window.addEventListener("keydown", function (e) {
        console.log(e);
        console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
		if (String.fromCharCode(e.which) === 'S') {
            console.log("if S");
            socket.emit("save", {studentname: "slsnyder", statename: "cgolstate", data: gameEngine.getGameState()});
        }
        
        if (String.fromCharCode(e.which) === 'L') {
            console.log("if L");
            socket.emit("load", {studentname: "slsnyder", statename: "cgolstate"});
        }
    }, false);
    
function initialize() {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    gameEngine = new GameEngine(INIT_STATE);
    
    var allCells = new Array();
    for (var i = 0; i < (CANVAS_H / CELL_H); i++){
        allCells.push(new Array());
    }
    
    //create cells
    for (var i = 0; i < (CANVAS_H / CELL_H); i++) {
        for (var j = 0; j < (CANVAS_W / CELL_W); j++) {
            var cell = new Cell(gameEngine, i, j);
            allCells[i].push(cell);
            gameEngine.addEntity(cell);
        }
    }
    
    //set neighbors
    for (var i = 0; i < (CANVAS_H / CELL_H); i++) {
        for (var j = 0; j < (CANVAS_W / CELL_W); j++) {
            
            for (var m = -1; m <= 1; m++) {
                for (var n = -1; n <= 1; n++) {
                    var y = i + m;
                    var x = j + n;
                    
                    // if the cell at x,y is in bounds and is not this cell
                    if(y >= 0 && y < (CANVAS_H / CELL_H) &&
                        x >= 0 && x < (CANVAS_W / CELL_W) &&
                        (y != i || x != j) )
                            allCells[i][j].neighbors.push(allCells[y][x]);
                }
            }
            
        }
    }
    
    gameEngine.init(ctx);
    gameEngine.start();
}

function Cell(game, yIndex, xIndex) {
    this.cellTimer = 0;
    this.game = game;
    this.alive = this.game.gameState[yIndex][xIndex];
    this.aliveNext = this.alive;
    this.x = xIndex * CELL_W;
    this.y = yIndex * CELL_H;
    this.neighbors = new Array();
};

Cell.prototype = new Entity();
Cell.prototype.constructor = Cell;

Cell.prototype.liveNeighbors = function () {
    var total = 0;
    for (var i = 0; i < this.neighbors.length; i++) {
        if (this.neighbors[i].alive) total++;
    }
    return total;
};

Cell.prototype.readyUpdate = function () {
    if (++this.cellTimer === DURATION) {
        this.cellTimer = 0;
        this.aliveNext = 0;
        if ( (this.alive && this.liveNeighbors() === 2)
            || this.liveNeighbors() === 3 ) {
                this.aliveNext = 1;
        } 
    }
    //Entity.prototype.update.call(this);
};

Cell.prototype.update = function () {
    this.alive = this.aliveNext;
    Entity.prototype.update.call(this);
};

Cell.prototype.draw = function (ctx) {
    if (this.alive) {
        ctx.fillStyle = "forestgreen";
        ctx.fillRect(this.x, this.y, CELL_W, CELL_H);
    }
    ctx.strokeStyle = "lightgreen";
    ctx.strokeRect(this.x, this.y, CELL_W, CELL_H);
};


var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/bg.jpg");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up");
    initialize();
});


var WORLD;
var RENDER;

var terrain_seed = 55000;
var seed = new Seed(terrain_seed);

// start and end of path
var pathStart = [0, 0];
var pathEnd = [0, 0];
var currentPath = [];
var currentPos = [];

var clickCanvas;

// ensure that concole.log doesn't cause errors
if (typeof console == "undefined") var console = {
    log: function() {}
};

// the html page is ready
function onload() {
    console.log('Page loaded.');
    
    WORLD = new World(256, 256, 1);
    WORLD.createWorld();
    
    RENDER = new Render('gameCanvas');
    RENDER.canvas.width = WORLD.width * RENDER.tileWidth;
    RENDER.canvas.height = WORLD.height * RENDER.tileHeight;
    
    click = RENDER;
    click.canvas.addEventListener("click", canvasClick, false);
    
    RENDER.redraw(WORLD, WORLD.data);
    
    step(0);
}

function step(timestamp) {
    
    while (currentPath.length == 0) {
        console.log('Calcul');
        
        pathStart = pathEnd;
        pathEnd = [Math.floor(Math.random() * WORLD.width), Math.floor(Math.random() * WORLD.height)];
        
        var cell = (pathStart[0] + pathStart[1] * WORLD.width) * 4;
        currentPath = findPath(WORLD, pathStart, pathEnd, 'Manhattan');
    }
    
    // draw the path
    currentPos = currentPath.shift();
    
    RENDER.localRedraw(WORLD, WORLD.data, currentPos, 1);
    
    click.ctx.fillStyle = '#00ff00'
    click.ctx.fillRect( currentPos[0] * RENDER.tileWidth, currentPos[1] * RENDER.tileHeight, RENDER.tileWidth, RENDER.tileHeight);
    
    requestAnimationFrame(step);
}

// handle click events on the canvas
function canvasClick(e) {
    var x;
    var y;

    // grab html page coords
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }

    // make them relative to the canvas only
    x -= click.canvas.offsetLeft;
    y -= click.canvas.offsetTop;

    // return tile x,y that we clicked
    var cell = [
        Math.floor(x / RENDER.tileWidth),
        Math.floor(y / RENDER.tileHeight)
    ];

    // now we know while tile we clicked
    console.log('we clicked tile ' + cell[0] + ',' + cell[1]);

    pathStart = pathEnd;
    pathEnd = cell;

    // calculate path
    currentPath = findPath(WORLD, pathStart, pathEnd);
    RENDER.redraw(WORLD, WORLD.data);
}


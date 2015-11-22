function Render (id) {

    // size of a tile in pixels
    this.tileWidth = 1;
    this.tileHeight = 1;
    
    this.canvas = document.getElementById('heightMap');
    this.ctx = this.canvas.getContext("2d");
                
    //this.canvas.addEventListener("click", canvasClick, false);

    this.redraw = function (world, data) {

        console.log('redrawing...');
        
        this.world = world;
        this.canvas.width = WORLD.width;
        this.canvas.height = WORLD.height;

        // clear the screen
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (var x = 0; x < world.width; x++) {
            for (var y = 0; y < world.height; y++) {
                this.ctx.fillStyle = '#'+rgbToHex([world.get(x,y), world.get(x,y), world.get(x,y)]);
                this.ctx.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
            }
        }
    }

    this.player = function (pos, size) {

        console.log('local redrawing...');
        
        for (var x = pos[0]-size; x < pos[0]+size+1; x++) {
            for (var y = pos[1]-size; y < pos[1]+size+1; y++) {
                this.ctx.fillStyle = '#'+rgbToHex([this.world.get(x,y), this.world.get(x,y), this.world.get(x,y)]);
                this.ctx.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
            }
        }
    
        this.ctx.fillStyle = '#ff0000'
        this.ctx.fillRect( pos[0], pos[1], 1, 1);
    };

    this.end = function (pos, size) {

        console.log('local redrawing...');
        
        for (var x = pos[0]-size; x < pos[0]+size+1; x++) {
            for (var y = pos[1]-size; y < pos[1]+size+1; y++) {
                this.ctx.fillStyle = '#'+rgbToHex([this.world.get(x,y), this.world.get(x,y), this.world.get(x,y)]);
                this.ctx.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
            }
        }
    
        this.ctx.fillStyle = '#00ff00'
        this.ctx.fillRect( pos[0], pos[1], 1, 1);
    };
}

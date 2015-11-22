
function World(detail, water) {
    
    this.size = detail-1;
    
    // size in the world in sprite tiles
    this.width = this.size+1;
    this.height = this.size+1;
    this.water = water;
    
    // all world data
    this.data = [];
    
    // get cell
    this.get =  function( x, y ) {
        var cell = x + y * this.width;
        if(this.data[cell] == undefined)
            this.data[cell] = 255;
        return this.data[cell];
    }
    // set cell
    this.set =  function ( x, y, data ) {
        var cell = x + y * this.width;
        if(data < 0) data = 0;
        this.data[cell] = Math.round(data);
    }
    // fusion
    this.add = function ( x, y, add ) {
        var cell = this.get(x, y);
            cell = Math.round((cell+add)/2);
        this.set(x, y, cell);
    }
    // fusion
    this.prod = function ( x, y, add ) {
        var cell = this.get(x, y);
            cell = Math.round((cell*add)/255);
        this.set(x, y, cell);
    }
    
    // fill the world with walls
    this.createWorld =  function () {
        console.log('Creating world...');

        // base Montagne
        var max = (this.size+1)/2;

        // noise first
        noise.seed(seed.random());
        
        for (var x = 0; x < this.width; x++) {
          for (var y = 0; y < this.height; y++) {
            
            var cell = x + y * this.width;
            var value = 0;
            
            // base Montagne
            var dx = ((this.width-1)/2)-x
            var dy = ((this.height-1)/2)-y
          
            value = Math.sqrt(dx*dx+dy*dy);
            value = (max-value < 0?0:max-value)/max*255;
            this.set(x, y, value);
            
            // noise first
            value = Math.abs(noise.simplex2(x / (this.width/2), y / (this.height/2)));
            value *= 255;
            this.prod(x, y, value);
            
            // noise second
            value = Math.abs(noise.simplex2(x / (this.width/16), y / (this.height/16)));
            value *= 64;
            value += 128+64;
            this.prod(x, y, value);
            
            // water
            //if( this.get(x, y) < this.water ) {
            //    this.set(x, y, 0);
            //}
            
          }
        }

    };
    
    // fill the world with walls
    this.createWorld2 =  function (roughness) {
        console.log('Creating world 2...');
        
        var self = this;
        this.max = this.size;

        this.set(0, 0, 0);
        this.set(this.size, 0, 255 / 2);
        this.set(this.size, this.size, 0);
        this.set(0, this.size, 255 / 2);
        console.log(this.data);

        divide(this.size);

        function divide(size) {
            var x, y, half = size / 2;
            var scale = roughness * size;
            if (half < 1) return;

            for (y = half; y < self.max; y += size) {
                for (x = half; x < self.max; x += size) {
                    square(x, y, half, seed.random() * scale * 2 - scale);
                }
            }
            for (y = 0; y <= self.max; y += half) {
                for (x = (y + half) % size; x <= self.max; x += size) {
                    diamond(x, y, half, seed.random() * scale * 2 - scale);
                }
            }
            divide(size / 2);
        }

        function average(values) {
            var valid = values.filter(function (val) {
                return val !== -1;
            });
            var total = valid.reduce(function (sum, val) {
                return sum + val;
            }, 0);
            return total / valid.length;
        }

        function square(x, y, size, offset) {
            var ave = average([
                self.get(x - size, y - size), // upper left
                self.get(x + size, y - size), // upper right
                self.get(x + size, y + size), // lower right
                self.get(x - size, y + size) // lower left
            ]);
            self.set(x, y, ave + offset);
        }

        function diamond(x, y, size, offset) {
            var ave = average([
                self.get(x, y - size), // top
                self.get(x + size, y), // right
                self.get(x, y + size), // bottom
                self.get(x - size, y) // left
            ]);
            self.set(x, y, ave + offset);
        }
    };
    
}

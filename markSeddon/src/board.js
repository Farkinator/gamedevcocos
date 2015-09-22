

var Board = cc.Sprite.extend({
    ctor:function() {
        this._super(res.board_png);
        this.arr_size = 8;
        this.block_size = 50;
        this.block_offset = 5;
        //this.rotation_speed: 15;
        this.locked = true;
        this.arr = [];
        this.instantiate();
    },
    getCoord:function(x,y){
            //Returns the pixel coordinates for the given array coordinates on the board. This is LOCAL COORDINATES
            //meaning the value should only be used by children of the board (or be converted to global coordinates
            //before being used)
            var out = {x:0,y:0};
            out.x = this.block_size * x + (this.block_offset - 1) * x;
            out.y = this.block_size * y + (this.block_offset - 1) * y;
            return out;
    },

    instantiate:function () {
        //This function will clear arr if needed, and then fill it with blocks. Call it whenever you need to refresh the
        //gameboard (including at the beginning of the game)
        this.arr = [];
        for (var i = 0; i < this.arr_size; i++) {
            this.arr.push([]);
            for(var j = 0; j < this.arr_size; j++){
                this.arr[i].push(null);
            }
        }
        for (var i = 0; i < this.arr_size; i++) {
            this.dropDown(i,0);
        }
        this.locked = false;
    },


    dropDown:function (x, y) {
        //Dropdown should be called if there is an empty (null) square at (x,y). The above blocks will fall, and new
        //blocks will be created until all spaces above and incloding (x,y) have a non-null block.
        //AFTER MOVING, BLOCKS MUST CALL Board.unlock().
        this.locked = true;
        if(this.arr[x][y] != null){
            console.log("Error: calling dropdown on a square with a tile is an invalid operation.");
            this.locked = false;
            return;
        }
        if(y < this.arr_size) {
            if(y == this.arr_size - 1){
                //if this is the top row...
                var temp = new Block(x,y,this);
                this.arr[x][y] = temp;
                this.addChild(temp);
            }else{
                if(this.arr[x][y+1] == null){
                    //If the square above is empty too, it needs to not be empty before anything else happens.
                    this.dropDown(x,y+1);
                }else{
                    //Otherwise bring it down here, and then recursively drop everything above it.
                    var moving = this.arr[x][y+1];
                    moving.moveDown();
                    this.arr[x][y] = moving;
                    this.arr[x][y+1] = null;
                    this.dropDown(x,y+1);
                }
                while(this.arr[x][y] == null){
                    //A cleanup call to make sure nothing is left hanging.
                    console.log("an additional dropdown was required.");
                    this.dropDown(x,y);
                }
            }
        }
    },


    unlock:function(){
        //Unlocked the array. This makes it accept user input again. (Should be locked when any visual things are
        //happening.
        console.log("unlock function used.");
        this.locked = false;
    },


    arrayRotate:function(){
        //Rotates the arr array. This should only be called by the local rotate() function!
        var temp = [];
        var arr = this.arr;
        var displaced;
        for(var i = 0;i < this.arr.length;i++){
            //First creates a temporary array.
            temp.push([]);
            for(var j = 0; j < arr.length; j++){
                temp[i].push(null);
            }
        }
        for(var i = 0; i < this.arr.length;i++){
            //Then moves the objects in arr to the temporary array rotated.
            for(var j = 0; j < this.arr.length; j++){
                console.log("x: " + i + " y: " + j + " to x: " + j + " y: " + ((temp.length - 1)-i));
                //console.log(i);
                temp[j][(temp.length - 1) - i] = this.arr[i][j];
            }
        }
        for(var i = 0; i < this.arr.length; i++){
            //then copies everything in the temporary array to arr.
            for(var j = 0; j < this.arr.length; j++){
                this.arr[i][j] = temp[i][j];
            }
        }
    },


    getBlock:function(x,y){
        //returns the block in arr at (x,y)
        return this.arr[x][y];
    },


    rotate:function(){
        //This rotates the board counter-clockwise, both visually and internally.
        this.locked = true;//The player should not be able to make moves while the board is rotating.
        this.array_rotate();//This rotates the array.
        var rotate_action = RotateBy.create(1,-90);
        var unlock = function(){this.locked = false;};
        var sequence = Sequence.create(rotate_action,unlock);
        this.runAction(sequence);
    },

    delete:function(x,y){
        //Makes x,y null. Call dropDown() on this location soon after calling this function, and also visually delte
        //the block.
        this.arr[x][y] = null;
    }
        /*
        this.switch = function(x1,y1,x2,y2){
            var temp = arr[x1][y1];
            arr[x1][y1] = arr[x2][y2];
            arr[x2][y2] = temp;
        }*/
            //NOTE: blocks should do the switching.
});
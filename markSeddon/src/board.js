

var Board = cc.Sprite.extend({
    ctor:function(){
        this._super();
        this.arr_size = 8;
        this.block_size = 50;
        this.block_offset =  5;
        //this.rotation_speed: 15;
        this.locked = true;
        this.arr = [];

        this.getCoord = function(x,y){
            //Returns the pixel coordinates for the given array coordinates on the board. This is LOCAL COORDINATES
            //meaning the value should only be used by children of the board (or be converted to global coordinates
            //before being used)
            var out = new vec2(0,0);
            out.x = block_size * x + (block_offset - 1) * x;
        };

        this.instantiate = function () {
            //This function will clear arr if needed, and then fill it with blocks. Call it whenever you need to refresh the
            //gameboard (including at the beginning of the game)
            arr = [];
            for (var i = 0; i < arr_size; i++) {
                arr.add([]);
                for(var j = 0; j < arr_size; j++){
                    arr[i].add(null);
                }
            }
            for (var i = 0; i < arr_size; i++) {
                this.dropdown(i,0);
            }
            locked = false;
        };


        this.dropDown = function (x, y) {
            //Dropdown should be called if there is an empty (null) square at (x,y). The above blocks will fall, and new
            //blocks will be created until all spaces above and incloding (x,y) have a non-null block.
            //AFTER MOVING, BLOCKS MUST CALL Board.unlock().
            locked = true;
            if(arr[x][y] != null){
                console.log("Error: calling dropdown on a square with a tile is an invalid operation.");
                locked = false;
                return;
            }
            if(y < arr_size) {
                if(y == arr_size - 1){
                    //if this is the top row...
                    var temp = new Block(x,y,this);
                    arr[x][y] = temp;
                    this.addChild(temp);
                }else{
                    if(arr[x][y+1] == null){
                        //If the square above is empty too, it needs to not be empty before anything else happens.
                        this.dropdown(x,y+1);
                    }else{
                        //Otherwise bring it down here, and then recursively drop everything above it.
                        var moving = arr[x][y+1];
                        moving.moveDown();
                        arr[x][y] = moving;
                        arr[x][y+1] = null;
                        this.dropdown(x,y+1);
                    }
                    while(arr[x][y] == null){
                        //A cleanup call to make sure nothing is left hanging.
                        console.log("an additional dropdown was required.");
                        this.dropdown(x,y);
                    }
                }
            }
        };


        this.unlock = function(){
            //Unlocked the array. This makes it accept user input again. (Should be locked when any visual things are
            //happening.
            console.log("unlock function used.");
            locked = false;
        };


        this.arrayRotate = function(){
            //Rotates the arr array. This should only be called by the local rotate() function!
            var temp = [];
            var arr = this.arr;
            var displaced;
            for(var i = 0;i < arr.length;i++){
                //First creates a temporary array.
                temp.push([]);
                for(var j = 0; j < arr.length; j++){
                    temp[i].push(null);
                }
            }
            for(var i = 0; i < arr.length;i++){
                //Then moves the objects in arr to the temporary array rotated.
                for(var j = 0; j < arr.length; j++){
                    console.log("x: " + i + " y: " + j + " to x: " + j + " y: " + ((temp.length - 1)-i));
                    //console.log(i);
                    temp[j][(temp.length - 1) - i] = this.arr[i][j];
                }
            }
            for(var i = 0; i < arr.length; i++){
                //then copies everything in the temporary array to arr.
                for(var j = 0; j < arr.length; j++){
                    arr[i][j] = temp[i][j];
                }
            }
        };


        this.getBlock = function(x,y){
            //returns the block in arr at (x,y)
            return arr[x][y];
        };


        this.rotate = function(){
            //This rotates the board counter-clockwise, both visually and internally.
            locked = true;//The player should not be able to make moves while the board is rotating.
            array_rotate();//This rotates the array.
            var rotate_action = RotateBy.create(1,-90);
            var unlock = function(){this.locked = false;};
            var sequence = Sequence.create(rotate_action,unlock);
            this.runAction(sequence);
        };

        this.delete = function(x,y){
            //Makes x,y null. Call dropDown() on this location soon after calling this function, and also visually delte
            //the block.
            arr[x][y] = null;
        };
        this.instantiate();
        /*
        this.switch = function(x1,y1,x2,y2){
            var temp = arr[x1][y1];
            arr[x1][y1] = arr[x2][y2];
            arr[x2][y2] = temp;
        }*/
            //NOTE: blocks should do the switching.
        }
    });
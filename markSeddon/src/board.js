

var Board = cc.Sprite.extend({
    ctor:function() {
        this._super(res.board_png);
        BOARD = this;
        this.click_queue = null;
        this.arr_size = 8;
        this.block_size = 64; //how big the blocks are (diameter or width/height) on the longest dimension.
        this.block_offset = 16; //how much space is in between blocks in the board
        this.block_boarder = 24; //how thick the edges of the board are.
        //this.rotation_speed: 15;
        this.locked = 0;//Number of movement actions happening. if this is a falsey value (0) then the board is unlocked
                        //and will accept user input. Otherwise it is locked. Should always be >=0. Whenever something
                        //adds to this value it must later subtract from it an equal amount.
        this.arr = [];
        SCORE = 0;
        this.instantiate();
    },
        _getCoord:function(x,y) {
            //Helper funcition for getCoord. Don't call this.
            var out = {x:0,y:0};
            out.x = this.block_boarder + this.block_size * (x + .5) + (this.block_offset) * (x-1);
            out.y = this.block_boarder + this.block_size * (y + .5) + (this.block_offset) * (y-1);
            //console.log("goes to X: " + x + " Y: " + y);
            return out;
        },
    getCoord:function(x,y){
            //Returns the pixel coordinates for the given array coordinates on the board. This is LOCAL COORDINATES
            //meaning the value should only be used by children of the board (or be converted to global coordinates
            //before being used)
            //Works when the board is rotated.
            //console.log("X: " + x + " Y: " + y);

            if(this.rotation == 0){
                return this._getCoord(x,y);
            }
            if(this.rotation == 270){
                return this._getCoord(y,(this.arr_size-1)-x);
            }
            if(this.rotation == 180){
                return this._getCoord((this.arr_size-1)-x,(this.arr_size-1)-y);
            }
            if(this.rotation == 90){
                return this._getCoord((this.arr_size-1)-y,x);
            }
            console.log("Error, the board is out of alignment!!!!!<-(x5 bad)");
            //return out;
    },

    instantiate:function () {
        //This function will clear arr if needed, and then fill it with blocks. Call it whenever you need to refresh the
        //gameboard (including at the beginning of the game)
        console.log("INSTANTIATE THIS");
        if(this.arr[0] != null && this.arr[0][0] != null){
            this.boardIterate(function(block){
                block.board.delete(block.col,block.row);
            });
        }
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
        //****************************************
        //if (!(this.prep_check_moves())){
        //    console.log("no moves - rebuilding");
        //    this.instantiate();
        //}
        //****************************************
    },
    click:function(x,y){
        //notifies the board that the block at array coordinates x y is clicked.
        //console.log(x + ', ' + y + " clicked");
        if(this.click_queue == null){
            this.click_queue = this.arr[x][y];
        }else{
            if(this.click_queue.adjacent(this.arr[x][y])){
                this.click_queue.swap(this.arr[x][y]);
                this.click_queue = null;
            }else{
                this.click_queue = this.arr[x][y];
            }
        }
    },
    swap:function(x1,y1,x2,y2){
        console.log(x1 + "," + y1 + ":" + x2 + "," + y2);
        if(!this.arr[x1][y1].adjacent(this.arr[x2][y2])){
            console.log("warning - swapping two blocks that are not adjacent");
        }
        var block1 = this.arr[x1][y1];
        var block2 = this.arr[x2][y2];
        block1.moveTo(this.getCoord(x2,y2));
        block2.moveTo(this.getCoord(x1,y1));
        block1.row = y2;
        block1.col = x2;
        block2.row = y1;
        block2.col = x1;
        this.arr[x2][y2] = block1;
        this.arr[x1][y1] = block2;
    },

    prep_check_moves:function()
    {
        for (var i = 0; i < this.arr_size; i++)
        {
            var bool;
            for (var j = 0; j < this.arr_size; j++)
            {
                if (i < 7)
                {
                    var n1 = i + 1;
                    bool = (this.arr[n1][j]).are_there_moves();
                    if (bool)
                        return true;
                }
                if (i > 0)
                {
                    var n2 = i - 1;
                    bool = (this.arr[n2][j]).are_there_moves();
                    if (bool)
                        return true;
                }
                if (j < 7)
                {
                    var n3 = j + 1;
                    bool = (this.arr[i][n3]).are_there_moves();
                    if (bool)
                        return true;
                }
                if (j > 0)
                {
                    var n4 = j - 1;
                    bool = (this.arr[i][n4]).are_there_moves();
                    if (bool)
                        return true;
                }
            }
            return false;
        }
    },


    dropDown:function (x, y) {
        //Dropdown should be called if there is an empty (null) square at (x,y). The above blocks will fall, and new
        //blocks will be created until all spaces above and incloding (x,y) have a non-null block.
        //AFTER MOVING, BLOCKS MUST CALL Board.unlock().

        if(this.arr[x][y] != null){
            console.log("Error: calling dropdown on a square with a tile is an invalid operation.");
            return;
        }
        if(y < this.arr_size) {
            if(y == this.arr_size - 1){
                //console.log("Top row!");
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
                    //console.log("an additional dropdown was required.");
                    this.dropDown(x,y);
                }
            }
        }
        //this.arr[x][y].check_matches();
    },
    lock:function(){
        //Locks the board, preventing it from accepting user input until unlock is called an equal number of times.
        //console.log("lock function used.");
        this.locked++;
    },

    unlock:function(){
        //Unlocks the board once, making it accept input again unless something else is also locking it.
        //console.log("unlock function used.");
        this.locked--;
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
                //console.log("x: " + i + " y: " + j + " to x: " + j + " y: " + ((temp.length - 1)-i));
                //console.log(i);
                var newx = j;
                var newy = (temp.length - 1) - i;
                this.arr[i][j].row = newy;
                this.arr[i][j].col = newx;
                temp[newx][newy] = this.arr[i][j];
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
        if(y < 0 || x < 0 || y >= this.arr_size || x >= this.arr_size){
            return null;
        }
        //returns the block in arr at (x,y)
        return this.arr[x][y];
    },

    boardIterate:function(func){
        //applies the supplied function to every block in the board.
        for(var i = 0; i < this.arr.length; i++){
            for(var j = 0; j < this.arr[i].length; j++){
                func(this.arr[i][j]);
            }
        }
    },

    //var seq = new cc.Sequence (
    //    new cc.EaseOut(new cc.MoveTo(1,touchLoc),3.0),
    //    callback);
    rotate:function(){
        if(this.locked){
            console.log("Warning, board is rotating while locked.");
        }
        //This rotates the board counter-clockwise, both visually and internally.
        this.lock();//The player should not be able to make moves while the board is rotating.
        this.arrayRotate();//This rotates the array.
        this.boardIterate(function(block){
            var rotate_action = new cc.RotateBy(1,-90);
            block.runAction(rotate_action);
        });
        var sequence =  new cc.Sequence(new cc.RotateBy(1,90),new cc.callFunc(function(a){
            a.unlock();
            if(a.rotation >= 360){
                a.rotation -= 360;
            }
        }));//cc.Sequence.create(rotate_action,unlock);
        this.runAction(sequence);
        //this.runAction(sequence);
    },

    delete:function(x,y){
        //Makes x,y null. Call dropDown() on this location soon after calling this function, and also visually delete
        //the block.
        //console.trace();
        this.arr[x][y].removeFromParentAndCleanup();
        this.arr[x][y] = null;

    }
    //NOTE: blocks should do the switching.
});
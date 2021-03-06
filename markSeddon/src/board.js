
//FIX THE DOUBLE ROTATE BUG.
var Board = cc.Sprite.extend({
    ctor:function() {
        this._super(res.board_png);
        BOARD = this;
        this.click_queue = null;
        this.arr_size = 8;
        this.num_rotates_queued = 0;
        this.blockQueue = [];
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
            return out;
        },
    getCoord:function(x,y){
            //Returns the pixel coordinates for the given array coordinates on the board. This is LOCAL COORDINATES
            //meaning the value should only be used by children of the board (or be converted to global coordinates
            //before being used)
            //Works when the board is rotated.

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
        if (!(this.prep_check_moves())){
            this.instantiate();
        }
        //****************************************
    },
    click:function(x,y){
        //notifies the board that the block at array coordinates x y is clicked.

        if(this.click_queue == null){
            this.click_queue = this.arr[x][y];
            this.click_queue.selected(true);
            //Indicate to the player that this is the block that they are preparing to switch.
        }else{
            if(this.click_queue == this.arr[x][y]){
                this.click_queue.selected(false);
                this.click_queue = null;
                return;
            }
            //De-select the block, then check if swappable.
            this.click_queue.selected(false);
            if(this.click_queue.adjacent(this.arr[x][y])){
                this.click_queue.swap(this.arr[x][y]);
                this.click_queue = null;
            }else{
                this.click_queue = this.arr[x][y];
                this.click_queue.selected(true);
            }

        }
    },
    swap:function(x1,y1,x2,y2){
        if(!this.arr[x1][y1].adjacent(this.arr[x2][y2])){
            console.log("warning - swapping two blocks that are not adjacent");
        }
        var block1 = this.arr[x1][y1];
        var block2 = this.arr[x2][y2];
        block1.moveTo(this.getCoord(x2,y2), false);
        block2.moveTo(this.getCoord(x1,y1), false);
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
            for (var j = 0; j < this.arr_size; j++)
            {
                if (i < (this.arr_size-1))
                {
                    var n1 = i + 1;

                    //Swap the blocks
                    var temp1 = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = (this.arr[n1][j]).block_type;
                    (this.arr[n1][j]).block_type = temp1;

                    //Check if the move was successful
                    if ((this.arr[n1][j]).are_there_moves())
                    {
                        //Swap them back if it was
                        (this.arr[n1][j]).block_type = (this.arr[i][j]).block_type;
                        (this.arr[i][j]).block_type = temp1;
                        return true;
                    }
                    //Swap them back to ensure the board stays the same.
                    (this.arr[n1][j]).block_type = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = temp1;
                }
                if (i > 0)
                {
                    var n2 = i - 1;

                    //Swaps the blocks
                    var temp2 = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = (this.arr[n2][j]).block_type;
                    (this.arr[n2][j]).block_type = temp2;

                    //Check if the move was successful
                    if ((this.arr[n2][j]).are_there_moves())
                    {
                        //Swap them back if it was
                        (this.arr[n2][j]).block_type = (this.arr[i][j]).block_type;
                        (this.arr[i][j]).block_type = temp2;
                        return true;
                    }
                    //Swap them back to ensure the board stays the same
                    (this.arr[n2][j]).block_type = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = temp2;
                }
                if (j < (this.arr_size-1))
                {
                    var n3 = j + 1;

                    //Swap the blocks
                    var temp3 = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = (this.arr[i][n3]).block_type;
                    (this.arr[i][n3]).block_type = temp3;

                    if ((this.arr[i][n3]).are_there_moves())
                    {
                        //Swap them back if it was
                        (this.arr[i][n3]).block_type = (this.arr[i][j]).block_type;
                        (this.arr[i][j]).block_type = temp3;
                        return true;
                    }
                    //Swap them back to ensure the board stays the same
                    (this.arr[i][n3]).block_type = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = temp3;
                }
                if (j > 0)
                {
                    var n4 = j - 1;

                    //Swap the blocks
                    var temp4 = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = (this.arr[i][n4]).block_type;
                    (this.arr[i][n4]).block_type = temp4;

                    if ((this.arr[i][n4]).are_there_moves())
                    {
                        //Swap them back if it was
                        (this.arr[i][n4]).block_type = (this.arr[i][j]).block_type;
                        (this.arr[i][j]).block_type = temp4;
                        return true;
                    }
                    //Swap them back to ensure the board stays the same
                    (this.arr[i][n4]).block_type = (this.arr[i][j]).block_type;
                    (this.arr[i][j]).block_type = temp4;
                }
            }
        }
        return false;
    },


    dropDown:function (x, y) {
        //Dropdown should be called if there is an empty (null) square at (x,y). The above blocks will fall, and new
        //blocks will be created until all spaces above and incloding (x,y) have a non-null block.
        //AFTER MOVING, BLOCKS MUST CALL Board.unlock().
        cc.audioEngine.stopAllEffects();
        this.dropSound = cc.audioEngine.playEffect(res.dropdown_wav);
        if(this.arr[x][y] != null){
            return;
        }
        if(y < this.arr_size) {
            if(y == this.arr_size - 1){
                //if this is the top row...
                var temp;
                if(this.blockQueue.length > 0){
                    temp = this.blockQueue.pop();
                    temp.col = x;
                    temp.row = y;
                }else{
                    temp = new Block(x,y,this);
                }
                var tpos = this.getCoord(x,y+1);
                temp.x = tpos.x;
                temp.y = tpos.y;
                //temp.y += this.block_size;

                temp.moveTo(this.getCoord(x,y));
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
                    this.dropDown(x,y);
                }
            }
        }
        //this.arr[x][y].check_matches();
    },
    lock:function(){
        //Locks the board, preventing it from accepting user input until unlock is called an equal number of times.
        this.locked++;
    },

    unlock:function(){
        //Unlocks the board once, making it accept input again unless something else is also locking it.
        this.locked--;
        if(this.locked == 0 && this.num_rotates_queued > 0){
            this.num_rotates_queued--;
            this.rotate();
        }
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
            this.num_rotates_queued++;
            return;
        }
        //This rotates the board counter-clockwise, both visually and internally.
        this.lock();//The player should not be able to make moves while the board is rotating.
        this.arrayRotate();//This rotates the array.
        this.boardIterate(function(block){
            var rotate_action = new cc.RotateBy(.5,-90);
            block.runAction(rotate_action);
        });
        var sequence =  new cc.Sequence(new cc.RotateBy(.5,90),new cc.callFunc(function(a){
            a.unlock();
            if(a.rotation >= 360){
                a.rotation -= 360;
            }
        }));//cc.Sequence.create(rotate_action,unlock);
        cc.audioEngine.playEffect(res.rotate_wav);
        this.runAction(sequence);
        //this.runAction(sequence);
    },

    delete:function(x,y){
        //Makes x,y null. Call dropDown() on this location soon after calling this function, and also visually delete
        //the block.
        if(this.arr[x][y] == null){
            console.warn("Warning: delete called on a null block.");
            return;
        }
        if(this.arr[x][y].locking){
            this.unlock();
            this.arr[x][y].locking = false;
        }
        cc.audioEngine.playEffect(res.clearblock_wav);
        this.arr[x][y].removeFromParent(true);
        this.arr[x][y] = null;

    }
    //NOTE: blocks should do the switching.
});
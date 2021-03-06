/**
 * Created by Donovk 3 on 9/16/2015.
 */

var Block= cc.Sprite.extend({
    ctor:function(in_col, in_row, in_board,sprite){
        if(in_board == undefined){
            console.log("ERROR - BOARD IS UNDEFINED.");
        }
        swapping = null;
        //Initialization
        if(sprite == undefined){
            var type = this.set_block();
            this._super(res.blocks[type]);
            this.block_type = type;
        }else{
            this._super(sprite);
            this.block_type = 999;
        }
        //console.log("row: " + in_row + " col: " + in_col);
        this.row = in_row;
        this.col = in_col;
        this.board = in_board;
        this.soft_move = function(){};
        this.rotation = 360 - this.board.rotation;
        //console.log(this);
        this.action = null;
        this.locking = false;
        var position = this.board.getCoord(this.col,this.row);
        this.x = position.x;
        this.y = position.y;

        cc.eventManager.addListener (
            cc.EventListener.create ({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: this.onTouchBegan,
                onTouchEnded: this.onTouchEnded
            }),this);
    },
    onTouchBegan: function(touch,event){
        return true;
    },
    onTouchEnded: function (touch,event) {

        var target = event.getCurrentTarget();
        if(target.board.locked){
            //console.log("Locked, click absorbed.");
            return false;
        }

        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0,0,s.width,s.height);
        var out = cc.rectContainsPoint(rect,locationInNode);
        if(out){
            target.board.click(target.col,target.row);
        }
        return true;
    },

    //Methods
    match:function(x,y)
    {
        var block2 = this.board.getBlock(x,y);
        if(block2 == null){
            return false;
        }
        //console.log(this);
        //.log(block2);
        return (this.block_type == block2.block_type);
    },

    set_block:function(){
        var int = Math.floor(Math.random() * 6);
        //var options = ["red", "blue", "green", "orange", "yellow", "purple"];
        return int; //options[int];
    },

    swap:function(block2,secondSwap){
        //console.log("SWAPPED");
        if(secondSwap){
            swapping = null;
        }else{
            swapping = true;
        }
        this.board.swap(this.col,this.row,block2.col,block2.row);

        //this.soft
        //if (!(this.check_matches() || block2.check_matches()))
        //{
        //
        //    console.log("No match.")
        //    //this.board.swap(this.col,this.row,block2.col,block2.row);
        //}
    },
    check_matches:function(block2)
    {
        //Check for all possible matches
        var counter_up = 1;
        var counter_left = 1;
        var counter_right = 1;
        var counter_down = 1;

        while (this.match(this.col-counter_left,this.row)/* && (this.col-counter_left >= 0)*/) { //Check left
            counter_left++;
            //console.log("was left");
        }
        while (this.match(this.col,this.row+counter_up)/* && (this.row+counter_up < 8)*/) { //Check up
            counter_up++;
            //console.log("was up");
        }
        while (this.match(this.col+counter_right,this.row)/* && (this.col+counter_right < 8)*/) { //Check right
            counter_right++;
            //console.log("was right");
        }
        while (this.match(this.col, this.row-counter_down) /*&& (this.row-counter_down >= 0)*/) { //Check down
            counter_down++;
            //console.log("was down");
        }
        var up_down = counter_up + counter_down - 1;
        var left_right = counter_left + counter_right - 1;
        //console.log(this.col + "," + this.row);
        //console.log("up: " + counter_up + " down " + counter_down + " left: " + counter_left + " right " + counter_right);
        if (up_down > 2 && left_right > 2)
        {
            if(left_right > 3){
                this.board.blockQueue.push(new SpecialBlock(0,0,BOARD));
            }
            if(up_down > 3){
                this.board.blockQueue.push(new SpecialBlock(0,0,BOARD));
            }

            var multiplier = up_down-1 + left_right-1;
            //update total score
            //Play match audio effect.
            cc.audioEngine.playEffect(res.match_wav);
            //console.log("MULTIPLIER IS:" + multiplier);
            // Rotate block is block_type 5.
            if(this.block_type == 5){
                console.log("wut wut wut");
                //this.board.rotate();
                this.board.num_rotates_queued++;
            } else if(this.block_type < 5){ /* Otherwise, the  block is normal. Therefore the scores get updated. */
                scoreLayer.updateScore(this.block_type, multiplier-1);

            }
            //Deleting
            //Delete from left to right
            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                this.board.lock();
                this.board.delete(i,this.row);
            }
            //Delete from top to bottom
            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++) {
                this.board.lock();
                this.board.delete(this.col, i);
            }

            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                this.board.unlock();
                this.board.dropDown(i,this.row);
            }
            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++) {
                this.board.unlock();
                this.board.dropDown(this.col, i);
            }

            //console.log(this.board.prep_check_moves());
            if (!(this.board.prep_check_moves()))
            {
                gameOver();
            }
            return true;
        }

        else if (up_down > 2/* && left_right < 3*/)
        {
            if(up_down > 3){
                this.board.blockQueue.push(new SpecialBlock(0,0,BOARD));
            }
            //Scoring
            var multiplier = up_down-1;
            //Play match audio effect.
            cc.audioEngine.playEffect(res.match_wav);
            // Rotate block is block_type 5.
            if(this.block_type == 5){
                //console.log("wut wut wut");
                //this.board.rotate();

                this.board.num_rotates_queued++;
            } else if(this.block_type < 5) { /* Otherwise, the  block is normal. Therefore the scores get updated. */
                scoreLayer.updateScore(this.block_type, multiplier-1);

            }


            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++){
                this.board.lock();
                this.board.delete(this.col,i);
            }
            //Dropping Down
            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++) {
                this.board.unlock();
                this.board.dropDown(this.col, i);
            }

            //console.log(this.board.prep_check_moves());
            if (!(this.board.prep_check_moves()))
            {
                gameOver();
            }
            return true
        }

        else if (left_right > 2/* && up_down < 3*/)
        {
            if(left_right > 3){
                this.board.blockQueue.push(new SpecialBlock(0,0,BOARD));
            }
            //console.log("leftright match, blocktype: "+ this.block_type);
            //console.log("at position: " + this.row + ", " +this.col);
            //Scoring
            var multiplier = left_right - 1;

            //Play match audio effect.
            cc.audioEngine.playEffect(res.match_wav);

            // Rotate block is block_type 5.
            if(this.block_type == 5){
                //this.board.rotate();
                this.board.num_rotates_queued++;
            } else if(this.block_type < 5) { /* Otherwise, the  block is normal. Therefore the scores get updated. */

                scoreLayer.updateScore(this.block_type, multiplier-1);

            }


            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                this.board.lock();
                this.board.delete(i,this.row);
            }

            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                this.board.unlock();
                this.board.dropDown(i,this.row);
            }


            if (!(this.board.prep_check_moves()))
            {
                gameOver();
            }
            return true
        }
        else
        {
            if (!(this.board.prep_check_moves()))
            {
                gameOver();
            }
            return false;
        }
    },
    adjacent:function(block2){
        //Returns true iff this and block2 are next to each other (not diagonally)
        if(Math.abs(this.col - block2.col) + Math.abs(this.row - block2.row) == 1){
            return true;
        }
        return false;
    },
    //Falling is simply a boolean to track whether or not we're hitting the floor because of a swap or because of a fall.
    moveTo:function(dest, falling){
        this.stopAllActions();
        if(this.locking){
            //If actions were stopped, that means there is an extra lock on the board. Remove it.
            this.board.unlock();
        }
        this.board.lock();
        this.locking = true;
        var sequence =  new cc.Sequence(new cc.MoveTo(.5,dest),new cc.callFunc(function(a){
            // This check prevents the hitfloor sound from playing when the player swaps two blocks on the bottom row.
            if(falling) {
                cc.audioEngine.playEffect(res.hitfloor_wav);
            }
            if(a.check_matches() || (a.block_type == 999 && a.inMiddle())) {
                //Swapping should be true when two blocks are swapping, [false,block] if one block failed to swap, and [true,block]
                //if one block succeeded at swapping, and undefined otherwise.
                if (swapping !=  null) {
                    if (swapping === true) {
                        swapping = [true, a];
                    } else {
                        swapping = null;
                        //a.swap(swapping[1], true);
                    }
                }
            }else{
                if(swapping != null){
                    if(swapping === true) {
                        swapping = [false, a];
                    }else if(!swapping[0]){

                        a.swap(swapping[1],true);
                        swapping = null;
                    }else{
                        swapping = null;
                    }
                }
            }
            if(a.locking == false){
            }else {
                a.board.unlock();
                a.locking = false;
            }
        }));
        this.runAction(sequence);
    },
    moveDown:function(){
        this.row -= 1;
        var dest = this.board.getCoord(this.col,this.row);
        this.moveTo(dest);
    },
    //User input


    //Call function to check possible matches on board.
    are_there_moves:function()
    {
        //Check for all possible matches
        var counter_up = 1;
        var counter_left = 1;
        var counter_right = 1;
        var counter_down = 1;

        while(this.match(this.col-counter_left, this.row))
            counter_left++;


        while(this.match(this.col, this.row+counter_up))
            counter_up++;


        while(this.match(this.col+counter_right, this.row))
            counter_right++;


        while(this.match(this.col, this.row-counter_down))
            counter_down++;


        var up_down = counter_up + counter_down - 1;
        var left_right = counter_left + counter_right - 1;
        return (up_down > 2 || left_right > 2);
    },
    //Adds a faint aura to a block that the player has selected. Takes in a boolean
    // TRUE : This block has been selected. Add the glow png. FALSE: this block is being deselected. remove the glow png.
    selected:function(onoff){
        if(onoff == true){
            glow = new cc.Sprite.create(res.select_png);
            glow.setPosition(cc.p(33, 33));
            this.addChild(glow);
        } else if (onoff == false){
            glow.removeFromParent(true);
        }
    }
});
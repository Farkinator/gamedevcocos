/**
 * Created by Donovk 3 on 9/16/2015.
 */

var Block= cc.Sprite.extend({
    ctor:function(in_col, in_row, in_board){
        if(in_board == undefined){
            console.log("ERROR - BOARD IS UNDEFINED.");
        }
        //Initialization
        this._super(res.blocks[this.set_block()]);
        //console.log("row: " + in_row + " col: " + in_col);
        this.row = in_row;
        this.col = in_col;
        this.board = in_board;
        this.block_type = this.set_block();
        //console.log(this);
        this.action = null;
        this.locking = false;
        var position = this.board.getCoord(this.col,this.row);
        this.x = position.x;
        this.y = position.y;
        //this.setSprite(res.blocks[this.block_type]);

    },


    //Methods
    match:function(x,y)
    {
        var block2 = this.board.getBlock(x,y);
        return (this.block_type == block2.block_type);
    },

    set_block:function(){
        var int = Math.floor(Math.random() * 6);
        //var options = ["red", "blue", "green", "orange", "yellow", "purple"];
        return int; //options[int];
    },

    swap:function(block2){
        //Swaps the blocks
        var temp = this.block_type;
        this.block_type = block2.block_type;
        block2.block_type = temp;

        //Check for all possible matches
        var counter_up = 1;
        var counter_left = 1;
        var counter_right = 1;
        var counter_down = 1;

        while (this.match(this.col-counter_left,row)) //Check left
            counter_left++;
        while (this.match(this.col,this.row+counter_up)) //Check up
            counter_up++;
        while (this.match(this.col+counter_right,this.row)) //Check right
            counter_right++;
        while (this.match(this.col, this.row-counter_down)) //Check down
            counter_down++;
        var up_down = counter_up + counter_down - 1;
        var left_right = counter_left + counter_right - 1;

        if (up_down > 2 && left_right > 2)
        {
            //Most likely going to be handled somewhere else.
            //Scoring
            //SCORE += 100 * up_down;
            //SCORE += 100 * left_right;

            //Deleting
            var i;
            for (i=this.col-counter_left+1; i<this.col+counter_right-1; i++)
                this.board.delete(i,this.row);
            for (i=this.row-counter_down+1; i<this.row+counter_up-1; i++)
                this.board.delete(this.col,i);

            //Dropping Down
            for (i=this.col-counter_left+1; i<this.col-counter_right-1; i++)
                board.dropDown(i,this.row);
            for (i=this.row-counter_down+1; i<this.row+counter_up-1; i++)
                this.board.dropDown(this.col,i);
        }

        else if (up_down > 2 && left_right < 3)
        {
            //Scoring
            SCORE += 100 * up_down;

            //Deleting
            var i;
            for (i=this.row-counter_down+1; i<this.row+counter_up-1; i++);
                this.board.delete(this.col,i);

            //Dropping Down
            for (i=this.row-counter_down+1; i<this.row+counter_up-1; i++)
                this.board.dropDown(this.col,i);
        }

        else if (left_right > 2 && up_down < 3)
        {
            //Scoring
            SCORE += 100 * left_right;

            //Deleting and Drop Down
            var i;
            for (i=this.col-counter_left+1; i<this.col-counter_right-1; i++)
            {
                this.board.delete(i,this.row);
                this.board.dropDown(i,this.row);
            }
        }
    },
    moveTo:function(dest){
        this.stopAllActions();
        if(this.locking){
            //If actions were stopped, that means there is an extra lock on the board. Remove it.
            this.board.unlock();
        }
        //.log(dest);
        this.board.lock();
        this.locking = true
        var sequence =  new cc.Sequence(new cc.MoveTo(1,dest),new cc.callFunc(function(a){
            console.log(a);
            a.board.unlock();
            a.locking = false;
        }));
        //var move =new cc.MoveTo(1,dest) ;
        //move.setTag(11);
        this.runAction(sequence);
    },
    moveDown:function(){
        this.row -= 1;
        var dest = this.board.getCoord(this.col,this.row);
       //console.log(dest);
        //console.log("Row: " + this.row + " col: " + this.col);
        //this.moveTo({x:100,y:100});
        this.moveTo(dest)
        //var move = new cc.MoveTo(1,dest);
        //this.runAction(move);
        //console.log(this.setSprite);
        //cc.MoveTo(this.board.getCoord(this.row, this.col));
        //if(this.action)
    }
    //User input
});


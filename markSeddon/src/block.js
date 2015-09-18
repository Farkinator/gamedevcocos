/**
 * Created by Donovk 3 on 9/16/2015.
 */

var Block= cc.Sprite.extend({
    ctor:function(in_row, in_col, in_board){
        //Initialization
        this._super(res.block)
        this.row = in_row;
        this.col = in_col;
        this.board = in_board;
        this.block_type = this.set_block();
    },


    //Methods
    match:function(x,y)
    {
        var block2 = this.board.getBlock(x,y);
        return (this.block_type == block2.block_type);
    },

    set_block:function(){
        var int = Math.floor((Math.random() * 6) + 1);
        var options = ["red", "blue", "green", "orange", "yellow", "purple"];
        return options[int];
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
                this.board.delete(col,i);

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
    moveDown:function(){

        cc.MoveTo(this.board.getCoord(this.row, this.col));

    }
    //User input
});


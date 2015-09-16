/**
 * Created by Donovk 3 on 9/16/2015.
 */

function Block(col,row,board)
{
    //Initialization
    this.row = row;
    this.col = col;
    this.board = board;
    this.block_type = this.set_block();

    //Methods
    this.match = function(x,y)
    {
        block2 = board.getBlock(x,y);
        return (this.block_type == block2.block_type);
    };

    this.set_block = function()
    {
        var int = Math.floor((Math.random() * 6) + 1);
        var options = ["red", "blue", "green", "orange", "yellow", "purple"];
    };

    this.swap = function(block2)
    {
        //Swaps the blocks
        temp = this.block_type;
        this.block_type = block2.block_type;
        block2.block_type = temp;

        //Check for all possible matches
        var counter_up = 1;
        var counter_left = 1;
        var counter_right = 1;
        var counter_down = 1;

        while (this.match(col-counter_left,row)) //Check left
            counter_left++;
        while (this.match(col,row+counter_up)) //Check up
            counter_up++;
        while (this.match(col+counter_right,row)) //Check right
            counter_right++;
        while (this.match(col, row-counter_down)) //Check down
            counter_down++;
        var up_down = counter_up + counter_down - 1;
        var left_right = counter_left + counter_right - 1;

        if (up_down > 2 && left_right > 2)
        {
            //Scoring
            SCORE += 100 * up_down;
            SCORE += 100 * left_right;

            //Deleting
            var i;
            for (i=col-counter_left+1; i<col+counter_right-1; i++)
                board.delete(i,row);
            for (i=row-counter_down+1; i<row+counter_up-1; i++)
                board.delete(col,i);

            //Dropping Down
            for (i=col-counter_left+1; i<col_counter_right-1; i++)
                board.dropDown(i,row);
            for (i=row-counter_down+1; i<row+counter_up-1; i++)
                board.dropDown(col,i);
        }

        else if (up_down > 2 && left_right < 3)
        {
            //Scoring
            SCORE += 100 * up_down;

            //Deleting
            var i;
            for (i=row-counter_down+1; i<row+counter_up-1; i++);
                board.delete(col,i);

            //Dropping Down
            for (i=row-counter_down+1; i<row+counter_up-1; i++)
                board.dropDown(col,i);
        }

        else if (left_right > 2 && up_down < 3)
        {
            //Scoring
            SCORE += 100 * left_right;

            //Deleting and Drop Down
            var i;
            for (i=col-counter_left+1; i<col_counter_right-1; i++)
            {
                board.delete(i,row);
                board.dropDown(i,row);
            }
        }
    };

    //User input
}


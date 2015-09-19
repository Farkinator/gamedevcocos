/**
 * Created by Donovk 3 on 9/16/2015.
 */

var Block= cc.Sprite.extend({
    ctor:function(in_row, in_col, in_board){
        //Initialization
        this._super();
        this.row = in_row;
        this.col = in_col;
        this.board = in_board;
        this.block_type = this.set_block();

        //User input handler
        var listener1 = cc.EventListener.create(
            {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch, event)
                {
                    var target = event.getCurrentTarget();

                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0,0,s.width,s.height);

                    return cc.rectContainsPoint(rect,locationInNode);
                },

                onTouchMoved: function(touch,event)
                {
                    var target = event.getCurrentTarget();
                    var delta = touch.getDelta();
                    target.x += delta.x;
                    target.y += delta.y;
                },

                onTouchEnded: function (touch,event)
                {
                    var target = event.getCurrentTarget();
                }
            });
    },


    //Methods
    match:function(x,y)
    {
        var block2 = this.board.getBlock(x,y);
        return (this.block_type == block2.block_type);
    },

    set_block:function(){
        //var int = Math.floor((Math.random() * 6) + 1);
        //var options = ["red", "blue", "green", "orange", "yellow", "purple"];
        return Math.floor((Math.random() * 6) + 1);
    },

    swap:function(block2){
        //Swaps the blocks
        var temp = this.block_type;
        this.block_type = block2.block_type;
        block2.block_type = temp;

        this.check_matches(block2);

    },
    moveDown:function(){
        this.board.getCoord(this.row, this.col);

    },
    check_matches:function(block2)
    {
        //Check for all possible matches
        var counter_up = 1;
        var counter_left = 1;
        var counter_right = 1;
        var counter_down = 1;

        while (this.match(this.col-counter_left,this.row)) //Check left
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

            var multiplier = up_down + left_right - 1;
            SCORE += 100 * (multiplier - 2) * (multiplier - 2);
            //Deleting

            for (var i=this.col-counter_left+1; i<this.col+counter_right-1; i++)
                this.board.delete(i,this.row);
            for (var i=this.row-counter_down+1; i<this.row+counter_up-1; i++)
                this.board.delete(this.col,i);

            //Dropping Down
            for (i=this.col-counter_left+1; i<this.col-counter_right-1; i++)
                this.board.dropDown(i,this.row);
            for (i=this.row-counter_down+1; i<this.row+counter_up-1; i++)
                this.board.dropDown(this.col,i);
        }

        else if (up_down > 2 && left_right < 3)
        {
            //Scoring
            var multiplier = up_down - 1;
            SCORE += 100 * (multiplier - 2) * (multiplier - 2);

            //Deleting
            for (var i=this.row-counter_down+1; i<this.row+counter_up-1; i++);
                this.board.delete(this.col,i);


            //Dropping Down
            for (var i=this.row-counter_down+1; i<this.row+counter_up-1; i++)
                this.board.dropDown(this.col,i);
        }

        else if (left_right > 2 && up_down < 3)
        {
            //Scoring
            var multiplier = left_right - 1;
            SCORE += 100 * (multiplier - 2) * (multiplier - 2);

            //Deleting and Drop Down
            for (var i=this.col-counter_left+1; i<this.col_counter_right-1; i++)
            {
                this.board.delete(i,this.row);
                this.board.dropDown(i,this.row);
            }
        }
        else
        {
            temp = this.block_type;
            this.block_type = block2.block_type;
            block2.block_type = temp;
        }
    },
    moveDown:function(){
        cc.MoveTo(this.board.getCoord(this.row, this.col));
    }
});


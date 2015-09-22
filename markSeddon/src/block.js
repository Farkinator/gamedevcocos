/**
 * Created by Donovk 3 on 9/16/2015.
 */

var Block= cc.Sprite.extend({
    ctor:function(in_col, in_row, in_board){
        if(in_board == undefined){
            console.log("ERROR - BOARD IS UNDEFINED.");
        }
        //Initialization

        var type = this.set_block();
        this._super(res.blocks[type]);
        //console.log("row: " + in_row + " col: " + in_col);
        this.row = in_row;
        this.col = in_col;
        this.board = in_board;
        this.block_type = type;
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
        if(this.locked){
            console.log(this.locked);
            return false;
        }
        var target = event.getCurrentTarget();

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

    swap:function(block2){
        console.log("SWAPPED");
        this.board.swap(this.col,this.row,block2.col,block2.row);
        if (!(this.check_matches() || block2.check_matches()))
        {
            console.log("No match.")
            //this.board.swap(this.col,this.row,block2.col,block2.row);
        }
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
        console.log(this.col + "," + this.row);
        console.log("up: " + counter_up + " down " + counter_down + " left: " + counter_left + " right " + counter_right);
        if (up_down > 2 && left_right > 2)
        {


            var multiplier = up_down + left_right - 1;
            //update total score
            console.log("MULTIPLIER IS:" + multiplier);

            scoreLayer.updateScore(this.block_type, 3);
            //Deleting
            //Delete from left to right
            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                this.board.delete(i,this.row);
            }
            //Delete from top to bottom
            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++) {
                this.board.delete(this.col, i);
            }

            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                this.board.dropDown(i,this.row);
            }
            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++) {
                this.board.dropDown(this.col, i);
            }
            return true;
        }

        else if (up_down > 2/* && left_right < 3*/)
        {
            //Scoring
            var multiplier = up_down;
            console.log("MULTIPLIER IS:"+multiplier);
            //update total score
            scoreLayer.updateScore(this.block_type, 3);


            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++){
                this.board.delete(this.col,i);
            }
            //Dropping Down
            for (var i=this.row-counter_down+1; i<this.row+counter_up; i++) {
                this.board.dropDown(this.col, i);
            }
            return true
        }

        else if (left_right > 2/* && up_down < 3*/)
        {
            console.log("leftright match, blocktype: "+ this.block_type);
            console.log("at position: " + this.row + ", " +this.col);
            //Scoring
            var multiplier = left_right - 1;
            console.log("MULTIPLIER IS:" + multiplier);
            scoreLayer.updateScore(this.block_type, 3);

            console.log(counter_left);

            console.log(this.col-counter_left+1 + " to " + this.col+counter_right-1);
            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                console.log("deleting " + i);
                this.board.delete(i,this.row);
            }

            console.log(this.col-counter_left+1 + " to " + this.col+counter_right-1);
            for (var i=this.col-counter_left+1; i<this.col+counter_right; i++){
                console.log("dropping " + i);
                this.board.dropDown(i,this.row);
            }

            //for (var i=this.col-counter_left+1; i<this.col-counter_right-1; i++)
            //{
            //    this.board.delete(i,this.row);
            //    this.board.dropDown(i,this.row);
            //}
            return true
        }
        else
        {
            //console.log("no match");
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
    moveTo:function(dest){
        this.stopAllActions();
        if(this.locking){
            //If actions were stopped, that means there is an extra lock on the board. Remove it.
            this.board.unlock();
        }
        //.log(dest);
        this.board.lock();
        this.locking = true;
        var sequence =  new cc.Sequence(new cc.MoveTo(1,dest),new cc.callFunc(function(a){
            //console.log(a);
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
    },
    //User input


    //Call function to check possible matches on board.
    are_there_moves:function(block2)
    {
        //Check for all possible matches
        var counter_up = 1;
        var counter_left = 1;
        var counter_right = 1;
        var counter_down = 1;

        while (this.col-counter_left >= 0) //Check left
        {
            //console.log("while1");
            //console.log(this.col);
            //console.log(counter_left);
            if (this.match(this.col-counter_left, this.row))
                counter_left++;
            else
                break;
        }
        while (this.row+counter_up <= 7) //Check up
        {
            //console.log("while2");
            if (this.match(this.col, this.row+counter_up))
                counter_up++;
            else
                break;
        }
        while (this.col+counter_right <= 7) //Check right
        {
            //console.log("while3");
            if (this.match(this.col+counter_right, this.row))
                counter_right++;
            else
                break;
        }
        while (this.row-counter_down >= 0) //Check down
        {
            //console.log("while4");
            if (this.match(this.col, this.row-counter_down))
                counter_down++;
            else
                break;
        }
        var up_down = counter_up + counter_down - 1;
        var left_right = counter_left + counter_right - 1;
        return (up_down > 2 || left_right > 2);
    }
});
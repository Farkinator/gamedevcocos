/**
 * Created by Connor on 9/22/2015.
 */
SpecialBlock = Block.extend({
    ctor:function(col,row,board){
        this._super(col,row,board,res.special_png);
        this.plainmatch = this.check_matches;
        this.specialSquares = [{x:3,y:3},{x:4,y:3},{x:3,y:4},{x:4,y:4}];
        cc.spriteFrameCache.addSpriteFrame (new cc.SpriteFrame (res.special_png),"special");
        this.setSpriteFrame("special");
        this.block_type = 999;
        this.inMiddle = function(){
            for(var i = 0; i < this.specialSquares.length; i++){
                if(this.col == this.specialSquares[i].x && this.row == this.specialSquares[i].y){
                    return true;
                }
            }
            return false;
        },
        this.check_matches = function(){
            var match = true;
            for(var i = 0; i < this.specialSquares.length; i++){
                if(!this.match(this.specialSquares[i].x,this.specialSquares[i].y)){
                    match = false;
                }
            }
            if(match) {
                scoreLayer.gameOver(true);
            }else{
                this.plainmatch();
            }
        };
    }
});
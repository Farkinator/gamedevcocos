/**
 * Created by Farkinator on 9/16/2015.
 */

/*
  In reality, the board layer only contains the blocks that
  make up the board, because the board should be statically drawn on
  the background layer.
 */
var BoardLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function(){
        this.super();
        //Instantiate the board.
        var gameboard = new Board();
        
    }
});
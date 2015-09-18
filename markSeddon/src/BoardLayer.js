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

    init:function() {
        this._super();
        //Instantiate the board.
        var board = new Board();
        board.setPosition(cc.p(600, 600));
        this.addChild(board);
    }

});
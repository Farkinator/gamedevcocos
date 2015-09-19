/**
 * Created by Farkinator on 9/16/2015.
 */

// Displays the Scores for each story.
var ScoreLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function(){
        this._super();
        this.totalscore = new cc.LabelTTF("Total Score: " + SCORE[6], "Helvetica", 20);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(800, winsize.height - 20));
        this.addChild(this.totalscore);
    },

    updateScore:function(){
        this.totalscore.setString("Total Score: " + SCORE[6]);
    }
});
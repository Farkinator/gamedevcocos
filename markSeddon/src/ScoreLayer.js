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
        winsize = cc.director.getWinSize();
        //This is going to hold all the other score labels.
        this.indivscorelabels = [];
        this.totalscore = new cc.LabelTTF("Total Score: " + SCORE[6], "Helvetica", 30);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(850, winsize.height - 20));
        this.addChild(this.totalscore);
        for(var i = 0; i < 6; i++){
            this.indivscorelabels[i] = new cc.LabelTTF("Score " + (i+1) + ": "+SCORE[i], "Helvetica", 20);
            this.indivscorelabels[i].setColor(cc.color(0,0,0));
            this.indivscorelabels[i].setPosition(cc.p(800, winsize.height - 80 - 80*i));
            this.addChild(this.indivscorelabels[i]);
        }
    },

    updateScore:function(block_type){
        this.totalscore.setString("Total Score: " + SCORE[6]);
        this.individualscorelabels[block_type].setString("Score " + (block_type+1) + ": " + SCORE[block_type]);
    }
});
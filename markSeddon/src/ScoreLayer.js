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
        this.totalscore = new cc.LabelTTF("Total Score: " + SCORE[6], "Times New Roman", 30);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(850, winsize.height - 20));
        this.addChild(this.totalscore);
        for(var i = 0; i < 6; i++){
            // Create the labels for every score.
            this.indivscorelabels[i] = new cc.LabelTTF("Score " + (i+1) + ": "+SCORE[i], "Times New Roman", 20);
            this.indivscorelabels[i].setColor(cc.color(0,0,0));
            this.indivscorelabels[i].setPosition(cc.p(840, winsize.height - 80 - 80*i));
            this.addChild(this.indivscorelabels[i]);
        }


    },
    // Will update the score object, taking in the multiplier (Controlled by the amount of blocks matched at once)
    updateScore:function(block_type, multiplier){
        //SCORE[6] contains the total score.
        SCORE[6] += 100 * (multiplier - 2) * (multiplier - 2);
        SCORE[block_type] += 100 * (multiplier - 2) * (multiplier - 2);

        this.totalscore.setString("Total Score: " + SCORE[6]);
        this.individualscorelabels[block_type].setString("Score " + (block_type+1) + ": " + SCORE[block_type]);
    },
    // GAME OVER function. Find the highest individual score, display the article at the end.
    gameOver:function(){
        var running_max = 0;
        //We've got to save which kind of subscore won to use
        var winning_index = 0;

        for(var i=0; i < 6; i++){
            if(SCORE[i] > running_max){
                running_max = SCORE[i];
                winning_index = i;
            }
        }

        cc.director.runScene(winning_index, SCORE);

    }
});
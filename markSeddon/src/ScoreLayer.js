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
        this.SCORE = [0,0,0,0,0,0,0];
        winsize = cc.director.getWinSize();
        //Array of the blocks that are being scored
        this.blocks = [];
        //This is going to hold all the other score labels.
        this.indivscorelabels = [];
        for(var i = 0; i < 5; i++){
            // Display the block that each score represents.
            this.blocks[i] = new cc.Sprite.create(res.blocks[i]);
            this.blocks[i].setPosition(cc.p(800, winsize.height - 80 - 80 * i));
            this.addChild(this.blocks[i]);
            // Create the labels for every score.
            this.indivscorelabels[i] = new cc.LabelTTF(" " + this.SCORE[i], "Times New Roman", 30);
            this.indivscorelabels[i].setColor(cc.color(0,0,0));
            this.indivscorelabels[i].setPosition(cc.p(900, winsize.height - 80 - 80*i));
            this.addChild(this.indivscorelabels[i]);
        }

        // Goes right above the score, because if it's inline with the score things get out of the border.
        this.totalheader = new cc.LabelTTF("TOTAL", "Times New Roman", 35);
        this.totalheader.setColor(cc.color(0,0,0));
        this.totalheader.setPosition(cc.p(850, winsize.height-570));
        this.addChild(this.totalheader);
        // Now this is the total score. This goes underneath all the other scores because it reads more like addition.
        this.totalscore = new cc.LabelTTF("" + this.SCORE[6], "Times New Roman", 35);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(850, winsize.height - 600));
        this.addChild(this.totalscore);

    },
    // Will update the score object, taking in the multiplier (Controlled by the amount of blocks matched at once)
    updateScore:function(block_type, multiplier){
        //SCORE[6] contains the total score.
        this.SCORE[6] += 100 * (multiplier - 2) * (multiplier - 2);
        this.SCORE[block_type] += 100 * (multiplier - 2) * (multiplier - 2);

        this.totalscore.setString("" + this.SCORE[6]);
        this.indivscorelabels[block_type].setString(" "+this.SCORE[block_type]);
    },
    // GAME OVER function. Switches to the game over scene.
    gameOver:function(){


        cc.director.runScene(new GameOverScene(SCORE));

    }
});
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
        //Array of the blocks that are being scored
        this.blocks = [];
        //This is going to hold all the other score labels.
        this.indivscorelabels = [];
        this.totalscore = new cc.LabelTTF("Total Score: " + SCORE[6], "Times New Roman", 35);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(850, winsize.height - 80));
        this.addChild(this.totalscore);
        for(var i = 0; i < 6; i++){
            // Display the block that each score represents.
            this.blocks[i] = new cc.Sprite.create(res.blocks[i]);
            this.blocks[i].setPosition(cc.p(800, winsize.height - 200 - 80 * i));
            this.addChild(this.blocks[i]);
            // Create the labels for every score.
            this.indivscorelabels[i] = new cc.LabelTTF(" " + SCORE[i], "Times New Roman", 30);
            this.indivscorelabels[i].setColor(cc.color(0,0,0));
            this.indivscorelabels[i].setPosition(cc.p(900, winsize.height - 200 - 80*i));
            this.addChild(this.indivscorelabels[i]);
        }


    },
    // Will update the score object, taking in the multiplier (Controlled by the amount of blocks matched at once)
    updateScore:function(block_type, multiplier){
        //SCORE[6] contains the total score.
        SCORE[6] += 100 * (multiplier - 2) * (multiplier - 2);
        SCORE[block_type] += 100 * (multiplier - 2) * (multiplier - 2);

        this.totalscore.setString("Total Score: " + SCORE[6]);
        this.individualscorelabels[block_type].setString(" " + SCORE[block_type]);
    },
    // GAME OVER function. Switches to the game over scene.
    gameOver:function(){


        cc.director.runScene(new GameOverScene(SCORE));

    }
});
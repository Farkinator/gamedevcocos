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
        /*
            MARGINS AND SPACING
         */
        //Margin between the scores and the window top
        this.top_margin = 120;
        //Spacing between each score.
        this.spacing = 80;
        //How far down the Total should be from the top of the screen
        this.total_height = 570;
        //X value of the total height
        this.total_x = 850;
        //Spacing between the string "TOTAL" and the score
        this.total_spacing = 30;
        //X value of the scores.
        this.scores_x = 800;
        //Spacing between the sprite of the block and the score label
        this.sprite_score_spacing = 100;

        /*
            ARRAY DECLARATION
         */
        this.SCORE = [0,0,0,0,0,0,0];
        //Array of the sprites of the blocks that are being scored
        this.block_sprites = [];
        /*
            DRAW LABELS & SPRITES.
         */
        //This is going to hold all the other score labels. Loops over all 5 blocks that we are scoring for.
        this.indivscorelabels = [];
        for(var i = 0; i < 5; i++){
            // Display the block that each score represents.
            this.block_sprites[i] = new cc.Sprite.create(res.blocks[i]);
            this.block_sprites[i].setPosition(cc.p(this.scores_x, winsize.height - this.top_margin - this.spacing * i));
            this.addChild(this.block_sprites[i]);
            // Create the labels for every score.
            this.indivscorelabels[i] = new cc.LabelTTF(" " + this.SCORE[i], "Times New Roman", 30);
            this.indivscorelabels[i].setColor(cc.color(0,0,0));
            this.indivscorelabels[i].setPosition(cc.p(this.scores_x + this.sprite_score_spacing, winsize.height - this.top_margin - this.spacing*i));
            this.addChild(this.indivscorelabels[i]);
        }

        // Goes right above the score, because if it's inline with the score things get out of the border.
        this.totalheader = new cc.LabelTTF("TOTAL", "Times New Roman", 35);
        this.totalheader.setColor(cc.color(0,0,0));
        this.totalheader.setPosition(cc.p(this.total_x, winsize.height-this.total_height));
        this.addChild(this.totalheader);
        // Now this is the total score. This goes underneath all the other scores because it reads more like addition.
        this.totalscore = new cc.LabelTTF("" + this.SCORE[6], "Times New Roman", 35);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(this.total_x, winsize.height - (this.total_spacing + this.total_height)));
        this.addChild(this.totalscore);

    },
    // Will update the score object, taking in the multiplier (Controlled by the amount of blocks matched at once)
    updateScore:function(block_type, multiplier){
        //SCORE[6] contains the total score. Multiplier is updated depending on how many were matched at once.
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
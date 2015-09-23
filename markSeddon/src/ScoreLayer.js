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
        this.time_elapsed = 0;
        //This is just making it easy to change for our sanity.
        var time_limit_minutes = 5.0;
        var time_limit_seconds = 0.0;
        this.time_limit = time_limit_minutes * 60.0 + time_limit_seconds;

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
        // Timer Height
        this.timer_h = 660;
        // Timer x
        this.timer_x = 860;

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
        //Timer label. If seconds is in the double digits
        if(time_limit_seconds >=10) {
            this.timerlabel = new cc.LabelTTF(time_limit_minutes + ":" + time_limit_seconds + " Remaining", "Times New Roman", 30);
        } else {
            this.timerlabel = new cc.LabelTTF(time_limit_minutes + ":0" + time_limit_seconds + " Remaining", "Times New Roman", 30);
        }
        this.timerlabel.setColor(cc.color(0,0,0));
        this.timerlabel.setPosition(cc.p(this.timer_x, winsize.height-this.timer_h));
        this.addChild(this.timerlabel);

    },
    // Will update the score object, taking in the multiplier (Controlled by the amount of blocks matched at once)
    updateScore:function(block_type, multiplier){
        //SCORE[6] contains the total score. Multiplier is updated depending on how many were matched at once.
        this.SCORE[6] += 100 * (multiplier - 1) * (multiplier - 1);
        this.SCORE[block_type] += 100 * (multiplier - 1) * (multiplier - 1);

        this.totalscore.setString("" + this.SCORE[6]);
        this.indivscorelabels[block_type].setString(" "+this.SCORE[block_type]);

    },
    updateTimer:function(dt){
        //I'm so lazy I didn't bother finding a cocos function to actually do timing.
        this.time_elapsed+=dt;
        var time_remaining = this.time_limit - this.time_elapsed;
        if(time_remaining <=0){
            this.gameOver();
        } else { /* change the string of the timer.*/
            var minute_count = time_remaining / 60;
            var second_count = time_remaining % 60;
            if(second_count >= 10){
                this.timerlabel.setString(Math.floor(minute_count)+":"+Math.floor(second_count)+" Remaining");
            } else {
                this.timerlabel.setString(Math.floor(minute_count)+":0"+Math.floor(second_count)+" Remaining");
            }
        }
    },
    // GAME OVER function. Switches to the game over scene.
    gameOver:function(){


        cc.director.runScene(new GameOverScene(this.SCORE));

    }
});
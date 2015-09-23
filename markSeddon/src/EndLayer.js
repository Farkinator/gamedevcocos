/**
 * Created by Farkinator on 9/21/2015.
 */
var EndLayer = cc.Layer.extend({

    ctor:function(scoreObj){
        this._super();
        this.init(scoreObj);
    },
    init:function(scoreObj){
        winsize = cc.director.getWinSize();

        var running_max = 0;
        //We've got to save which kind of subscore won to use
        var w_index = 0;

        for(var i=0; i < 6; i++){
            if(scoreObj[i] > running_max){
                running_max = scoreObj[i];
                w_index = i;
            }
        }

        //create the background image for endgame and place at center
        var centerPos = cc.p(winsize.width / 2, winsize.height / 2);
        var spriteBG = new cc.Sprite(res.gameover_png);
        spriteBG.setPosition(centerPos);
        this.addChild(spriteBG);

        //Get to displaying the Total Score, front and center.
        this.totalscore = new cc.LabelTTF("You finished with " + scoreObj[6] + " points!", "Helvetica", 50);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(512, winsize.height - 80));
        this.addChild(this.totalscore);


        // Fetch the story data from the JSON file containing them.
        cc.loader.loadJson("res/stories.json", function(error, data){
            // Use w_index to find the category of story to display, and display a random story in that category
            rand = Math.floor(Math.random() * 5);

            //Data is an array of arrays. The first index is the category, the second is a specific story.
            this.story = data[w_index][rand];

            // make a text box of size width x size, with centered text.
            this.storylabel = new cc.LabelTTF(this.story, "Times New Roman", 35);
            this.storylabel.setDimensions(new cc.Size(600, 600));
            this.storylabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.storylabel.setColor(cc.color(0,0,0));
            this.storylabel.setPosition(cc.p(512, winsize.height - 500));
            endLayer.addChild(this.storylabel);
        });
        // Array that will hold sprites representing the score for each block.
        this.blocks = [];
        //Score breakdown of all the different subjects
        for(var i = 0; i < 5; i++){
            // Display the block that each score represents.
            this.blocks[i] = new cc.Sprite.create(res.blocks[i]);
            this.blocks[i].setPosition(cc.p(90 + i * 170, winsize.height - 650));
            this.addChild(this.blocks[i]);
            // Create the labels for every score.
            this.indivscorelabels = new cc.LabelTTF(""+scoreObj[i], "Times New Roman", 30);
            this.indivscorelabels.setColor(cc.color(0,0,0));
            this.indivscorelabels.setPosition(cc.p(90 + i * 170, winsize.height - 700));
            this.addChild(this.indivscorelabels);
        }

    }
});
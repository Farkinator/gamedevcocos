/**
 * Created by Farkinator on 9/21/2015.
 */
var EndLayer = cc.Layer.extend({

    ctor:function(w_index, scoreObj){
        this._super();
        this.init(w_index, scoreObj);
    },
    init:function(w_index, scoreObj){
        winsize = cc.director.getWinSize();

        //Get to displaying the Total Score, front and center.
        this.totalscore = new cc.LabelTTF("You finished with " + SCORE[6] + " points!", "Helvetica", 50);
        this.totalscore.setColor(cc.color(0,0,0));//black color
        this.totalscore.setPosition(cc.p(512, winsize.height - 20));
        this.addChild(this.totalscore);
        // Fetch the story data from the JSON file containing them.
        cc.loader.loadJson("res/stories.json", function(error, data){
            // Use w_index to find the category of story to display, and display a random story in that category
            rand = Math.floor(Math.random() * 5);
            this.story = data[0][rand];
            this.storylabel = new cc.LabelTTF(this.story, "Times New Roman", 50);
            this.storylabel.setColor(cc.color(0,0,0));
            this.storylabel.setPosition(cc.p(512, winsize.height - 80));
            endLayer.addChild(this.storylabel);
        });



    }
});
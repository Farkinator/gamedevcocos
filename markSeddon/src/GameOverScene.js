/**
 * Created by Farkinator on 9/21/2015.
 */
var GameOverScene = cc.Scene.extend({
    // Takes in the winning story's index along with the object containing all the scores.
    //
    ctor:function(scoreObj,win){
        this._super();
        console.log("win message: " + win);
        this.init(scoreObj,win);
    },

    init:function(scoreObj,win){
        console.log("win message: " + win);
        // Doesn't it feel like we're in one big relay race with these two objects?
        var endLayer = new EndLayer(scoreObj,win);

        this.addChild(endLayer);
    }
});
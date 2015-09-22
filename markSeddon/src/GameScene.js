/**
 * Created by Farkinator on 9/16/2015.
 */
var GameScene = cc.Scene.extend({
   onEnter:function(){
       this._super();
       // Global variable for the scoring.
       //Three things of interest in this scene.
       scoreLayer = new ScoreLayer();
       this.addChild(new BackgroundLayer());
       this.addChild(new BoardLayer());
       this.addChild(scoreLayer);


   }

});
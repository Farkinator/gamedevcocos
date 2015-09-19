/**
 * Created by Farkinator on 9/16/2015.
 */
var GameScene = cc.Scene.extend({
   onEnter:function(){
       this._super();
       //Three things of interest in this scene.
       SCORE = [0, 0, 0, 0, 0, 0, 0];
       scoreLayer = new ScoreLayer();
       this.addChild(new BackgroundLayer());
       this.addChild(new BoardLayer());
       this.addChild(scoreLayer);


   }

});
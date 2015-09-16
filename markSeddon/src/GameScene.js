/**
 * Created by Farkinator on 9/16/2015.
 */
var GameScene = cc.Scene.extend({
   onEnter:function(){
       this._super();
       //Three things of interest in this scene.
       this.addChild(new BackgroundLayer());
       this.addChild(new BoardLayer());
       this.addChild(new ScoreLayer());
   }
});
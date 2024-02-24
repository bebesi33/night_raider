class Camera{
    constructor(width, height){
        this.mod=0;
        this.TR=500;
        this.WIDTH=width;
        this.max_X=width; 
        this.min_X=0;
        this.max_Y=height;
        this.level_Length=1000;
        this.x_Hero;
        this.lastHero;
    }

    setLevelLength(Level_length){
        this.level_Length=Level_length;
    }

    move(x_Hero){
        this.x_Hero=x_Hero;
        if( x_Hero==0 ){this.x_Hero=this.latHero;}
        this.max_X=Math.min(  this.level_Length , Math.max(this.x_Hero+this.TR,this.WIDTH) );
        this.mod=Math.max(0, Math.min(  this.level_Length-this.WIDTH , this.x_Hero-(this.WIDTH-this.TR)));
        this.latHero=this.x_Hero;
    }

    getMod(){
        return this.mod;
    }

}

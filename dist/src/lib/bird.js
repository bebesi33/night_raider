class Bird extends fw.Entity {
    constructor(x, y,speed ) {
        super(x, y);
        this.dx=speed;
        this.dir=0;
        if(speed>0){this.dir=1;}
        this.frame=0;
        this.image=Bird.image[this.dir];
        this.soundOn=1;
        this.distance=150 + Math.random()*200 % 200;
    }

    getLeft() {
        return this.x+14;
    }

    getWidth() {
        return 59;
    }

    getHeight() {
        return 60;
    }
    getTop() {
        return this.y;
    }

    update(){
        this.move();
        if(this.soundOn>0 && Math.abs(this.x-game_Camera.x_Hero)<this.distance){
            Bird.sound[0].play();
            this.soundOn=0;
        }

    }

    move(){
        this.frame=(this.frame+1 ) % 27;
        const entitiesInWay = index.query(this.getLeft()+this.dx, this.getTop(), this.getWidth(), this.getHeight(),0);
        for (const entity of entitiesInWay) {
            // ha eltalálják
            if (entity instanceof Projectile){
                if (entity instanceof Sword) {Bird.sound[1].play();}
                if(Math.random()>0.5){
                    scene.add(new Cartridge(this.x,this.y));
                }else{
                    scene.add(new Heart(this.x,this.y));
                }
                scene.remove(this);
            }
        }
        this.x+=this.dx;
        if(this.x<-500){this.x=(game_Camera.level_Length+100);this.soundOn=1;}
        if(this.x>(game_Camera.level_Length+100)){this.x=-100;this.soundOn=1;}
    }

    draw(ctx) {
        if (!this.image) {
            return;
        }
        let mod=0;let sizeMod=0;
        mod= game_Camera.getMod();
        if( (this.y<=game_Camera.max_Y && this.x<(game_Camera.max_X))){
            sizeMod=Math.max(0, (this.x+this.getWidth()-1)-game_Camera.max_X);
            ctx.drawImage(this.image, (Math.floor(this.frame/3) % 9) *this.getWidth()+ 1, 1, this.getWidth()-sizeMod, this.getHeight() , this.x-mod, this.y, this.getWidth()-1-sizeMod, this.getHeight());
        }
    }

}
Bird.events = ['update', 'draw' , 'remove']; 
Bird.image=[ new load.image('img/bird/birdR.png'),
            new load.image('img/bird/birdL.png')];
Bird.sound=[new Audio('sounds/raven.wav'),
            new Audio('sounds/knife_stab.wav')
];

class Enemy extends fw.Entity {
    constructor(x, y, minX, maxX, type ) {
        super(x, y);
       
        //Típus...
        this.type=type;/*1,2,3,4 a típusok...*/
        this.width=40;
        this.height=95;
        if(type==1){this.height-=8;}

        // irányt és mozgást leíró változók
        this.dir = 1; /* 0 akkor balra néz, 1 akkor jobb */
        this.inAir=1;
        this.dx=0;
        this.dy=0;
        this.minX=minX;
        this.maxX=maxX;
        this.last_dir=1;

        // lövés , hp és interakció az ellenségekkel:
        this.hit_points=100;
    
        // megjelenítés
        this.image_Left=Enemy.image_Left;
        this.image_Right=Enemy.image_Right;
        this.frame=0;

        //haláls esetén
        this.dead=0;
        this.remove_Frame=75;
    }
    
    draw(ctx) {
        if(this.dead!=1){this.frame=(this.frame+1)% 200;}
        let mod=0;let sizeMod=0;
        let pos= Math.floor( (this.frame % 40)/ 10);
        sizeMod=Math.max(0, (this.x+96)-game_Camera.max_X);
        mod= game_Camera.getMod();

        if( (this.y<=game_Camera.max_Y && this.x<(game_Camera.max_X))){

            if(this.dir==1){
                ctx.drawImage(this.image_Left, (pos)*96, (this.type-1)*96, 96-sizeMod, 96-(75-this.remove_Frame), this.x-mod, this.y+(75-this.remove_Frame), 96-sizeMod, 96-(75-this.remove_Frame))
            }else{
                ctx.drawImage(this.image_Right, (pos)*96, (this.type-1)*96, 96-sizeMod, 96-(75-this.remove_Frame), this.x-mod, this.y+(75-this.remove_Frame), 96-sizeMod, 96-(75-this.remove_Frame));
            }

           // ha már sérült a szörny akkor megjelenik az életereje
           if(this.hit_points<100 & this.dead!=1 ){
                let sizeMod_bar1=Math.max(0, sizeMod-26-(50-Math.floor(this.hit_points/2)));
                ctx.fillStyle="#FF0000";
                ctx.fillRect(this.x-mod+20, this.y-20,50-Math.max(0, sizeMod-26),10);
                ctx.fillStyle="#3aed04";
                ctx.fillRect(this.x-mod+20, this.y-20,Math.floor(this.hit_points/2)-sizeMod_bar1,10);
           }
        }
    }
    getLeft() {
        return this.x+14;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
    getTop() {
        return this.y;
    }
    getMid(){
        return (this.x+this.dir*this.getWidth()/2)
    }

    remove(){

        this.dead=1;
            if(this.remove_Frame==75 ){
                let mod=0;
                if(this.type==1){mod=8;}
                scene.add(new Grave(this.x,this.y-mod));
            };
            this.remove_Frame-=3;
        if(this.remove_Frame<1 && this.inAir==0){scene.remove( this );}
        
    }

    move() {
        const entitiesInWay = index.query(this.getLeft()+this.dx, this.getTop()+this.dy, this.getWidth(), this.getHeight(),0);
        let min_dY=this.dy;
        let Collision=0;
        for (const entity of entitiesInWay) {
            // ki kell keresni a max megendedhető esést...
            if (entity instanceof Tile && entity.soft==0) {
                this.inAir=0; Collision=1;
                if( (entity.getTop()-this.y-this.height) < min_dY && this.dy>-1 ){
                    min_dY=(entity.getTop()-this.y-this.height);
                }
            }
            // ha eltalálják
            if (entity instanceof Projectile){
                this.hit_points-=entity.calcDamage(this.y, this.hit_points);
                this.x+=entity.dx/2;
                entity.hit();
            }
        }

        if( this.dy<1 && Collision==1){min_dY=0;this.inAir=1;} // ha  fölfele van akadály nem kell tartani a változó értékét
        if( Collision==0){this.inAir=1;}//ha nem ütközik semmivel akkor szabadesés

        this.y += min_dY;
        this.y=Math.max(-0,this.y);
        this.x += this.dx;
        this.x=Math.min( this.maxX ,Math.max(this.minX,this.x));
    }

    update() {
        if(Math.abs(game_Camera.x_Hero+30-this.getMid())<700){
            // Először a külső tényezők.
            if(this.inAir==1){this.dy++;this.dy=Math.min(10,this.dy);}
            let lastX=this.x;
            let last_hit_points=this.hit_points;

                if( (game_Camera.x_Hero+30-this.getMid())>=0  ){
                    this.dir=0;this.dx=1;
                }else{
                    this.dir=1;this.dx=-1;
                }
                if(Math.abs(game_Camera.x_Hero+30-this.getMid())<25){this.dir=this.last_dir;this.dx=0;}
            if(this.dead!=1){this.move();}
            if( this.x==lastX || last_hit_points!=this.hit_points ){this.dx=0;}
            this.last_dir=this.dir;
        }//end if nincs messze...

        if(this.hit_points<1){this.remove();}//ha meghal 
    }//end if update
}
Enemy.events = ['update', 'draw' , 'remove']; 
Enemy.image_Left = load.image('img/enemies/zombies_left.png');
Enemy.image_Right = load.image('img/enemies/zombies_right.png');
   
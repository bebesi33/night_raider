class Projectile extends fw.Entity {
    constructor(x, y, dir) {
        // bemenet: a hero x , y és dir értéke
        super(x, y);
        this.dx =0;
        this.height_Aling=0;
        this.width_Aling=0;// to be applied only when dir==1
        this.max_Dist=0;
        this.damage=0;
        this.dir=dir;
        this.x+=this.width_Aling*this.dir;
        this.y+=this.height_Aling;
    }

    remove(){
        scene.remove( this );
    }

    add(){
        scene.add(this);
    }

    hit(){
        this.remove();
    }

    getWidth() {
        return 1;
    }

    getHeight() {
        return 10;
    }

    calcDamage(y, hit_point ){
        return (  (Math.abs( y -(this.y+this.getHeight()/2))<25)*2*this.damage +this.damage  );
    }

    move(){
        const entitiesInWay_X = index.query(this.getLeft()+this.dx, this.getTop(), this.getWidth(), this.getHeight(),1);
        for (const entity of entitiesInWay_X) {
            if (entity instanceof Tile && entity.soft==0) {
               this.remove();
            }
        }
        this.x+=this.dx;
    }

    update() {
        this.move();
        if( Math.abs(game_Camera.x_Hero-this.x)>this.max_Dist){this.remove();}
    }

}
Projectile.events = ['update', 'add', 'remove'];

class Bullet extends Projectile{
    constructor(x, y, dir) {
        // bemenet: a hero x , y és dir értéke
        super(x, y, dir);
        this.dx =0;if(dir==1){this.dx=20;}else{this.dx=-20;}
        this.height_Aling=50;
        this.width_Aling=77;
        this.max_Dist=1500;
        this.damage=20;
        this.dir=dir;
        this.x=x+this.width_Aling*this.dir;
        this.y=y+this.height_Aling;
        this.sounds=Bullet.shot;
        this.sounds.play();
    }
}//end Bullet
Bullet.shot = new Audio('sounds/m3-1_short.wav');

class Sword extends Projectile{
    constructor(x, y, dir) {
        // bemenet: a hero x , y és dir értéke
        super(x, y, dir);
        this.dx =0;if(dir==1){this.dx=20;}else{this.dx=-20;}
        this.height_Aling=10;
        this.width_Aling=-10;
        this.max_Dist=100;
        this.damage=50;
        this.dir=dir;
        this.x=x+this.width_Aling*this.dir+(1-this.dir)*80;
        this.y=y+this.height_Aling;
        this.sounds=[Sword.hit, Sword.stab];
        this.sounds[0].play();
    }
    getHeight() {
        return 40;
    }

    calcDamage(y, hit_point){
        if(this.damage>=hit_point){this.sounds[1].play();}
        return (  this.damage  );
    }

    hit(){
    }
}//end Sword
Sword.stab=new Audio('sounds/knife_stab.wav');
Sword.hit = new Audio('sounds/knife_slash2.wav');


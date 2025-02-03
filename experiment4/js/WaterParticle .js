class WaterParticle{
    constructor(x,y){
        this.x=x
        this.y=y
        this.size=random(5,8)
        this.speed=random(2,5)
    }

    update(){
        //Make the water fall downard
        this.y+=this.speed;
    }

    display(){
        fill(0,100,255,150);//light blue water color
        noStroke();
        ellipse(this.x,this.y,this.size);
    }

    touchesPlant(plant){
        //Check if the particle is near the plant
        let stemX=plant.x
        let stemY=plant.y-plant.stemHeight;
        
        return dist(this.x, this.y, stemX, stemY) < 15//water ahs to be within 15 pixels to affect plant growth
    }
}
const R_SMOOTH = 1000.0;

class Particle {
  constructor(pos, id) {
    this.pos = pos;
    this.speed = new Vector(0, 0);
    this.id = id; 
    this.color = this.getRandomColor();
    this.radius = this.getRandomInt(4, 6);

    this.gridX = -1;
    this.gridY = -1;
    
    this.energy = this.initEnergy;
  }

  getRandomInt(min, max) {
    let delta = max - min;
    return Math.floor(Math.random() * delta) + min;
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  addForce(force) {
    this.speed.add(force);
  }

  goTo(pos, permanent=true) {
    this.follow = pos;
    this.permanent = permanent;
  }

  behave(board) {
    let grid = board.grid;
    //let gridPos = board.getPos(this.pos.x, this.pos.y);
    //let x = gridPos[0], y = gridPos[1];

    
    
  }

  move(delta) {
    let distance = this.speed.length() * delta;
    this.energy -= distance * this.moveCost;
    this.pos.add(this.speed.clone().multiply(delta));
  }

}



Particle.prototype.vision = 5;
Particle.prototype.initEnergy = 200;
Particle.prototype.metabolism = 1;
Particle.prototype.moveCost = 0.5;

Particle.prototype.maxRadius = 15;
Particle.prototype.minRadius = 10;
Particle.prototype.particlesOffset = 15;
Particle.prototype.repelent_maxForce = 10;
Particle.prototype.repelent_ = 1;
Particle.prototype.repelent_b = (Math.log10(Particle.prototype.repelent_maxForce) / Math.log10(Particle.prototype.repelent_));
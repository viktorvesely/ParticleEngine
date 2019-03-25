const R_SMOOTH = 1000.0;

class Stick {
  constructor(pos, id, behaviours) {
    this.pos = pos;
    this.speed = new Vector(0, 0);
    this.id = id;  
    this.type  = behaviours.types[Math.floor(Math.random() * behaviours.types.length)];
    this.follow = null;
    this.permanent = false;
    
  }
  
  addForce(force) {
    this.speed.add(force);
  }

  goTo(pos, permanent=true) {
    this.follow = pos;
    this.permanent = permanent;
  }

  behave(particles, currentMode, MODE) {
    particles.forEach(particle => {
      let behaviours = this.type.behaviour;
      if (this.id === particle.id) return;

      let delta = particle.pos.clone().subtract(this.pos);
      let deltaLength = delta.length();
      let minR = this.type.radius + particle.type.radius + this.particlesOffset;
      if (deltaLength <= minR) {
        let repelentForce = delta.clone().divide(deltaLength).multiply(R_SMOOTH * minR * (1.0 / (minR + R_SMOOTH) - 1.0 / (deltaLength + R_SMOOTH)));
    
        this.speed.add(repelentForce);
      }
    });
    if (currentMode === MODE.FOLLOW) {
      if (this.follow === null) return; 
      let distance = this.follow.clone().subtract(this.pos)
      let length = distance.length();
      if (length > 6) {
        let speed = distance.divide(length).multiply(1);
        this.speed.add(speed);
      } else {
        if (!this.permanent) {
          this.follow = null;
        }
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.type.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.type.color;
    ctx.fill();
  }

}

Particle.prototype.maxRadius = 15;
Particle.prototype.minRadius = 10;
Particle.prototype.particlesOffset = 15;
Particle.prototype.repelent_maxForce = 10;
Particle.prototype.repelent_ = 2;
Particle.prototype.repelent_b = (Math.log10(Particle.prototype.repelent_maxForce) / Math.log10(Particle.prototype.repelent_));
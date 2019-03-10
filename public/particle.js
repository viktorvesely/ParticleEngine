const R_SMOOTH = 1000.0;

class Particle {
  constructor(pos, id) {
    this.pos = pos;
    this.speed = new Vector(0, 0);
    this.id = id;  
    this.type  = ParticleTypes[Math.floor(Math.random() * ParticleTypes.length)];

  }


  behave(particles) {
    particles.forEach(particle => {
      let behaviours = this.type.behaviour;
      if (this.id === particle.id) return;

      let delta = particle.pos.clone().subtract(this.pos);
      let deltaLength = delta.length();
      let minR = this.type.radius + particle.type.radius + this.particlesOffset;
      if (deltaLength <= minR) {
        let repelentForce = delta.clone().divide(deltaLength).multiply(R_SMOOTH * minR * (1.0 / (minR + R_SMOOTH) - 1.0 / (deltaLength + R_SMOOTH)));
        // let repelentMagnitude = Math.pow(this.repelent_, -deltaLength + this.repelent_b);
        // let repelentForce = delta.clone().divide(deltaLength).multiply(repelentMagnitude);
        // particle.speed.add(repelentForce);
        this.speed.add(repelentForce);
      } else {
        let behaviour = behaviours.find(behaviour => {
          return behaviour.name === "all" || behaviour.name === particle.type.name;
        });
        if (!behaviour) return;
        let forceLength = deltaLength;
        if (forceLength > this.type.forceRadius) return;

        const numer = 2.0 * Math.abs(deltaLength - 0.5 * (this.type.forceRadius + minR));
        const denom = this.type.forceRadius - minR;
        let force = delta.clone().divide(deltaLength).multiply(this.type.maxForce * (1.0 - numer / denom)).multiply(behaviour.forceModificator);
        particle.speed.add(force);
      }
    });
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
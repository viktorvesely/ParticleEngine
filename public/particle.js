const ParticleTypes = [
  {
    name: "blue",
    color: "#87fffd",
    radius: 5,
    frictionModificator: 1, 
    forceRadius: 200,
    maxForce: 0.4,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1
      },
      {
        name: "blue",
        forceModificator: -1.03
      },
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "purple",
        forceModificator: 1
      }
    ]
  },
  {
    name: "yellow",
    color: "#fbff1e",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 100,
    maxForce: 0.7,
    behaviour: [
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "blue",
        forceModificator: 1 
      },
      {
        name: "white",
        forceModificator: -1
      }
    ]
  },
  {
    name: "repelent",
    color: "#00ff55",
    radius: 4,
    frictionModificator: 0.5,
    forceRadius: 800,
    maxForce: 0.2,
    behaviour: [
      {
        name: "all",
        forceModificator: -1
      }
    ]
  },
  {
    name: "white",
    color: "white",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 180,
    maxForce: 0.9,
    behaviour: [
      {
        name: "yellow",
        forceModificator: -1.1
      }
    ]
  },
  {
    name: "purple",
    color: "purple",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 350,
    maxForce: 0.5,
    behaviour: [
      {
        name: "white",
        forceModificator: 1.1
      },
      {
        name: "yellow",
        forceModificator: 1.1
      },
      {
        name: "blue",
        forceModificator: -0.1
      },
      {
        name: "repelent",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -1.3
      }
    ]
  },
  {
    name: "orange",
    color: "#ffaa00",
    radius: 6,
    frictionModificator: 1, 
    forceRadius: 300,
    maxForce: 0.6,
    behaviour: [
      {
        name: "yellow",
        forceModificator: 1
      },
      {
        name: "orange",
        forceModificator: -0.4
      },
      {
        name: "purple",
        forceModificator: -1
      }
    ]
  }
]

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
    this.pos.add(this.speed);
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
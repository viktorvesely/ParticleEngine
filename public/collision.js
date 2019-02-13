class CollisionManager {
  constructor(particles, canvas) {
    this.particles = particles;
    this.checked = [];
    this.canvas = canvas;
  }


  addPair(uid1, uid2) {
    this.checked.push({
      first: uid1,
      second: uid2
    });
  }

  checkPair(uid1, uid2) {
    for (let i = 0; i < this.checked.length; ++i) {
      let pair = this.checked[i];
      let option1 = pair.first === uid1 && pair.second === uid2;
      let option2 = pair.first === uid2 && pair.second === uid1;
      if (option1 || option2) return true;
    }
    return false;
  }

  clearPairs() {
    this.checked = [];
  } 

  outOfBoundaries(particle, canvas) {
    let colliderPredict = new Vector(particle.pos).add(particle.speed);
    let x = colliderPredict.x;
    let y = colliderPredict.y;
    let radius = particle.type.radius;
    if (window.wrapWorld) {
      if (x <= -radius) {
        particle.pos.x = canvas.width + radius;
      } else if (x >= canvas.width - radius) {
        particle.pos.x = -radius;
      }
      
      if (y <= -radius) {
        particle.pos.y = canvas.height + radius;  
      } else if (y >= canvas.height - radius) {
        particle.pos.y = -radius;
      }
    } else {
      if (x <= radius) {
        particle.pos.x = radius;
        particle.speed.x = -particle.speed.x;    
      } else if (x >= canvas.width - radius) {
        particle.pos.x = canvas.width - radius;
        particle.speed.x = -particle.speed.x;
      }
      
      if (y <= radius) {
        particle.pos.y = radius;
        particle.speed.y = -particle.speed.y;
      } else if (y >= canvas.height - radius) {
        particle.pos.y = canvas.height - radius;
        particle.speed.y = -particle.speed.y;
      }
    } 
  }

  collide() {
    for (let i = 0; i < this.particles.length; ++i) {
      let collider = this.particles[i];

      // for (let z = 0; z < this.particles.length; ++z) {
      //   let collidee = this.particles[z];
      //   if (collider.id === collidee.id) continue;
      //   if (this.checkPair(collidee.id, collider.id)) continue;
      //   let colliderPredict = new Vector(collider.pos).add(collider.speed);
      //   let collideePredict = new Vector(collidee.pos).add(collidee.speed);
      //   let delta = new Vector(collideePredict).subtract(colliderPredict);
      //   let minimalDistance = collider.type.radius + collidee.type.radius + this.particlesOffset;
      //   if (delta.length() <= minimalDistance) {
      //     let normal = new Vector(-delta.y, delta.x).unit();
      //     delta.unit();

      //     let erNSize = collider.speed.dot(normal);
      //     let erDSize = collider.speed.dot(delta);
      //     let eeNSize = collidee.speed.dot(normal);
      //     let eeDSize = collidee.speed.dot(delta);

      //     collider.speed = new Vector(
      //       normal.clone().multiply(erNSize)
      //       .add(delta.clone().multiply(eeDSize)));
      //     collidee.speed = new Vector(
      //       normal.clone().multiply(eeNSize)
      //       .add(delta.clone().multiply(erDSize)));
      //   }
      //   this.addPair(collidee.id, collider.id);
      // }
      this.outOfBoundaries(collider, this.canvas);
    }
    // this.clearPairs();
  }

}

CollisionManager.prototype.particlesOffset = 2;

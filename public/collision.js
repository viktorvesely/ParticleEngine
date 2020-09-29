class CollisionManager {
  constructor() {
  }

  outOfBoundaries(particle, width, height, wrapWorld) {
    let colliderPredict = new Vector(particle.pos).add(particle.speed);
    let x = colliderPredict.x;
    let y = colliderPredict.y;
    let radius = particle.radius;
    if (wrapWorld) {
      if (x < 0) {
        particle.pos.x = width;
      } else if (x > width) {
        particle.pos.x = 0;
      }
      
      if (y < 0) {
        particle.pos.y = height;  
      } else if (y > height) {
        particle.pos.y = 0;
      }
    }
  }

}

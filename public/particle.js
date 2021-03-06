const R_SMOOTH = 1000.0;

class Particle {
  constructor(pos) {
    this.pos = pos;
    this.speed = new Vector(0, 0);
    this.id = this.getRandomInt(0, 100000); 
    this.color = this.getRandomColor();
    this.radius = this.getRandomInt(3, 7);
    this.turn = true;

    this.gridX = -1;
    this.gridY = -1;

    this.goalPos = null;
    
    this.energy = this.initEnergy;
  }

  getRandomInt(min, max) {
    let delta = max - min;
    return Math.floor(Math.random() * delta) + min;
  }

  getRandomColor() {
    return this.getRandomInt(0, 16777215);
  }
  
  addForce(force) {
    this.speed.add(force);
  }

  goTo(pos, permanent=true) {
    this.follow = pos;
    this.permanent = permanent;
  }

  searchGoal(x, y, width, height, board) {
    let grid = board.grid;
    let bestCell = -1;
    let bestX = -1;
    let bestY = -1;
    let vision = this.vision;

    for (let dy = -vision; dy <= vision; ++dy) {
      let yg = y + dy;
      if (yg >= height) {
        break;
      }

      if (yg < 0) {
        continue;
      }
      for (let dx = -vision; dx <= vision; ++dx) {
        let xg = x + dx;
        if (xg >= width) {
          break;
        }
  
        if (xg < 0) {
          continue;
        }

        let food = grid[yg][xg][FOOD];

        if (food >= bestCell) {
          bestX = xg;
          bestY = yg;
          bestCell = food;
        }

      }
    }



    if (bestCell !== -1) {
      let currentFood = grid[y][x][FOOD];
      if (bestCell - currentFood >= this.moveThreshold) {
        let coords = board.getMiddle(bestX, bestY);
        this.setGoal(new Vector(coords[0], coords[1]));
      }
    }
  }

  dead() {
    return this.energy < 0;
  }

  moveTowards(delta) {
    let move = this.goalPos.clone().subtract(this.pos);
    let distance = move.length();

    if (distance < 5) {
      this.arrived();
    } else {
      let moveLength = this.moveSpeed * delta / distance;
      move.multiply(moveLength);
      this.speed.add(move);
      this.energy -= moveLength * this.moveCost;
    }
  }

  behave(delta, board, registerOffspring) {
    let grid = board.grid;
    let gridPos = board.getPos(this.pos.x, this.pos.y);
    let x = gridPos[0], y = gridPos[1];
    let height = grid.length;
    let width = grid[0].length

    if (this.energy < 0) {
        return false;
    }

    if (this.energy >= this.reproductionThreshold) {
      this.reproduce(registerOffspring);
    }

    // Decide wether to migrate
    if(this.hasGoal(delta)) {
      this.moveTowards(delta);
    } else {
      this.searchGoal(x, y, width, height, board);
    }

    // Eat
    let ingested = board.eatFood(x, y, this.ingestion);
    this.energy += ingested * this.metabolismEffectiveness - this.metabolism;

    // Apply forces
    this.move(delta);
    return true;
  }

  reproduce(registerOffspring) {
    let offspring = new Particle(
      new Vector(
        this.pos.x + this.getRandomInt(-this.reproductionRadius, this.reproductionRadius),
        this.pos.y + this.getRandomInt(-this.reproductionRadius, this.reproductionRadius)
      )
    )

    offspring.turn = false;

    if (registerOffspring(offspring)) { 
      this.energy -= this.reproductionCost;
    }
  }

  hasGoal() {
    return this.goalPos !== null;
  }

  arrived() {
    this.goalPos = null;
  }

  setGoal(pos) {
    this.goalPos = pos;
  }

  move(delta) {
    this.pos.add(this.speed.clone().multiply(delta));
  }

}

class ParticleData {
  constructor(floatBufferView) {
      this.view = floatBufferView;
      this.i = 1;
  }

  writeBuffer(x, y, color, radius) {
    this.view[this.i++] = x;
    this.view[this.i++] = y;
    this.view[this.i++] = color;
    this.view[this.i++] = radius;
  }


  readFloat() {
    if (this.length() * 16 - 1 < this.i) {
      console.error(this.i);
    }
    let arg = this.view[this.i++];
    return arg;
  }

  readColor() {
    let arg = this.view[this.i++];
    arg = "#" + arg.toString("16");
    return arg;
  }

  finishWrite() {
    this.view[0] = (this.i - 1) / this.getSize();
  }

  length() {
    return this.view[0];
  }

}

ParticleData.prototype.getSize = function() {
  return 4;
}

ParticleData.prototype.getByteSize = function() {
  return ParticleData.prototype.getSize() * 4;
}



Particle.prototype.vision = 10;
Particle.prototype.initEnergy = 20;
Particle.prototype.metabolism = 0.14;
Particle.prototype.moveCost = 0.03;
Particle.prototype.moveThreshold = 0.1;
Particle.prototype.moveSpeed = 0.2;
Particle.prototype.metabolismEffectiveness = 4.5;
Particle.prototype.ingestion = 0.2;
Particle.prototype.reproductionCost = 90;
Particle.prototype.reproductionThreshold = 150;
Particle.prototype.reproductionRadius = 2;

Particle.prototype.maxRadius = 15;
Particle.prototype.minRadius = 10;
Particle.prototype.particlesOffset = 15;
Particle.prototype.repelent_maxForce = 10;
Particle.prototype.repelent_ = 1;
Particle.prototype.repelent_b = (Math.log10(Particle.prototype.repelent_maxForce) / Math.log10(Particle.prototype.repelent_));
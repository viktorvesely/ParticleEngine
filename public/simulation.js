self.importScripts("vector.js");
self.importScripts("particle.js");
self.importScripts("collision.js");
self.importScripts("msg.js");
self.importScripts("optimizer.js");
self.importScripts("board.js");

function now() {
    return performance.now();
}

const IndicatorSize = 4;

class Loop {
    constructor(nParticles, width, height, boardSize) {
        this.particles = [];
        this.width = width;
        this.height = height;
        this.mid = [];

        this.sx = width / 2;
        this.sy = height / 2;
        this.sv = 0;

        this.board = new Board(boardSize[0], boardSize[1], width, height);
        this.gridOptimizer = new GridOptimizer(15, 13, this.width, this.height);

        this.resize();

        //this.bigBang(nParticles);
        this.random(nParticles);

        this.collision = new CollisionManager();
        this.pause = false;
        this.wrapWorld = true;

        this.lastUpdate = -1;
    }

    async start() {
        this.lastUpdate = now();
        while (true) {
            let delta = (now() - this.lastUpdate) * 0.2;
            this.tick(delta);
            this.lastUpdate = now();
            this.pipe();
            await new Promise(r => setTimeout(r, 1));
        }
    }

    resize() {
        this.mid = [
            this.width / 2,
            this.height / 2
        ];
        this.gridOptimizer.resize(this.width, this.height);
        this.board.resize(this.width, this.height);
    }


    tick(deltaTime) {
        if (this.pause) return;
        
        this.pipeBuffer = new ArrayBuffer(this.maxParticles * ParticleData.prototype.getByteSize() + IndicatorSize);
        this.pipeView = new Float32Array(this.pipeBuffer);
        
        let particleData = new ParticleData(this.pipeView); 

        this.gridOptimizer.iterate(section => {
            for(let i = section.length - 1; i >= 0; i--) {
                //debugger;
                let particle = section[i];
                
                // This particle already had one turn this step
                if (!particle.turn) {
                    particle.turn = true;
                    continue;
                }

                // Map boundaries
                this.collision.outOfBoundaries(particle, this.width, this.height, this.wrapWorld);

                // Update grid Position
                this.gridOptimizer.update(particle);
                
                // Friction
                let friction = new Vector(particle.speed)
                    .negative()
                    .multiply(this.frictionCoefficient * deltaTime);
                particle.speed.add(friction);

                // Scare
                let scare = particle.pos.clone().subtract(new Vector(this.sx, this.sy));
                let scareLength = scare.length();
                if (scareLength !== 0) {
                    scare.multiply((this.sv * deltaTime) / (scareLength * scareLength));
                    particle.addForce(scare);
                }

                
                // Interact with others (symmetric interactions) 
                for (let z = i - 1; z >= 0; --z) {
                    let other = section[z]
                    let delta = other.pos.clone().subtract(particle.pos);
                    let deltaLength = delta.length();
                    let minR = particle.radius + other.radius + this.particleOffset;
                    if (deltaLength <= minR) {
                        let repelentForce = delta.clone().divide(deltaLength).multiply(R_SMOOTH * minR * (1.0 / (minR + R_SMOOTH) - 1.0 / (deltaLength + R_SMOOTH)));
                        particle.speed.add(repelentForce.multiply(deltaTime));
                        other.speed.add(repelentForce.multiply(-1));
                    } 
                }

                // Apply behaviour
                if (!particle.behave(deltaTime, this.board, particle => {
                    this.register.call(this, particle);
                })) {
                    let index = this.particles.indexOf(particle);
                    this.particles.splice(index, 1);
                    this.gridOptimizer.removeParticle(particle);
                }
                particle.move(deltaTime);
                particleData.writeBuffer(
                    particle.pos.x,
                    particle.pos.y,
                    particle.color,
                    particle.radius
                );
            }
        });

        this.board.regrow();
        particleData.finishWrite(); 
      }
    

    pipe() {
        postMessage(this.pipeBuffer, [this.pipeBuffer]);
    }

    register(particle) {
        if (this.particles.length === this.maxParticles || this.gridOptimizer.getParticleSize() == this.maxParticles) {
            return false;
        }
        this.particles.push(particle);
        this.gridOptimizer.update(particle);
        return true;
    }

    getRandomInt(min, max) {
        let delta = max - min;
        return Math.floor(Math.random() * delta) + min;
      }


    toggle() {
        this.pause = !this.pause;
    }

    countOnRadius(radius) {
        const maxRadius = 6;
        const offset = maxRadius + 2;
        let circumference = 2 * Math.PI * radius;
        let count = Math.floor(circumference / offset);
        return Math.max(1, count);
    }


    random(nParticles) {
        for (let i = 0; i < nParticles; i++) {
            let x = this.getRandomInt(0, this.width);
            let y = this.getRandomInt(0, this.height);

            let particle = new Particle(new Vector(x, y));
            
            // Update grid Position
            this.gridOptimizer.update(particle);

            this.particles.push(particle);
        }
    }

    bigBang(nParticles) {
        const radiusStep = 20;
        let radius = -radiusStep;
        let currentCount = 0, maxCurrent = 0, count = 0;
        while (count != nParticles) {
            if (currentCount == maxCurrent) {
                radius += radiusStep;
                maxCurrent = this.countOnRadius(radius);
                currentCount = 0;
            }

            let currentAngle = Math.PI * 2 * (currentCount / maxCurrent);
            let x, y;

            x = Math.cos(currentAngle) * radius + this.mid[0];
            y = Math.sin(currentAngle) * radius + this.mid[1];
            x = Math.round(x);
            y = Math.round(y);

            let particle = new Particle(new Vector(x, y));
            
            // Update grid Position
            this.gridOptimizer.update(particle);

            this.particles.push(particle);

            currentCount++;
            count++;
        }
    }


}

Loop.prototype.frictionCoefficient = 0.1;
Loop.prototype.particleOffset = 2;
Loop.prototype.maxParticles = 2500;

loop = null;

onmessage = function (event) {
    let intent = event.data.intent;
    let data = event.data.data;
    switch (intent) {
        case I_SIMULATION_START:
            loop = new Loop(
                data.nParticles,
                data.width,
                data.height,
                data.boardSize
            );
            loop.start();
            break;
        case I_SIMULATION_PAUSE:
            loop.toggle();
            break;
        case I_RESIZE:
            loop.width = data.width;
            loop.height = data.height;
            loop.resize();
            break;
        case I_UPDATE_GRID:
            loop.board.updateGrid(data);
            break;
    }
}
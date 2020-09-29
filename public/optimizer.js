class GridOptimizer {
    constructor(xResolution, yResolution, width, height) {
        this.width = Math.round(xResolution);
        this.height = Math.round(yResolution);
        this.grid = [];

        this.xTransform = null;
        this.yTransform = null;

        this.resize(width, height);

        for (let y = 0; y < this.height; y++) {
            let temp = [];
            for(let x = 0; x < this.width; x++) {
                temp.push([]);
            }
            this.grid.push(temp);
        }
    }

    resize(width, height) {
        this.xTransform = this.width / width;
        this.yTransform = this.height / height;
    }

    cellWidth() {
        return 1 / this.xTransform;
    }

    cellHeight() {
        return 1 / this.yTransform;
    }


    getPos(x, y) {
        return this.grid[
            Math.floor(x * this.xTransform), 
            Math.floor(y * this.yTransform)
        ];
    }

    removeParticle(particle) {
        let x = particle.gridX;
        let y = particle.gridY;
        let section = this.grid[y][x];

        for (let i = 0; i < section.length; i++) {
            let p = section[i];
            if (p.id === particle.id) {
                section.splice(i, 1);
                return;
            } 
        }
    } 

    iterate(callback) {
        for (let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                callback(this.grid[y][x]);
            }
        }
    }

    update(particle) {
        let x = particle.pos.x;
        let y = particle.pos.y;
        let gridY = Math.floor(y * this.yTransform);
        let gridX = Math.floor(x * this.xTransform);

        if (gridX < 0) gridX = 0;
        if (gridX > this.width - 1) gridX = this.width - 1;
        if (gridY < 0) gridY = 0;
        if (gridY > this.height - 1) gridY = this.height - 1;

        if (gridX !== particle.gridX || gridY !== particle.gridY) {
            if (particle.gridX !== -1) {
                this.removeParticle(particle);

                if (particle.gridX < gridX || particle.gridY < gridY) {
                    particle.turn = false;
                }
            }

            particle.gridX = gridX;
            particle.gridY = gridY;

            this.grid[gridY][gridX].push(particle);
        }
    }
}
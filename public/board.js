const FOOD = 0;
const CAP = 1;

class Board {
    constructor(xResolution, yResolution, mapWidth=-1, mapHeight=-1) {

        this.width = Math.round(xResolution);
        this.height = Math.round(yResolution);
        this.grid = [];

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.xTransform = null;
        this.yTransform = null;

        this.resize();

        for (let y = 0; y < this.height; y++) {
            let temp = [];
            for(let x = 0; x < this.width; x++) {
                temp.push([0, 0]);
            }
            this.grid.push(temp);
        }
    }

    updateGrid(grid) {
        this.grid = grid;
    }

    resize(w, h) {
        this.mapWidth = w;
        this.mapHeight = h;
        this.xTransform = this.width / this.mapWidth;
        this.yTransform = this.height / this.mapHeight;
    }

    cellWidth() {
        return 1 / this.xTransform;
    }

    cellHeight() {
        return 1 / this.yTransform;
    }

    eatFood(x, y, value) {
        let ingested = 0;
        let food = this.grid[y][x][FOOD];

        if (value >= food) {
            ingested = food;
            food = 0;
        } else {
            food -= value;
            ingested = value;
        }

        this.grid[y][x][FOOD] = food;

        return ingested;
    }

    loadFromImage(image) {
        for (let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let value = image[y][x];
                this.grid[y][x] = [value, value];
            }
        }
        return this;
    } 

    regrow() {
        for (let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let site = this.grid[y][x];
                let cap = site[CAP];
                let food = site[FOOD];
                
                food += (food * food) * 0.3 + 0.0009;
                food = Math.min(cap, food);
                
                site[FOOD] = food;
            }
        }
    }

    getGrid(x, y) {
        return this.grid[
            Math.floor(y * this.yTransform)
        ][
            Math.floor(x * this.xTransform)
        ];
    }

    getMiddle(xGrid, yGrid) {
        let w = this.cellWidth();
        let h = this.cellHeight();
        let x = xGrid * w + w / 2;
        let y = yGrid * h + h / 2;
        return [x, y];
    }

    getPos(x, y) {
        let gridY = Math.floor(y * this.yTransform);
        let gridX = Math.floor(x * this.xTransform);

        if (gridX < 0) gridX = 0;
        if (gridX > this.width - 1) gridX = this.width - 1;
        if (gridY < 0) gridY = 0;
        if (gridY > this.height - 1) gridY = this.height - 1;

        return [gridX, gridY];
    }

    setGrid(x, y, pressure) {
        let pos = this.getPos(x, y);

        let site = this.grid[pos[1]][pos[0]];
        site[FOOD] = site[CAP] = pressure;
    }

    draw(ctx) {
        for (let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let w = this.cellWidth();
                let h = this.cellHeight();
                let xOr = w * x;
                let yOr = h * y;
                let value = this.grid[y][x][FOOD];

                ctx.beginPath();
                ctx.fillStyle = `rgba(${value * 255}, 0, 0, 0.4)`;
                ctx.fillRect(xOr, yOr, w, h);
            }
        }
    }
}
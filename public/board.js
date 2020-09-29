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
                temp.push(0);
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

    getGrid(x, y) {
        return this.grid[
            Math.floor(y * this.yTransform)
        ][
            Math.floor(x * this.xTransform)
        ];
    }

    getPos(x, y) {
        return this.grid[
            Math.floor(x * this.xTransform), 
            Math.floor(y * this.yTransform)
        ];
    }

    setGrid(x, y, pressure) {
        let boardX = Math.floor(x * this.xTransform);
        let boardY = Math.floor(y * this.yTransform);

        this.grid[boardY][boardX] = pressure;
    }

    draw(ctx) {
        for (let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let w = this.cellWidth();
                let h = this.cellHeight();
                let xOr = w * x;
                let yOr = h * y;
                let value = this.grid[y][x];

                ctx.beginPath();
                ctx.fillStyle = `rgba(${value * 255}, 0, 0, 0.4)`;
                ctx.fillRect(xOr, yOr, w, h);
            }
        }
    }
}
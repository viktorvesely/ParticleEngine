class Pressure {
    constructor(id, drawCallback) {
        this.el = document.getElementById(id);
        
        this.el.addEventListener("pointerdown", e => {
            drawCallback(e.x, e.y, e.pressure);
        });
        
        this.el.addEventListener("pointermove", e => {
            drawCallback(e.x, e.y, e.pressure);
        });

        this.el.addEventListener("pointerup", e => {
            drawCallback(e.x, e.y, null);
        });
    }
}
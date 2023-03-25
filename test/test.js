// 粒子原型
class ReactivePoint {
    constructor(start, end, config) {
        this.start = start;
        this.end = end;
        if (config == null) {
            this.config = this.getDefaultConfig();
        } else {
            this.config = config;
        }
        this.quadratic_current_t = 0.0;
        this.current_x = this.start.x;
        this.current_y = this.start.y;
        this.updateMiddleControlPoint();
    }
    setQuadraticDt(quadratic_dt) {
        this.config.quadratic_dt = quadratic_dt;
    }
    getDefaultConfig() {
        return {
            // 二次贝塞尔曲线 t递增梯度
            quadratic_dt: 0.01,
            // 弯曲程度
            quadratic_curveness: 0.2,
        };
    }
    updateMiddleControlPoint() {
        let mx = (this.start.x + this.end.x) / 2 - (this.start.y - this.end.y) * this.config.quadratic_curveness;
        let my = (this.start.y + this.end.y) / 2 - (this.end.x - this.start.x) * this.config.quadratic_curveness;
        this.middle = {
            mx: mx,
            my: my
        };
    }
    getMiddleControlPoint() {
        return {
            mx: this.middle.mx,
            my: this.middle.my,
        };
    }
    // 缓动函数算法
    // 二次贝塞尔曲线
    quadraticTo() {
        let t = this.quadratic_current_t;
        let calc = function(s, m, e) {
            return (
                s * (1 - t) * (1 - t) + 2 * m * t * (1 - t) + e * t * t              
            );
        };
        this.current_x = calc(this.start.x, this.middle.mx, this.end.x);
        this.current_y = calc(this.start.y, this.middle.my, this.end.y);
        if (this.quadratic_current_t + this.config.quadratic_dt >= 1.0) {
            this.quadratic_current_t = 0.0;
            return true;
        } else {
            this.quadratic_current_t = this.quadratic_current_t + this.config.quadratic_dt;
            return false;
        }
    }
}

// 粒子发射器
class Emitter {
    constructor(context,start, end, count) {
        this.context = context;
        this.start = start;
        this.end = end;
        this.count = count;
        this.emitter = new Array();
        this.initEmit();
    }

    initEmit() {
        let init_quadratic_dt = 0.01;
        for (let i = 0; i < this.count; ++i) {
            let point = new ReactivePoint(this.start, this.end);
            //point.setQuadraticDt(init_quadratic_dt * (i + 1));
            this.emitter.push(point);
        }
    }
    draw() {
        console.log("draw");
        console.log(this.emitter.length);
        for (let i = 0; i < this.emitter.length; ++i) {
            console.log("havv");
            let point = this.emitter[i];
            if (!point.quadraticTo()) {
                this.context.beginPath();
                console.log("point");
                this.context.fillStyle = 'rgba(' + Math.random() * 255 + ','
                + Math.random() * 255 + ',' + Math.random() * 255 + ','
                + Math.random() * 255 + ')';
                //this.context.fillRect(point.current_x, point.current_y, 10, 10);
                this.context.arc(point.current_x, point.current_y, 4, 0, Math.PI * 2, true);
                this.context.fill();
                this.context.closePath();
            }
        }
        let that = this;
        window.requestAnimationFrame(function() {
            that.draw();
        });
    }
}

class App {
    constructor(id) {
        let bgControler = document.getElementById(id);
        if (typeof bgControler == null) {
            return;
        }
        bgControler.width = window.innerWidth;
        bgControler.height = window.innerHeight;
        let bgContext = bgControler.getContext("2d");
        let start = {
            x: 0,
            y: window.innerHeight
        };
        let end = {
            x: window.innerWidth,
            y: 0
        };
        let emiter = new Emitter(bgContext, start, end, 1);
        let clcle = new Emitter(bgContext, end, start, 1);
        let left = {
            x: 0,
            y: 0
        };
        let rb = {
            x: window.innerWidth,
            y: window.innerHeight
        };
        let ltEmitter = new Emitter(bgContext, left, rb, 1);
        let rbEmitter = new Emitter(bgContext, rb, left, 1);
        window.requestAnimationFrame(function() {
            console.log("start");
            emiter.draw();
            clcle.draw();
            ltEmitter.draw();
            rbEmitter.draw();
        });
        /*let start = {
            x: 100,
            y: 100
        };
        let end = {
            x: 200,
            y: 100
        };
        let point = new ReactivePoint(start, end);
        let middle = point.getMiddleControlPoint();
        console.log(middle);
        bgContext.beginPath();
        bgContext.moveTo(start.x, start.y);
        bgContext.strokeStyle = "#000";
        bgContext.lineWidth = 2;
        bgContext.quadraticCurveTo(middle.mx, middle.my, end.x, end.y);
        bgContext.stroke();
        bgContext.closePath();
        bgContext.beginPath();
        bgContext.moveTo(end.x, end.y);
        bgContext.strokeStyle = "#ff0000";
        point = new ReactivePoint(end, start);
        middle = point.getMiddleControlPoint();
        bgContext.quadraticCurveTo(middle.mx, middle.my, start.x, start.y);
        bgContext.stroke();
        bgContext.closePath();
        point = new ReactivePoint(start, end);
        while (!point.quadraticTo()) {
            bgContext.beginPath();
            bgContext.fillStyle = "#00ff00";
            bgContext.fillRect(point.current_x, point.current_y, 1, 1);
            bgContext.closePath();
        }*/
    }
}

let app = new App('marcoEpsilon-bg');
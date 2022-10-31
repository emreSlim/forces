import { Circle, Line, Shape } from "../index";

class Simulation {
  private canvas: HTMLCanvasElement;

  private shapes: Shape[] = [];
  private ball?: Circle;
  private ground?: Line;
  private animationTimerID?: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  init = () => {
    this.addBall();
    this.addGround();
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    this.redraw();
  };

  addBall = () => {
    const ball = new Circle(50);
    ball.setFillColor("red");
    ball.setPosition({ x: 100, y: 100 });
    this.shapes.push(ball);
    this.ball = ball;
  };

  addGround = () => {
    const ground = new Line(
      0,
      this.canvas.height - 10,
      this.canvas.width,
      this.canvas.height - 10
    );
    ground.setStrokeColor("brown");
    this.shapes.push(ground);
    this.ground = ground;
  };

  redraw = (tail = true) => {
    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.fillStyle = "#fff" + (tail ? "4" : "");
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
      for (let shape of this.shapes) {
        shape.draw(ctx);
      }
    }
  };

  onMouseDown = (e: MouseEvent) => {
    if (this.ball?.intersectsPoint(e.offsetX, e.offsetY)) {
      window.addEventListener("mousemove", this.onMouseMove);
      this.startAnimation();
    }
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.ball.intersactsLine(this.ground)) {
      this.ball.movePosition({ x: e.movementX, y: e.movementY });
      if (this.ball.intersactsLine(this.ground))
        this.ball.movePosition({ x: -e.movementX, y: -e.movementY });
    } else {
    }
  };
  onMouseUp = () => {
    window.removeEventListener("mousemove", this.onMouseMove);
    this.stopAnimation();
    this.redraw(false);
  };

  startAnimation = () => {
    const cb = () => {
      this.redraw();
      this.animationTimerID = window.requestAnimationFrame(cb);
    };
    cb();
  };

  stopAnimation = () => {
    window.cancelAnimationFrame(this.animationTimerID);
  };
}

export { Simulation };

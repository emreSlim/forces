import { Circle, Line, Shape } from "../index";
import { Random } from "../../helpers";
class Simulation {
  private canvas: HTMLCanvasElement;

  private shapes: Shape[] = [];
  private balls: Circle[] = [];
  private selectedBall: Circle;
  // private ball?: Circle;
  private ground?: Line;
  private animationTimerID?: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  init = () => {
    this.addBalls();
    this.addGround();
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    this.redraw();
    this.startAnimation();
  };

  addBalls = () => {
    const radius = 2;
    const ballcount = this.canvas.width / (radius * 2) - 1;
    for (let i = 1; i < ballcount; i++) {
      const ball = new Circle(radius);
      ball.setFillColor(`hsl(${(360 / ballcount) * i}, 100%, 45%)`);
      ball.setPosition({ x: radius * 2 * i + i, y: 100 });
      this.shapes.push(ball);
      this.balls.push(ball);

      setTimeout(() => {
        ball.setAcceleration({ y: 50 });
        ball.setVelocity({ x: 0, y: 0 });
        ball.startMoving();
      }, 50 * i);
    }
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
      ctx.fillStyle = "#fff" + (tail ? "1" : "");
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
      for (let shape of this.shapes) {
        shape.draw(ctx);
      }
    }
  };

  onMouseDown = (e: MouseEvent) => {
    for (let ball of this.balls) {
      if (ball.intersectsPoint(e.offsetX, e.offsetY)) {
        window.addEventListener("mousemove", this.onMouseMove);
        ball.stopMoving();
        this.startAnimation();
        this.selectedBall = ball;
        break;
      }
    }
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.selectedBall.intersectsLine(this.ground)) {
      this.selectedBall.movePosition({ x: e.movementX, y: e.movementY });
      if (this.selectedBall.intersectsLine(this.ground))
        this.selectedBall.movePosition({ x: -e.movementX, y: -e.movementY });
    } else {
    }
  };
  onMouseUp = () => {
    window.removeEventListener("mousemove", this.onMouseMove);
    if (!this.selectedBall.isMoving) {
      this.selectedBall.setAcceleration({ y: 980 });
      this.selectedBall.setVelocity({ x: 0, y: 0 });
      this.selectedBall.startMoving();
    }
  };

  startAnimation = () => {
    if (!this.animationTimerID) {
      const cb = () => {
        this.redraw();
        for (let ball of this.balls) {
          const delta = ball.updatePosition();
          if (ball.y + ball.radius > this.ground.y1) {
            ball.movePosition({ y: -delta.y });
            ball.setVelocity({ y: -ball.vy });
          }
        }
        this.animationTimerID = window.requestAnimationFrame(cb);
      };
      cb();
    }
  };

  stopAnimation = () => {
    window.cancelAnimationFrame(this.animationTimerID);
  };
}

export { Simulation };

console.log(window.innerWidth / (window.screen.pixelDepth * 2.54));

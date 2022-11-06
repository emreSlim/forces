import { Circle, Line, Shape } from "../index";
import { Geometry, NumberE, Random } from "../../helpers";
class Simulation {
  private canvas: HTMLCanvasElement;

  private shapes: Shape[] = [];
  private balls: Circle[] = [];
  private selectedBall: Circle;
  // private ball?: Circle;
  private animationTimerID?: number;
  private gravity = 64; //pixel/time**2
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  init = () => {
    this.addBalls();
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("click", this.onClick);
    window.addEventListener("dblclick", this.stopAnimation);
    this.redraw();
    this.startAnimation();
  };

  addBalls = () => {
    const radius = 2;
    const ballcount = 500;
    const maxSpeed = 64;

    for (let i = 0; i < ballcount; i++) {
      const ball = new Circle(radius);
      this.balls.push(ball);
      this.shapes.push(ball);

      ball.setFillColor(Random.color(50));
      ball.setPosition(
        Random.int(this.canvas.width - radius, radius),
        Random.int(this.canvas.height - radius, radius)
      );
      // //movement
      ball.setVelocity(
        Random.int(maxSpeed, -maxSpeed),
        Random.int(maxSpeed, -maxSpeed)
      );
      ball.startMoving();
    }
    // this.balls[0].setPosition(100, 100);
    // this.balls[0].setVelocity(50, 50);
    // this.balls[0].startMoving();
    // this.balls[1].setPosition(200, 200);
    // this.balls[1].setVelocity(-10, -10);
    // this.balls[1].startMoving();

    // this.balls[2].setPosition(300, 400);
    // this.balls[2].setVelocity(20, -20);
    // this.balls[2].startMoving();
    // this.balls[3].setPosition(400, 300);
    // this.balls[3].setVelocity(-10, 10);
    // this.balls[3].startMoving();

    // this.balls[4].setPosition(400, 100);
    // this.balls[4].setVelocity(20, 20);
    // this.balls[4].startMoving();
    // this.balls[5].setPosition(500, 200);
    // this.balls[5].setVelocity(2, 2);
    // this.balls[5].startMoving();
  };

  redraw = (tail = true) => {
    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.fillStyle = "#111" + (tail ? "1" : "");
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
      for (let shape of this.shapes) {
        shape.draw(ctx);
      }
    }
  };

  onClick = (e: MouseEvent) => {
    if (!this.isAnimationRunning()) this.startAnimation();
  };

  onMouseDown = (e: MouseEvent) => {
    for (let ball of this.balls) {
      if (ball.intersectsPoint(e.offsetX, e.offsetY)) {
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.selectedBall = ball;
        ball?.stopMoving();
        break;
      }
    }
  };

  onMouseMove = (e: MouseEvent) => {
    if (this.selectedBall) {
      this.selectedBall.setPosition(
        NumberE.withLimits(
          e.offsetX,
          this.selectedBall.radius,
          this.canvas.width - this.selectedBall.radius
        ),
        NumberE.withLimits(
          e.offsetY,
          this.selectedBall.radius,
          this.canvas.height - this.selectedBall.radius
        )
      );
    }
  };
  onMouseUp = () => {
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.selectedBall?.startMoving();
    this.selectedBall = undefined;
  };

  onTick = () => {
    outer: for (let ball of this.balls) {
      ball.updatePosition();
      if (ball.x > this.canvas.width - ball.radius || ball.x < ball.radius) {
        ball.setPosition(
          NumberE.withLimits(
            ball.x,
            ball.radius,
            this.canvas.width - ball.radius
          )
        );
        ball.setVelocity(-ball.vx);
      }
      if (ball.y > this.canvas.height - ball.radius || ball.y < ball.radius) {
        ball.setPosition(
          undefined,
          NumberE.withLimits(
            ball.y,
            ball.radius,
            this.canvas.height - ball.radius
          )
        );
        ball.setVelocity(undefined, -ball.vy);
      }

      for (let otherBall of this.balls) {
        if (ball == otherBall) continue;
        if (ball.intersactsCircle(otherBall)) {
          ball.collideWith(otherBall);
        }
      }
    }
  };

  startAnimation = () => {
    if (!this.animationTimerID) {
      const cb = () => {
        this.onTick();
        this.redraw();
        this.animationTimerID = window.requestAnimationFrame(cb);
      };
      cb();
    }
  };

  isAnimationRunning = () => !!this.animationTimerID;

  stopAnimation = () => {
    window.cancelAnimationFrame(this.animationTimerID);
    this.animationTimerID = undefined;
  };
}

export { Simulation };

import { Circle, Line, Shape } from '../index';
import { Geometry, NumberE, Random } from '../../helpers';

export interface SimulationOptions {
  /**
   * The minimum radius of the balls
   * @default 5
   */
  radiusMin?: number;
  /**
   * The maximum radius of the balls
   * @default 20
   */
  radiusMax?: number;
  /**
   * The maximum speed of the balls
   * @default 64
   */
  maxInitSpeed?: number;
  /**
   * The number of balls to generate
   * @default (canvas.height * canvas.width) / 10000
   * */
  ballsCount?: number;
  /**
   * Whether to draw a tail for the balls
   * @default true
   */
  tail?: boolean;
  /**
   * The size of the tail
   * @min 0
   * @max 8
   * @default 5
   */
  tailSize?: number;
  /**
   * string in #rrggbb format
   * @default '#111111'
   */
  backgroundColor?: string;
}

export class Simulation {
  private canvas: HTMLCanvasElement;

  private shapes: Shape[] = [];
  private balls: Circle[] = [];
  private selectedBall: Circle;
  // private ball?: Circle;
  private animationTimerID?: number;
  private gravity = 64; //pixel/time**2

  private minRadius: number;
  private maxRadius: number;
  private maxInitSpeed: number;
  private ballsCount: number;
  private tail: boolean;
  private tailSize: string;
  private backgroundColor: string;

  constructor(
    canvas: HTMLCanvasElement,
    {
      radiusMax = 20,
      radiusMin = 5,
      maxInitSpeed = 64,
      ballsCount,
      tail = true,
      tailSize = 5,
      backgroundColor = '#111111',
    }: SimulationOptions = {}
  ) {
    this.canvas = canvas;
    this.minRadius = radiusMin;
    this.maxRadius = radiusMax;
    this.maxInitSpeed = maxInitSpeed;
    this.ballsCount =
      ballsCount ?? (this.canvas.height * this.canvas.width) / 10000;
    this.tail = tail;

    if (tailSize < 0 || tailSize > 10) throw new Error('Invalid tail size');
    tailSize = Math.floor((10 - tailSize) ** 3 * 0.255);

    this.tailSize = NumberE.toHexString(tailSize);

    console.log(this.tailSize);

    if (!this.isRGB(backgroundColor)) throw new Error('Invalid color format');
    this.backgroundColor = backgroundColor;

    canvas.style.backgroundColor = this.backgroundColor;
  }

  isRGB = (color: string) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  init = () => {
    this.addBalls();
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('click', this.onClick);
    window.addEventListener('dblclick', this.stopAnimation);
    this.redraw(this.tail);
    this.startAnimation();
  };

  addBalls = () => {
    const density = 1; //per 100 px^2

    for (let i = 0; i < this.ballsCount; i++) {
      const radius = Random.int(this.maxRadius, this.minRadius);
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
        Random.int(this.maxInitSpeed, -this.maxInitSpeed),
        Random.int(this.maxInitSpeed, -this.maxInitSpeed)
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

  redraw = (tail: boolean) => {
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.fillStyle = this.backgroundColor + (tail ? this.tailSize : '');
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
        this.canvas.addEventListener('mousemove', this.onMouseMove);
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
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
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
        if (ball.intersectsCircle(otherBall)) {
          ball.collideWith(otherBall);
        }
      }
    }
  };

  startAnimation = () => {
    if (!this.animationTimerID) {
      const cb = () => {
        this.onTick();
        this.redraw(this.tail);
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

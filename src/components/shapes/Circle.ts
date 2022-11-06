import { Position } from "../../types";
import { Shape, Line } from ".";
import { Geometry } from "../../helpers/Geometry";

export class Circle extends Shape {
  private _x = 0;
  private _y = 0;
  private _radius: number;
  constructor(radius: number) {
    super();
    this._radius = radius;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public setPosition(x?: number, y?: number) {
    if (isFinite(x)) this._x = x;
    if (isFinite(y)) this._y = y;
  }

  public movePosition(x?: number, y?: number) {
    if (isFinite(x)) this._x += x;
    if (isFinite(y)) this._y += y;
  }

  get radius() {
    return this._radius;
  }

  public setRadius(radius: number) {
    this._radius = radius;
  }

  protected override _updatePosition(dx: number, dy: number): void {
    this.movePosition(dx, dy);
  }

  protected override _draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this._fillColor;
    ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2);
    ctx.fill();
  }

  public intersectsPoint(x: number, y: number) {
    return (
      x > this._x - this._radius &&
      x < this._x + this._radius &&
      y > this._y - this._radius &&
      y < this._y + this._radius
    );
  }

  public intersactsCircle(circle: Circle) {
    return (
      (this._radius + circle._radius) ** 2 >
      (this._x - circle._x) ** 2 + (this._y - circle._y) ** 2
    );
  }

  public intersectsLine(line: Line) {
    function getSlope(x1: number, y1: number, x2: number, y2: number) {
      return (y2 - y1) / (x2 - x1);
    }
    const m1 = getSlope(line.x1, line.y1, line.x2, line.y2);
    const m2 = getSlope(line.x1, line.y1, this._x, this._y);
    const theta = Math.atan((m1 - m2) / (1 + m1 * m2)); // angle between two lines
    const d = (this._x - line.x1) ** 2 + (this._y - line.y1) ** 2; // circle center point distance from line first point
    return d < (this._radius / Math.sin(theta)) ** 2;
  }

  public readonly collideWith = function (circle: Circle) {
    const m1 = Geometry.getSlope(this._x, this._y, circle.x, circle.y);
    const a = Math.atan(m1);
    const centerX = (this._x + circle.x) / 2;
    const centerY = (this._y + circle.y) / 2;

    if (Circle.isCircleApproaching(this, centerX, centerY)) {
      Circle.reflectAgainstSurface(this, a);
      this.updatePosition();
    }
    if (Circle.isCircleApproaching(circle, centerX, centerY)) {
      Circle.reflectAgainstSurface(circle, a);
    }
  };

  public static isCircleApproaching(c: Circle, x: number, y: number) {
    const distanceA = Math.hypot(c.x - (x + c.vx), c.y - (y + c.vy)); //distance 1 tick before
    const distanceB = Math.hypot(c.x + c.vx - x, c.y + c.vy - y); // distance 1 tick after
    return distanceB < distanceA;
  }

  public static reflectAgainstSurface(circle: Circle, a: number) {
    const b = Geometry.getAngle(circle.vx, circle.vy); //approaching angle
    const c = 2 * a - b; //leaving angle
    const v = Math.hypot(circle.vx, circle.vy);
    const vy = Math.sin(c) * v;
    const vx = Math.cos(c) * v;
    circle.setVelocity(vx, vy);
  }
}

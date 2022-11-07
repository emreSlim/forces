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

  get mass() {
    return Math.PI * this._radius ** 2;
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

  get momentum() {
    return Math.hypot(this.vx, this.vy) * this.mass;
  }

  get momentumX() {
    return this.vx * this.mass;
  }

  get momentumY() {
    return this.vy * this.mass;
  }

  get kineticEnergyX() {
    return (this.mass * this.vx ** 2) / 2;
  }

  get kineticEnergyY() {
    return (this.mass * this.vy ** 2) / 2;
  }

  get kineticEnergy() {
    return (this.mass * Math.hypot(this.vx, this.vy) ** 2) / 2;
  }

  get velocity() {
    return Math.hypot(this._vx, this._vy);
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

  public readonly collideWith = function (c2: Circle) {
    let c1: Circle = this;

    const m1 = Geometry.getSlope(c1._x, c1._y, c2.x, c2.y);
    const a = Math.atan(m1);
    const centerX = (c1._x + c2.x) / 2;
    const centerY = (c1._y + c2.y) / 2;

    const [c1vx, c2vx] = Circle.getCollisionVelocities(
      c1.mass,
      c2.mass,
      c1.vx,
      c2.vx
    );

    const [c1vy, c2vy] = Circle.getCollisionVelocities(
      c1.mass,
      c2.mass,
      c1.vy,
      c2.vy
    );

    Circle.reflectAgainstSurface(
      c1,
      c1vx,
      c1vy,
      a,
      Circle.isCircleApproaching(c1, centerX, centerY)
    );
    c1.updatePosition();
    Circle.reflectAgainstSurface(
      c2,
      c2vx,
      c2vy,
      a,
      Circle.isCircleApproaching(c2, centerX, centerY)
    );
    c2.updatePosition();
  };
  /**
   *
   */
  static getCollisionVelocities = (
    m1: number,
    m2: number,
    u1: number,
    u2: number
  ) => {
    let v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
    let v2 = (2 * m1 * u1 + (m2 - m1) * u2) / (m1 + m2);
    return [v1, v2];
  };

  /**
   *
   * @param c given circle object
   * @param x x coordinate of approaching point
   * @param y y coordinate of approaching point
   * @returns
   */
  public static readonly isCircleApproaching = function (
    c: Circle,
    x: number,
    y: number
  ) {
    const distanceA = Math.hypot(c._x - (x + c._vx), c._y - (y + c._vy)); //distance 1 tick before
    const distanceB = Math.hypot(c._x + c._vx - x, c._y + c._vy - y); // distance 1 tick after
    return distanceB < distanceA;
  };
  /**
   *
   * @param circle given circle object
   * @param a angle of line perpendicular to surface
   * @param isApproaching
   */
  public static readonly reflectAgainstSurface = function (
    circle: Circle,
    vx: number,
    vy: number,
    a: number,
    isApproaching: boolean
  ) {
    const b = Geometry.getAngle(circle.vx, circle.vy); //approaching angle

    const c = 2 * a - b; //leaving angle
    const v = Math.hypot(vx, vy);
    const new_vy = Math.sin(c) * v;
    const new_vx = Math.cos(c) * v;
    if (isApproaching) {
      circle.setVelocity(new_vx, new_vy);
    } else {
      circle.setVelocity(vx, vy);
    }
  };
}

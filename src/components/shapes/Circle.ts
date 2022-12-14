import { Position } from "../../types";
import { Shape, Line } from ".";

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

  public setPosition({ x, y }: Partial<Position>) {
    if (x) this._x = x;
    if (y) this._y = y;
  }

  public movePosition({ x, y }: Partial<Position>) {
    if (x) this._x += x;
    if (y) this._y += y;
  }

  get radius() {
    return this._radius;
  }

  public setRadius(radius: number) {
    this._radius = radius;
  }

  protected override _updatePosition(dx: number, dy: number): void {
    this.movePosition({ x: dx, y: dy });
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
      (this._radius + circle._radius) ** 2 <
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
}

import { Shape } from "./Shape";

export class Circle extends Shape {
  private _radius: number;
  constructor(radius: number) {
    super();
    this._radius = radius;
  }

  get radius() {
    return this._radius;
  }

  setRadius(radius: number) {
    this._radius = radius;
  }

  protected _draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this._fillColor;
    ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

import { Shape } from ".";

export class Line extends Shape {
  private _x1: number;
  private _y1: number;
  private _x2: number;
  private _y2: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
  }

  public get x1(): number {
    return this._x1;
  }

  public get y1(): number {
    return this._y1;
  }
  public get x2(): number {
    return this._x2;
  }

  public get y2(): number {
    return this._y2;
  }

  public setPosition({
    x1,
    y1,
    x2,
    y2,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }) {
    if (x1) this._x1 = x1;
    if (y1) this._y1 = y1;
    if (x2) this._x2 = x2;
    if (y2) this._y2 = y2;
  }

  protected _draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 2;
    ctx.moveTo(this._x1, this._y1);
    ctx.lineTo(this._x2, this._y2);
    ctx.stroke();
  }
}

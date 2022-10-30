import { Position } from "../../types";

export abstract class Shape {
  protected _x = 0;
  protected _y = 0;
  protected _vx = 0;
  protected _vy = 0;
  protected _fillColor = "#000";
  protected _strokeColor = "#000";
  protected _strokeWidth = 1;

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
  public get vx(): number {
    return this._vx;
  }

  public get vy(): number {
    return this._vy;
  }

  public setVelocity({ x, y }: Partial<Position>) {
    if (x) this._vx = x;
    if (y) this._vy = y;
  }

  public get fillColor(): string {
    return this._fillColor;
  }

  public setFillColor(fillColor: string) {
    this._fillColor = fillColor;
  }

  public get strokeColor(): string {
    return this._strokeColor;
  }

  public setStrokeColor(strokeColor: string) {
    this._strokeColor = strokeColor;
  }

  public get strokeWidth(): number {
    return this._strokeWidth;
  }

  public setStrokeWidth(strokeWidth: number) {
    this._strokeWidth = strokeWidth;
  }

  protected abstract _draw(ctx: CanvasRenderingContext2D): void;

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    this._draw(ctx);
    ctx.restore();
  }
}

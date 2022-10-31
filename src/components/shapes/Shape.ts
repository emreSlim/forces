import { Position } from "../../types";

export abstract class Shape {
  //velocity
  protected _vx = 0;
  protected _vy = 0;
  //acceleration
  protected _ax = 0;
  protected _ay = 0;
  protected _fillColor = "#000";
  protected _strokeColor = "#000";
  protected _strokeWidth = 1;
  protected _timestamp: number = undefined;
  protected _isMoving = false;
  constructor() {}

  public get ax(): number {
    return this._ax;
  }

  public get ay(): number {
    return this._ay;
  }

  public setAcceleration({ x, y }: Partial<Position>) {
    if (x) this._ax = x;
    if (y) this._ay = y;
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

  public startMoving() {
    this._timestamp = Date.now();
    this._isMoving = true;
  }

  get timeStamp() {
    return this._timestamp;
  }

  public setTimeStamp(time: number) {
    this._timestamp = time;
  }

  public get isMoving() {
    return this._isMoving;
  }

  protected abstract _updatePosition(dx: number, dy: number): void;

  public updatePosition() {
    if (this._timestamp) {
      const oldTime = this._timestamp;
      this._timestamp = Date.now();
      const passedTime = (this._timestamp - oldTime) / 1000;
      this._vx += this._ax * passedTime;
      this._vy += this._ay * passedTime;
      const delta = { x: this._vx * passedTime, y: this._vy * passedTime };
      this._updatePosition(delta.x, delta.y);
      return delta;
    }
  }

  public stopMoving() {
    this._timestamp = undefined;
    this._isMoving = false;
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

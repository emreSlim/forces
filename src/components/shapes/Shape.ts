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
  readonly tickLength = 0.02;

  constructor() {}

  public get ax(): number {
    return this._ax;
  }

  public get ay(): number {
    return this._ay;
  }

  public setAcceleration(x?: number, y?: number) {
    if (isFinite(x)) this._ax = x;
    if (isFinite(y)) this._ay = y;
  }

  public get vx(): number {
    return this._vx;
  }

  public get vy(): number {
    return this._vy;
  }

  public setVelocity(x?: number, y?: number) {
    if (isFinite(x)) this._vx = x;
    if (isFinite(y)) this._vy = y;
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

  public updatePosition(passedTime = this.tickLength, accelerate = true) {
    if (!this._isMoving) return;

    if (accelerate) {
      this._vx += this._ax * passedTime; // v = u + a*t
      this._vy += this._ay * passedTime;
    }
    this._updatePosition(this._vx * passedTime, this._vy * passedTime);
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

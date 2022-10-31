import React from "react";
import { Circle, Line, Shape } from "..";

class Canvas extends React.PureComponent {
  private readonly CANVAS_ID = "canvas";
  private readonly WIDTH = window.innerWidth - 50;
  private readonly HEIGHT = window.innerHeight - 100;
  private ctx: CanvasRenderingContext2D | null = null;
  private shapes: Shape[] = [];
  private ball?: Circle;
  private ground?: Line;
  private timerID?: number;
  componentDidMount = () => {
    const canvas = document.getElementById(
      this.CANVAS_ID
    ) as HTMLCanvasElement | null;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      this.ctx = ctx;

      this.addBall();
      this.addGround();
      this.redraw();
    }
  };

  addBall = () => {
    const ball = new Circle(50);
    ball.setFillColor("red");
    ball.setPosition({ x: 100, y: 100 });
    this.shapes.push(ball);
    this.ball = ball;
  };

  addGround = () => {
    const ground = new Line(0, this.HEIGHT - 10, this.WIDTH, this.HEIGHT - 10);
    ground.setStrokeColor("brown");
    this.shapes.push(ground);
    this.ground = ground;
  };

  redraw = () => {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.fillStyle = "#fff4";
      this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
      this.ctx.restore();
      for (let shape of this.shapes) {
        shape.draw(this.ctx);
      }
    }
  };

  onMouseDown = () => {};
  onMouseUp = () => {};

  render = () => {
    return (
      <canvas width={this.WIDTH} height={this.HEIGHT} id={this.CANVAS_ID} />
    );
  };
}

export { Canvas };

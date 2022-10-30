import React from "react";
import { Circle } from "..";

class Canvas extends React.Component {
  private readonly CANVAS_ID = "canvas";
  private readonly WIDTH = window.innerWidth;
  private readonly HEIGHT = window.innerHeight - 100;
  private ctx: CanvasRenderingContext2D | null = null;

  componentDidMount = () => {
    console.log("mounted");
    const canvas = document.getElementById(
      this.CANVAS_ID
    ) as HTMLCanvasElement | null;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      this.ctx = ctx;
      if (ctx) {
        this.drawCircle();
      }
    }
  };

  drawCircle = () => {
    if (this.ctx) {
      const circle = new Circle(50);
      circle.setFillColor("red");
      circle.setPosition({ x: 100, y: 100 });
      circle.draw(this.ctx);
    }
  };
  render = () => {
    return (
      <canvas width={this.WIDTH} height={this.HEIGHT} id={this.CANVAS_ID} />
    );
  };
}

export { Canvas };

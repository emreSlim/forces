import React from "react";
import { Circle } from "./shapes";

class App extends React.Component {
  private readonly CANVAS_ID = "canvas";
  private readonly WIDTH = window.innerWidth;
  private readonly HEIGHT = window.innerHeight - 100;
  private ctx: CanvasRenderingContext2D | null = null;

  componentDidMount = () => {
    console.log("mount");
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
      <div className="App">
        <h1>Forces</h1>
        <canvas width={this.WIDTH} height={this.HEIGHT} id={this.CANVAS_ID} />
      </div>
    );
  };
}

export default App;
